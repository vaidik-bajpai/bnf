// app/actions/forum.ts
"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import {
    getMegaThreads as getMockMegaThreads,
    getMegaThreadById as getMockMegaThreadById,
    getAllDiscussions as getMockDiscussions,
    getDiscussionById as getMockDiscussionById,
    getPostsByDiscussionId as getMockPostsByDiscussionId,
    addMockDiscussion,
    addMockPost,
    toggleMockLike,
    updateMockDiscussion,
    deleteMockDiscussion,
    updateMockPost,
    deleteMockPost,
} from "@/data/forumData";

// Helper to resolve an author ID (from session or default fallback scholar)
async function getEffectiveUserId(explicitUserId?: string): Promise<string> {
    if (explicitUserId) {
        const user = await prisma.user.findUnique({
            where: { id: explicitUserId },
            select: { id: true },
        }).catch(() => null);
        if (user) return user.id;
    }

    try {
        const session = await auth();
        if (session?.user?.id) return session.user.id;
    } catch {
        // Outside Next.js request context (e.g. tests or build-time)
    }

    // Fallback to first seeded scholar for guest actions so database operations succeed
    const defaultUser = await prisma.user.findFirst({
        where: { email: "arjun@indicforum.in" },
    });
    if (defaultUser) return defaultUser.id;

    // Create a default guest scholar user if none exists
    const guest = await prisma.user.upsert({
        where: { email: "guest@indicforum.in" },
        update: {},
        create: {
            name: "Guest Scholar",
            email: "guest@indicforum.in",
            username: "guest_scholar",
            initials: "GS",
            bg: "#2D6A4F",
        },
    });
    return guest.id;
}

function safeRevalidate(path: string = "/") {
    try {
        revalidatePath(path);
    } catch {
        // Outside Next.js request context (e.g. tests or build-time)
    }
}

export async function getMegaThreadsAction() {
    try {
        const dbMegaThreads = await prisma.megaThread.findMany({
            include: {
                category: true,
                _count: { select: { discussions: true } },
            },
            orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
        });

        if (dbMegaThreads.length > 0) {
            return dbMegaThreads.map((m) => ({
                id: m.id,
                title: m.title,
                description: m.description,
                category: m.categoryId,
                categoryLabel: m.category.name,
                discussionCount: m._count.discussions || m.discussionCount,
                participantCount: m.participantCount,
                featured: m.featured,
                tags: m.tags,
                createdAt: m.createdAt.toISOString(),
                updatedAt: m.updatedAt.toISOString(),
            }));
        }
    } catch (error) {
        console.error("[getMegaThreadsAction error]:", error);
    }
    return getMockMegaThreads();
}

export async function getMegaThreadByIdAction(id: string) {
    try {
        const mt = await prisma.megaThread.findUnique({
            where: { id },
            include: {
                category: true,
                discussions: {
                    include: {
                        author: true,
                        category: true,
                        _count: { select: { posts: true } },
                    },
                    orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
                },
            },
        });

        if (mt) {
            return {
                id: mt.id,
                title: mt.title,
                description: mt.description,
                category: mt.categoryId,
                categoryLabel: mt.category.name,
                discussionCount: mt.discussions.length,
                participantCount: mt.participantCount,
                featured: mt.featured,
                tags: mt.tags,
                createdAt: mt.createdAt.toISOString(),
                updatedAt: mt.updatedAt.toISOString(),
                discussions: mt.discussions.map((d) => ({
                    id: d.id,
                    megaThreadId: d.megaThreadId ?? undefined,
                    title: d.title,
                    excerpt: d.excerpt,
                    body: d.body,
                    author: {
                        name: d.author.name || "Member",
                        username: d.author.username || "member",
                        initials: d.author.initials || "ME",
                        bg: d.author.bg || "#B85428",
                        image: d.author.image || undefined,
                    },
                    category: d.categoryId,
                    categoryLabel: d.category.name,
                    replies: d._count.posts,
                    replyCount: d._count.posts,
                    views: d.views,
                    viewCount: d.views,
                    lastActivity: d.lastActivity.toISOString(),
                    createdAt: d.createdAt.toISOString(),
                    updatedAt: d.updatedAt.toISOString(),
                    pinned: d.pinned,
                    tags: d.tags,
                })),
            };
        }
    } catch (error) {
        console.error("[getMegaThreadByIdAction error]:", error);
    }
    return getMockMegaThreadById(id) || null;
}

export async function getDiscussions(params?: {
    categoryId?: string | null;
    megaThreadId?: string | null;
    search?: string;
    sortBy?: "latest" | "trending" | "pinned";
}) {
    try {
        const { categoryId, megaThreadId, search, sortBy = "latest" } = params || {};

        const whereClause: Prisma.DiscussionWhereInput = {};
        if (categoryId) whereClause.categoryId = categoryId;
        if (megaThreadId) whereClause.megaThreadId = megaThreadId;
        if (search) {
            whereClause.OR = [
                { title: { contains: search, mode: "insensitive" } },
                { excerpt: { contains: search, mode: "insensitive" } },
                { tags: { has: search.toLowerCase() } },
            ];
        }

        let orderBy: Prisma.DiscussionOrderByWithRelationInput[] = [{ createdAt: "desc" }];
        if (sortBy === "trending") orderBy = [{ views: "desc" }];
        else if (sortBy === "pinned") orderBy = [{ pinned: "desc" }, { createdAt: "desc" }];

        const dbList = await prisma.discussion.findMany({
            where: whereClause,
            orderBy,
            include: {
                author: {
                    select: { id: true, name: true, username: true, initials: true, bg: true, image: true },
                },
                category: true,
                megaThread: true,
                _count: { select: { posts: true } },
            },
        });

        if (dbList.length > 0) {
            return dbList.map((d) => ({
                id: d.id,
                megaThreadId: d.megaThreadId ?? undefined,
                megaThreadTitle: d.megaThread?.title,
                title: d.title,
                excerpt: d.excerpt,
                body: d.body,
                authorId: d.authorId,
                author: {
                    id: d.author.id,
                    name: d.author.name || "Member",
                    username: d.author.username || "member",
                    initials: d.author.initials || "ME",
                    bg: d.author.bg || "#B85428",
                    image: d.author.image || undefined,
                },
                category: d.categoryId,
                categoryLabel: d.category.name,
                categoryColor: d.category.color,
                replies: d._count.posts,
                replyCount: d._count.posts,
                views: d.views,
                viewCount: d.views,
                lastActivity: d.lastActivity.toISOString(),
                createdAt: d.createdAt.toISOString(),
                updatedAt: d.updatedAt.toISOString(),
                pinned: d.pinned,
                tags: d.tags,
            }));
        }
    } catch (error) {
        console.error("[getDiscussions error]:", error);
    }
    return getMockDiscussions();
}

export async function getThreadById(id: string, clientUserId?: string) {
    try {
        // Increment view count
        await prisma.discussion.update({
            where: { id },
            data: { views: { increment: 1 } },
        }).catch(() => {});

        let currentUserId = clientUserId;
        if (!currentUserId) {
            try {
                const session = await auth();
                currentUserId = session?.user?.id;
            } catch {
                // Outside request context
            }
        }

        const disc = await prisma.discussion.findUnique({
            where: { id },
            include: {
                author: {
                    select: { id: true, name: true, username: true, initials: true, bg: true, image: true },
                },
                category: true,
                megaThread: true,
                discussionLikes: {
                    include: {
                        user: {
                            select: { id: true, name: true, username: true, initials: true, bg: true, image: true },
                        },
                    },
                },
                posts: {
                    orderBy: { createdAt: "asc" },
                    include: {
                        author: {
                            select: { id: true, name: true, username: true, initials: true, bg: true, image: true },
                        },
                        postLikes: {
                            include: {
                                user: {
                                    select: { id: true, name: true, username: true, initials: true, bg: true, image: true },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (disc) {
            const isDiscussionLiked = Boolean(
                currentUserId && disc.discussionLikes.some((dl) => dl.userId === currentUserId)
            );
            const discussionLikedBy = disc.discussionLikes.map((dl) => ({
                id: dl.user.id,
                name: dl.user.name || "Scholar",
                username: dl.user.username || undefined,
                initials: dl.user.initials || "S",
                bg: dl.user.bg || "#B85428",
                image: dl.user.image || undefined,
            }));

            return {
                id: disc.id,
                megaThreadId: disc.megaThreadId ?? undefined,
                megaThreadTitle: disc.megaThread?.title,
                title: disc.title,
                excerpt: disc.excerpt,
                body: disc.body,
                authorId: disc.authorId,
                author: {
                    id: disc.author.id,
                    name: disc.author.name || "Member",
                    username: disc.author.username || "member",
                    initials: disc.author.initials || "ME",
                    bg: disc.author.bg || "#B85428",
                    image: disc.author.image || undefined,
                },
                category: disc.categoryId,
                categoryLabel: disc.category.name,
                categoryColor: disc.category.color,
                views: disc.views,
                viewCount: disc.views,
                likes: disc.discussionLikes.length,
                isLiked: isDiscussionLiked,
                likedBy: discussionLikedBy,
                tags: disc.tags,
                createdAt: disc.createdAt.toISOString(),
                updatedAt: disc.updatedAt.toISOString(),
                lastActivity: disc.lastActivity.toISOString(),
                posts: disc.posts.map((p) => {
                    const isPostLiked = Boolean(
                        currentUserId && p.postLikes.some((pl) => pl.userId === currentUserId)
                    );
                    const postLikedBy = p.postLikes.map((pl) => ({
                        id: pl.user.id,
                        name: pl.user.name || "Scholar",
                        username: pl.user.username || undefined,
                        initials: pl.user.initials || "S",
                        bg: pl.user.bg || "#B85428",
                        image: pl.user.image || undefined,
                    }));

                    return {
                        id: p.id,
                        discussionId: p.discussionId,
                        content: p.content,
                        replyToPostId: p.replyToPostId,
                        createdAt: p.createdAt.toISOString(),
                        updatedAt: p.updatedAt.toISOString(),
                        likes: p.postLikes.length,
                        isLiked: isPostLiked,
                        likedBy: postLikedBy,
                        authorId: p.authorId,
                        author: {
                            id: p.author.id,
                            name: p.author.name || "Member",
                            username: p.author.username || "member",
                            initials: p.author.initials || "ME",
                            bg: p.author.bg || "#B85428",
                            image: p.author.image || undefined,
                        },
                    };
                }),
            };
        }
    } catch (error) {
        console.error("[getThreadById error]:", error);
    }

    // Fallback to mock data
    const mockDisc = getMockDiscussionById(id);
    if (!mockDisc) return null;
    const mockPosts = getMockPostsByDiscussionId(id);
    return {
        ...mockDisc,
        isLiked: false,
        posts: mockPosts.map((p) => ({ ...p, isLiked: false })),
    };
}

export async function createDiscussion(formData: {
    title: string;
    excerpt?: string;
    body: string;
    megaThreadId?: string;
    categoryId: string;
    tags: string[];
    authorId?: string;
}) {
    const { title, excerpt, body, megaThreadId, categoryId, tags, authorId } = formData;
    const effectiveExcerpt = excerpt || (body.length > 160 ? body.slice(0, 160) + "..." : body);

    try {
        const userId = await getEffectiveUserId(authorId);

        // Verify category exists, or fallback to first available
        let validCategoryId = categoryId;
        const categoryExists = await prisma.category.findUnique({ where: { id: categoryId } });
        if (!categoryExists) {
            const firstCategory = await prisma.category.findFirst();
            if (firstCategory) validCategoryId = firstCategory.id;
        }

        // Verify megaThreadId if supplied
        let validMegaThreadId: string | null = null;
        if (megaThreadId) {
            const megaExists = await prisma.megaThread.findUnique({ where: { id: megaThreadId } });
            if (megaExists) validMegaThreadId = megaThreadId;
        }

        const discussion = await prisma.discussion.create({
            data: {
                title,
                excerpt: effectiveExcerpt,
                body,
                megaThreadId: validMegaThreadId,
                categoryId: validCategoryId,
                tags: tags.map((t) => t.trim().toLowerCase()),
                authorId: userId,
            },
        });

        // Create the opening Post (OP) in database
        await prisma.post.create({
            data: {
                content: body,
                discussionId: discussion.id,
                authorId: userId,
                replyToPostId: null,
                likes: 1,
            },
        });

        // Update counts
        await prisma.category.update({
            where: { id: validCategoryId },
            data: { count: { increment: 1 } },
        }).catch(() => {});

        if (validMegaThreadId) {
            await prisma.megaThread.update({
                where: { id: validMegaThreadId },
                data: { discussionCount: { increment: 1 } },
            }).catch(() => {});
        }

        safeRevalidate("/");
        return discussion;
    } catch (error) {
        console.error("[createDiscussion error, falling back to mock]:", error);
        return addMockDiscussion({
            title,
            body,
            megaThreadId: megaThreadId || "mega-history",
            categoryId,
            tags,
            author: {
                name: "Member",
                username: "scholar",
                initials: "ME",
                bg: "#B85428",
            },
        });
    }
}

export async function postReply(data: {
    discussionId: string;
    content: string;
    replyToPostId?: string | null;
    authorId?: string;
}) {
    const { discussionId, content, replyToPostId, authorId } = data;

    try {
        const userId = await getEffectiveUserId(authorId);

        // Check if discussion exists in DB
        const discussionExists = await prisma.discussion.findUnique({ where: { id: discussionId } });
        if (!discussionExists) {
            throw new Error(`Discussion ${discussionId} not found in DB`);
        }

        // Check if replyToPostId exists in DB if provided
        let validReplyToPostId: string | null = null;
        if (replyToPostId) {
            const postExists = await prisma.post.findUnique({ where: { id: replyToPostId } });
            if (postExists) {
                validReplyToPostId = replyToPostId;
            }
        }

        const post = await prisma.post.create({
            data: {
                content,
                discussionId,
                authorId: userId,
                replyToPostId: validReplyToPostId,
            },
            include: {
                author: {
                    select: { id: true, name: true, username: true, initials: true, bg: true, image: true },
                },
            },
        });

        await prisma.discussion.update({
            where: { id: discussionId },
            data: { lastActivity: new Date() },
        }).catch(() => {});

        safeRevalidate("/");
        return {
            id: post.id,
            discussionId: post.discussionId,
            content: post.content,
            replyToPostId: post.replyToPostId,
            createdAt: post.createdAt.toISOString(),
            updatedAt: post.updatedAt.toISOString(),
            likes: post.likes,
            authorId: post.authorId,
            author: {
                id: post.author.id,
                name: post.author.name || "Member",
                username: post.author.username || "member",
                initials: post.author.initials || "ME",
                bg: post.author.bg || "#B85428",
                image: post.author.image || undefined,
            },
        };
    } catch (error) {
        console.error("[postReply error, falling back to mock]:", error);
        return addMockPost({
            discussionId,
            content,
            author: {
                name: "Member",
                username: "scholar",
                initials: "ME",
                bg: "#B85428",
            },
            replyToPostId: replyToPostId || null,
        });
    }
}

export async function updateDiscussion(
    id: string,
    data: {
        title?: string;
        body?: string;
        categoryId?: string;
        tags?: string[];
    },
    clientUserId?: string
) {
    try {
        const userId = await getEffectiveUserId(clientUserId);

        const existing = await prisma.discussion.findUnique({
            where: { id },
            select: { id: true, authorId: true, categoryId: true },
        });

        if (!existing) {
            throw new Error(`Discussion ${id} not found`);
        }

        if (existing.authorId !== userId) {
            throw new Error("Unauthorized: only author can edit this discussion");
        }

        const updateData: Prisma.DiscussionUpdateInput = {};
        if (data.title) updateData.title = data.title;
        if (data.tags) updateData.tags = data.tags.map((t) => t.trim().toLowerCase());
        if (data.body) {
            updateData.body = data.body;
            updateData.excerpt = data.body.length > 160 ? data.body.slice(0, 160) + "..." : data.body;
        }
        if (data.categoryId && data.categoryId !== existing.categoryId) {
            const categoryExists = await prisma.category.findUnique({ where: { id: data.categoryId } });
            if (categoryExists) {
                updateData.category = { connect: { id: data.categoryId } };
                await prisma.category.update({ where: { id: existing.categoryId }, data: { count: { decrement: 1 } } }).catch(() => {});
                await prisma.category.update({ where: { id: data.categoryId }, data: { count: { increment: 1 } } }).catch(() => {});
            }
        }

        const updated = await prisma.discussion.update({
            where: { id },
            data: updateData,
            include: {
                author: {
                    select: { id: true, name: true, username: true, initials: true, bg: true, image: true },
                },
                category: {
                    select: { id: true, name: true, color: true },
                },
            },
        });

        // Update opening post (OP) if body changed
        if (data.body) {
            const opPost = await prisma.post.findFirst({
                where: { discussionId: id, replyToPostId: null },
                orderBy: { createdAt: "asc" },
            });
            if (opPost) {
                await prisma.post.update({
                    where: { id: opPost.id },
                    data: { content: data.body },
                });
            }
        }

        safeRevalidate("/");
        return {
            id: updated.id,
            title: updated.title,
            body: updated.body,
            excerpt: updated.excerpt,
            megaThreadId: updated.megaThreadId ?? undefined,
            categoryId: updated.categoryId,
            category: updated.categoryId,
            categoryLabel: updated.category?.name || "General",
            categoryColor: updated.category?.color || "#B85428",
            tags: updated.tags,
            views: updated.views,
            viewCount: updated.views,
            createdAt: updated.createdAt.toISOString(),
            updatedAt: updated.updatedAt.toISOString(),
            lastActivity: updated.lastActivity.toISOString(),
            authorId: updated.authorId,
            author: {
                id: updated.author.id,
                name: updated.author.name || "Member",
                username: updated.author.username || "member",
                initials: updated.author.initials || "ME",
                bg: updated.author.bg || "#B85428",
                image: updated.author.image || undefined,
            },
        };
    } catch (error) {
        if (error instanceof Error && error.message.includes("Unauthorized")) {
            throw error;
        }
        console.error("[updateDiscussion error, falling back to mock]:", error);
        return updateMockDiscussion(id, data);
    }
}

export async function deleteDiscussion(id: string, clientUserId?: string) {
    try {
        const userId = await getEffectiveUserId(clientUserId);

        const existing = await prisma.discussion.findUnique({
            where: { id },
            select: { id: true, authorId: true, categoryId: true, megaThreadId: true },
        });

        if (!existing) {
            throw new Error(`Discussion ${id} not found`);
        }

        if (existing.authorId !== userId) {
            throw new Error("Unauthorized: only author can delete this discussion");
        }

        await prisma.discussion.delete({
            where: { id },
        });

        await prisma.category.update({
            where: { id: existing.categoryId },
            data: { count: { decrement: 1 } },
        }).catch(() => {});

        if (existing.megaThreadId) {
            await prisma.megaThread.update({
                where: { id: existing.megaThreadId },
                data: { discussionCount: { decrement: 1 } },
            }).catch(() => {});
        }

        safeRevalidate("/");
        return { success: true, id };
    } catch (error) {
        if (error instanceof Error && error.message.includes("Unauthorized")) {
            throw error;
        }
        console.error("[deleteDiscussion error, falling back to mock]:", error);
        const success = deleteMockDiscussion(id);
        return { success, id };
    }
}

export async function updatePost(
    id: string,
    data: {
        content: string;
    },
    clientUserId?: string
) {
    try {
        const userId = await getEffectiveUserId(clientUserId);

        const existing = await prisma.post.findUnique({
            where: { id },
            select: { id: true, authorId: true, discussionId: true, replyToPostId: true },
        });

        if (!existing) {
            throw new Error(`Post ${id} not found`);
        }

        if (existing.authorId !== userId) {
            throw new Error("Unauthorized: only author can edit this reply");
        }

        const updated = await prisma.post.update({
            where: { id },
            data: {
                content: data.content,
            },
            include: {
                author: {
                    select: { id: true, name: true, username: true, initials: true, bg: true, image: true },
                },
            },
        });

        if (!existing.replyToPostId) {
            const excerpt = data.content.length > 160 ? data.content.slice(0, 160) + "..." : data.content;
            await prisma.discussion.update({
                where: { id: existing.discussionId },
                data: { body: data.content, excerpt },
            }).catch(() => {});
        }

        safeRevalidate("/");
        return {
            id: updated.id,
            discussionId: updated.discussionId,
            content: updated.content,
            replyToPostId: updated.replyToPostId,
            createdAt: updated.createdAt.toISOString(),
            updatedAt: updated.updatedAt.toISOString(),
            likes: updated.likes,
            authorId: updated.authorId,
            author: {
                id: updated.author.id,
                name: updated.author.name || "Member",
                username: updated.author.username || "member",
                initials: updated.author.initials || "ME",
                bg: updated.author.bg || "#B85428",
                image: updated.author.image || undefined,
            },
        };
    } catch (error) {
        if (error instanceof Error && error.message.includes("Unauthorized")) {
            throw error;
        }
        console.error("[updatePost error, falling back to mock]:", error);
        return updateMockPost(id, data.content);
    }
}

export async function deletePost(id: string, clientUserId?: string) {
    try {
        const userId = await getEffectiveUserId(clientUserId);

        const existing = await prisma.post.findUnique({
            where: { id },
            select: { id: true, authorId: true, discussionId: true, replyToPostId: true },
        });

        if (!existing) {
            throw new Error(`Post ${id} not found`);
        }

        if (existing.authorId !== userId) {
            throw new Error("Unauthorized: only author can delete this reply");
        }

        if (!existing.replyToPostId) {
            const totalPosts = await prisma.post.count({ where: { discussionId: existing.discussionId } });
            if (totalPosts <= 1) {
                return await deleteDiscussion(existing.discussionId, clientUserId);
            }
        }

        await prisma.post.delete({
            where: { id },
        });

        await prisma.discussion.update({
            where: { id: existing.discussionId },
            data: { lastActivity: new Date() },
        }).catch(() => {});

        safeRevalidate("/");
        return { success: true, id, discussionId: existing.discussionId };
    } catch (error) {
        if (error instanceof Error && error.message.includes("Unauthorized")) {
            throw error;
        }
        console.error("[deletePost error, falling back to mock]:", error);
        const success = deleteMockPost(id);
        return { success, id };
    }
}

/**
 * Toggle Like / Unlike for discussions and posts.
 * If user already liked the item -> UNLIKE (delete like relation, decrement count).
 * If user has not liked the item -> LIKE (create like relation, increment count).
 */
export async function toggleLike(
    type: "discussion" | "post",
    id: string,
    actionPreference?: "like" | "unlike",
    clientUserId?: string
): Promise<{ liked: boolean; likes: number }> {
    try {
        const userId = await getEffectiveUserId(clientUserId);

        if (type === "discussion") {
            const dbDiscussion = await prisma.discussion.findUnique({ where: { id } });
            if (!dbDiscussion) {
                throw new Error(`Discussion ${id} not found in DB`);
            }

            const existingLike = await prisma.discussionLike.findUnique({
                where: {
                    userId_discussionId: {
                        userId,
                        discussionId: id,
                    },
                },
            });

            if (existingLike) {
                // User ALREADY liked this discussion
                if (actionPreference === "like") {
                    // Idempotent: already liked, return current count without duplicate increment
                    const currentCount = await prisma.discussionLike.count({ where: { discussionId: id } });
                    return { liked: true, likes: currentCount };
                }

                // UNLIKE: remove like relation
                await prisma.discussionLike.deleteMany({
                    where: { userId, discussionId: id },
                });
                const count = await prisma.discussionLike.count({ where: { discussionId: id } });
                await prisma.discussion.update({
                    where: { id },
                    data: { likes: count },
                });
                safeRevalidate("/");
                return { liked: false, likes: count };
            } else {
                // User has NOT liked this discussion yet
                if (actionPreference === "unlike") {
                    // Idempotent: already unliked, return current count
                    const currentCount = await prisma.discussionLike.count({ where: { discussionId: id } });
                    return { liked: false, likes: currentCount };
                }

                // LIKE: create like relation
                await prisma.discussionLike.create({
                    data: { userId, discussionId: id },
                });
                const count = await prisma.discussionLike.count({ where: { discussionId: id } });
                await prisma.discussion.update({
                    where: { id },
                    data: { likes: count },
                });
                safeRevalidate("/");
                return { liked: true, likes: count };
            }
        } else {
            // Post like/unlike
            const dbPost = await prisma.post.findUnique({ where: { id } });
            if (!dbPost) {
                throw new Error(`Post ${id} not found in DB`);
            }

            const existingLike = await prisma.postLike.findUnique({
                where: {
                    userId_postId: {
                        userId,
                        postId: id,
                    },
                },
            });

            if (existingLike) {
                // User ALREADY liked this post
                if (actionPreference === "like") {
                    // Idempotent: already liked, return current count without duplicate increment
                    const currentCount = await prisma.postLike.count({ where: { postId: id } });
                    return { liked: true, likes: currentCount };
                }

                // UNLIKE: remove like relation
                await prisma.postLike.deleteMany({
                    where: { userId, postId: id },
                });
                const count = await prisma.postLike.count({ where: { postId: id } });
                await prisma.post.update({
                    where: { id },
                    data: { likes: count },
                });
                safeRevalidate("/");
                return { liked: false, likes: count };
            } else {
                // User has NOT liked this post yet
                if (actionPreference === "unlike") {
                    // Idempotent: already unliked, return current count
                    const currentCount = await prisma.postLike.count({ where: { postId: id } });
                    return { liked: false, likes: currentCount };
                }

                // LIKE: create like relation
                await prisma.postLike.create({
                    data: { userId, postId: id },
                });
                const count = await prisma.postLike.count({ where: { postId: id } });
                await prisma.post.update({
                    where: { id },
                    data: { likes: count },
                });
                safeRevalidate("/");
                return { liked: true, likes: count };
            }
        }
    } catch (error) {
        console.error("[toggleLike error, falling back to mock]:", error);
        return toggleMockLike(id, actionPreference);
    }
}