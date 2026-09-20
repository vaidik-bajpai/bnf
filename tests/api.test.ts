import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { prisma } from "@/lib/prisma";

import { GET as getCategoriesRoute } from "@/app/api/forum/categories/route";
import { GET as getMegaThreadsRoute } from "@/app/api/forum/megathreads/route";
import { GET as getStatsRoute } from "@/app/api/forum/stats/route";
import {
    GET as getDiscussionsRoute,
    POST as createDiscussionRoute,
    PATCH as updateDiscussionRoute,
    DELETE as deleteDiscussionRoute,
} from "@/app/api/forum/discussions/route";
import {
    POST as createPostRoute,
    PATCH as updatePostRoute,
    DELETE as deletePostRoute,
} from "@/app/api/forum/posts/route";
import { POST as toggleLikeRoute } from "@/app/api/forum/likes/route";
import {
    GET as pipelineGetRoute,
    POST as pipelinePostRoute,
} from "@/app/api/forum/pipeline/route";
import {
    GET as getBookmarksRoute,
    POST as toggleBookmarkRoute,
} from "@/app/api/forum/bookmarks/route";
import {
    GET as getReportsRoute,
    POST as createReportRoute,
} from "@/app/api/forum/reports/route";
import { POST as recordShareRoute } from "@/app/api/forum/share/route";

describe("Forum REST API Endpoints", () => {
    let authorUser: { id: string; email: string | null };
    let otherUser: { id: string; email: string | null };
    let sampleCategory: { id: string; name: string };
    let sampleMegaThread: { id: string; title: string };

    let createdDiscussionId: string;
    let createdPostId: string;

    before(async () => {
        // Setup 2 test users for authorization checks
        authorUser = await prisma.user.upsert({
            where: { email: "test_author@indicforum.in" },
            update: {},
            create: {
                name: "Test Author",
                email: "test_author@indicforum.in",
                username: "test_author",
                initials: "TA",
                bg: "#B85428",
            },
        });

        otherUser = await prisma.user.upsert({
            where: { email: "test_other@indicforum.in" },
            update: {},
            create: {
                name: "Test Other",
                email: "test_other@indicforum.in",
                username: "test_other",
                initials: "TO",
                bg: "#2D6A4F",
            },
        });

        // Ensure category exists
        const cat = await prisma.category.findFirst();
        if (!cat) {
            sampleCategory = await prisma.category.create({
                data: {
                    id: "history",
                    name: "History & Archaeology",
                    color: "#B85428",
                    count: 0,
                },
            });
        } else {
            sampleCategory = { id: cat.id, name: cat.name };
        }

        // Ensure megathread exists
        const mt = await prisma.megaThread.findFirst();
        if (!mt) {
            sampleMegaThread = await prisma.megaThread.create({
                data: {
                    id: "mega-test",
                    title: "Test MegaThread",
                    description: "MegaThread for API testing",
                    categoryId: sampleCategory.id,
                },
            });
        } else {
            sampleMegaThread = { id: mt.id, title: mt.title };
        }
    });

    after(async () => {
        // Clean up any remaining test records
        try {
            if (createdDiscussionId) {
                await prisma.postLike.deleteMany({ where: { post: { discussionId: createdDiscussionId } } });
                await prisma.discussionLike.deleteMany({ where: { discussionId: createdDiscussionId } });
                await prisma.post.deleteMany({ where: { discussionId: createdDiscussionId } });
                await prisma.discussion.deleteMany({ where: { id: createdDiscussionId } });
            }
            await prisma.user.deleteMany({
                where: { id: { in: [authorUser.id, otherUser.id] } },
            });
        } catch {
            // Best-effort cleanup
        }
    });

    // ==========================================
    // 1. Categories API
    // ==========================================
    describe("GET /api/forum/categories", () => {
        it("should return HTTP 200 with an array of categories with dynamic counts", async () => {
            const res = await getCategoriesRoute();
            assert.strictEqual(res.status, 200);

            const data = await res.json();
            assert.ok(Array.isArray(data), "Categories should be an array");
            assert.ok(data.length > 0, "Should have at least one category");

            const first = data[0];
            assert.ok("id" in first, "Category must have id");
            assert.ok("name" in first, "Category must have name");
            assert.ok("count" in first, "Category must have count");
            assert.strictEqual(typeof first.count, "number", "Count must be a number");
            assert.ok(first.count >= 0, "Count must be non-negative");
        });
    });

    // ==========================================
    // 2. MegaThreads API
    // ==========================================
    describe("GET /api/forum/megathreads", () => {
        it("should return HTTP 200 with all megathreads including dynamic counts", async () => {
            const req = new Request("http://localhost:3000/api/forum/megathreads");
            const res = await getMegaThreadsRoute(req);
            assert.strictEqual(res.status, 200);

            const data = await res.json();
            assert.ok(Array.isArray(data), "MegaThreads must be an array");
            assert.ok(data.length > 0, "Should have at least one megathread");

            const item = data[0];
            assert.ok("id" in item);
            assert.ok("title" in item);
            assert.ok("discussionCount" in item);
            assert.ok("participantCount" in item);
            assert.strictEqual(typeof item.discussionCount, "number");
            assert.strictEqual(typeof item.participantCount, "number");
        });

        it("should return HTTP 200 with megathread details when ?id is provided", async () => {
            const req = new Request(`http://localhost:3000/api/forum/megathreads?id=${sampleMegaThread.id}`);
            const res = await getMegaThreadsRoute(req);
            assert.strictEqual(res.status, 200);

            const data = await res.json();
            assert.strictEqual(data.id, sampleMegaThread.id);
            assert.ok("discussions" in data, "Should include discussions list");
            assert.ok(Array.isArray(data.discussions));
        });

        it("should return HTTP 404 when megathread is not found", async () => {
            const req = new Request("http://localhost:3000/api/forum/megathreads?id=non-existent-id-9999");
            const res = await getMegaThreadsRoute(req);
            assert.strictEqual(res.status, 404);

            const data = await res.json();
            assert.ok("error" in data);
        });
    });

    // ==========================================
    // 3. Stats API
    // ==========================================
    describe("GET /api/forum/stats", () => {
        it("should return HTTP 200 with dynamic forum counts from backend", async () => {
            const res = await getStatsRoute();
            assert.strictEqual(res.status, 200);

            const stats = await res.json();
            assert.ok("megaThreadCount" in stats);
            assert.ok("discussionCount" in stats);
            assert.ok("categoryCount" in stats);
            assert.ok("scholarCount" in stats);
            assert.ok("postCount" in stats);

            assert.strictEqual(typeof stats.megaThreadCount, "number");
            assert.strictEqual(typeof stats.discussionCount, "number");
            assert.strictEqual(typeof stats.categoryCount, "number");
            assert.strictEqual(typeof stats.scholarCount, "number");
            assert.strictEqual(typeof stats.postCount, "number");

            assert.ok(stats.scholarCount >= 2, "Should include at least the 2 test users");
        });
    });

    // ==========================================
    // 4. Discussions CRUD API
    // ==========================================
    describe("Discussions CRUD (/api/forum/discussions)", () => {
        it("POST should reject requests with missing title or body with HTTP 400", async () => {
            const req = new Request("http://localhost:3000/api/forum/discussions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: "",
                    body: "",
                    categoryId: sampleCategory.id,
                }),
            });
            const res = await createDiscussionRoute(req);
            assert.strictEqual(res.status, 400);

            const data = await res.json();
            assert.ok(data.error.includes("Missing title or body"));
        });

        it("POST should create a discussion with OP post and return HTTP 201", async () => {
            const req = new Request("http://localhost:3000/api/forum/discussions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: "Test Discussion Title for Unit Test",
                    body: "This is the substantive body of the test discussion created in automated testing.",
                    categoryId: sampleCategory.id,
                    megaThreadId: sampleMegaThread.id,
                    tags: ["testing", "unit-test"],
                    authorId: authorUser.id,
                }),
            });
            const res = await createDiscussionRoute(req);
            assert.strictEqual(res.status, 201);

            const data = await res.json();
            assert.ok(data.id, "Created discussion must have an id");
            assert.strictEqual(data.title, "Test Discussion Title for Unit Test");
            assert.strictEqual(data.authorId, authorUser.id);
            createdDiscussionId = data.id;

            // Verify OP was automatically created in DB
            const opPost = await prisma.post.findFirst({
                where: { discussionId: createdDiscussionId, replyToPostId: null },
            });
            assert.ok(opPost, "OP post must be created automatically in database");
            assert.strictEqual(opPost.content, "This is the substantive body of the test discussion created in automated testing.");
        });

        it("GET should return discussion list including the newly created discussion", async () => {
            const req = new Request(`http://localhost:3000/api/forum/discussions?categoryId=${sampleCategory.id}`);
            const res = await getDiscussionsRoute(req);
            assert.strictEqual(res.status, 200);

            const list = await res.json();
            assert.ok(Array.isArray(list));
            const found = list.find((d: { id: string }) => d.id === createdDiscussionId);
            assert.ok(found, "Newly created discussion must be present in discussion list");
            assert.strictEqual(typeof found.replies, "number");
            assert.strictEqual(typeof found.likes, "number");
        });

        it("GET with ?id should return the full discussion with posts array", async () => {
            const req = new Request(`http://localhost:3000/api/forum/discussions?id=${createdDiscussionId}`);
            const res = await getDiscussionsRoute(req);
            assert.strictEqual(res.status, 200);

            const detail = await res.json();
            assert.strictEqual(detail.id, createdDiscussionId);
            assert.ok(Array.isArray(detail.posts), "Detail must have posts array");
            assert.ok(detail.posts.length >= 1, "Must contain at least the OP post");
        });

        it("GET with ?id=nonexistent should return HTTP 404", async () => {
            const req = new Request("http://localhost:3000/api/forum/discussions?id=non-existent-disc-9999");
            const res = await getDiscussionsRoute(req);
            assert.strictEqual(res.status, 404);
        });

        it("PATCH should reject unauthorized update attempt with HTTP 403", async () => {
            const req = new Request("http://localhost:3000/api/forum/discussions", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: createdDiscussionId,
                    clientUserId: otherUser.id, // Not the author!
                    title: "Malicious Update Attempt",
                }),
            });
            const res = await updateDiscussionRoute(req);
            assert.strictEqual(res.status, 403);

            const data = await res.json();
            assert.ok(data.error.includes("Unauthorized"));
        });

        it("PATCH should allow author to update title, body, and tags", async () => {
            const req = new Request("http://localhost:3000/api/forum/discussions", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: createdDiscussionId,
                    clientUserId: authorUser.id,
                    title: "Updated Discussion Title By Author",
                    body: "Updated substantive body by author.",
                    tags: ["testing", "updated"],
                }),
            });
            const res = await updateDiscussionRoute(req);
            assert.strictEqual(res.status, 200);

            const updated = await res.json();
            assert.strictEqual(updated.title, "Updated Discussion Title By Author");
            assert.strictEqual(updated.body, "Updated substantive body by author.");
            assert.ok(updated.tags.includes("updated"));
        });

        it("DELETE should reject unauthorized delete attempt with HTTP 403", async () => {
            const req = new Request(
                `http://localhost:3000/api/forum/discussions?id=${createdDiscussionId}&clientUserId=${otherUser.id}`,
                { method: "DELETE" }
            );
            const res = await deleteDiscussionRoute(req);
            assert.strictEqual(res.status, 403);

            const data = await res.json();
            assert.ok(data.error.includes("Unauthorized"));
        });
    });

    // ==========================================
    // 5. Posts (Replies) CRUD API
    // ==========================================
    describe("Posts / Replies CRUD (/api/forum/posts)", () => {
        it("POST should reject missing discussionId or content with HTTP 400", async () => {
            const req = new Request("http://localhost:3000/api/forum/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    discussionId: "",
                    content: "",
                }),
            });
            const res = await createPostRoute(req);
            assert.strictEqual(res.status, 400);
        });

        it("POST should create a flat reply referencing another post and return HTTP 201", async () => {
            // Find the OP post to reference
            const opPost = await prisma.post.findFirst({
                where: { discussionId: createdDiscussionId, replyToPostId: null },
            });
            assert.ok(opPost);

            const req = new Request("http://localhost:3000/api/forum/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    discussionId: createdDiscussionId,
                    content: "This is a flat reply referencing the OP post.",
                    replyToPostId: opPost.id,
                    authorId: otherUser.id,
                }),
            });
            const res = await createPostRoute(req);
            assert.strictEqual(res.status, 201);

            const reply = await res.json();
            assert.ok(reply.id);
            assert.strictEqual(reply.replyToPostId, opPost.id);
            assert.strictEqual(reply.content, "This is a flat reply referencing the OP post.");
            assert.strictEqual(reply.authorId, otherUser.id);
            createdPostId = reply.id;
        });

        it("PATCH should reject unauthorized edit attempt with HTTP 403", async () => {
            const req = new Request("http://localhost:3000/api/forum/posts", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: createdPostId,
                    clientUserId: authorUser.id, // authorUser is NOT the author of createdPostId!
                    content: "Unauthorized edit attempt",
                }),
            });
            const res = await updatePostRoute(req);
            assert.strictEqual(res.status, 403);
        });

        it("PATCH should allow the author to edit their reply", async () => {
            const req = new Request("http://localhost:3000/api/forum/posts", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: createdPostId,
                    clientUserId: otherUser.id, // original author of the reply
                    content: "Edited reply content by original author.",
                }),
            });
            const res = await updatePostRoute(req);
            assert.strictEqual(res.status, 200);

            const updated = await res.json();
            assert.strictEqual(updated.content, "Edited reply content by original author.");
        });

        it("DELETE should reject unauthorized delete attempt with HTTP 403", async () => {
            const req = new Request(
                `http://localhost:3000/api/forum/posts?id=${createdPostId}&clientUserId=${authorUser.id}`,
                { method: "DELETE" }
            );
            const res = await deletePostRoute(req);
            assert.strictEqual(res.status, 403);
        });

        it("DELETE should allow the author to delete their reply", async () => {
            const req = new Request(
                `http://localhost:3000/api/forum/posts?id=${createdPostId}&clientUserId=${otherUser.id}`,
                { method: "DELETE" }
            );
            const res = await deletePostRoute(req);
            assert.strictEqual(res.status, 200);

            const result = await res.json();
            assert.strictEqual(result.success, true);

            // Confirm post no longer exists in DB
            const check = await prisma.post.findUnique({ where: { id: createdPostId } });
            assert.strictEqual(check, null);
        });
    });

    // ==========================================
    // 6. Likes API (/api/forum/likes)
    // ==========================================
    describe("Likes API (/api/forum/likes)", () => {
        it("POST should reject invalid or missing parameters with HTTP 400", async () => {
            const req1 = new Request("http://localhost:3000/api/forum/likes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ targetType: "", targetId: "" }),
            });
            const res1 = await toggleLikeRoute(req1);
            assert.strictEqual(res1.status, 400);

            const req2 = new Request("http://localhost:3000/api/forum/likes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ targetType: "invalid_type", targetId: "abc" }),
            });
            const res2 = await toggleLikeRoute(req2);
            assert.strictEqual(res2.status, 400);
        });

        it("POST should toggle like on a discussion (like -> unlike) without duplicate likes", async () => {
            // 1. First like
            const likeReq = new Request("http://localhost:3000/api/forum/likes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    targetType: "discussion",
                    targetId: createdDiscussionId,
                    action: "like",
                    clientUserId: otherUser.id,
                }),
            });
            const likeRes = await toggleLikeRoute(likeReq);
            assert.strictEqual(likeRes.status, 200);
            const likeData = await likeRes.json();
            assert.strictEqual(likeData.liked, true);
            assert.ok(likeData.likes >= 1);

            // 2. Repeat like by the same user should not create duplicate like records
            const repeatReq = new Request("http://localhost:3000/api/forum/likes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    targetType: "discussion",
                    targetId: createdDiscussionId,
                    action: "like",
                    clientUserId: otherUser.id,
                }),
            });
            const repeatRes = await toggleLikeRoute(repeatReq);
            assert.strictEqual(repeatRes.status, 200);
            const userLikesInDb = await prisma.discussionLike.count({
                where: { discussionId: createdDiscussionId, userId: otherUser.id },
            });
            assert.strictEqual(userLikesInDb, 1, "There must never be duplicate like records for the same user");

            // 3. Unlike
            const unlikeReq = new Request("http://localhost:3000/api/forum/likes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    targetType: "discussion",
                    targetId: createdDiscussionId,
                    action: "unlike",
                    clientUserId: otherUser.id,
                }),
            });
            const unlikeRes = await toggleLikeRoute(unlikeReq);
            assert.strictEqual(unlikeRes.status, 200);
            const unlikeData = await unlikeRes.json();
            assert.strictEqual(unlikeData.liked, false);

            const userLikesAfter = await prisma.discussionLike.count({
                where: { discussionId: createdDiscussionId, userId: otherUser.id },
            });
            assert.strictEqual(userLikesAfter, 0, "Unlike must remove the user's like record");
        });

        it("POST should toggle like and unlike on a post", async () => {
            const opPost = await prisma.post.findFirst({
                where: { discussionId: createdDiscussionId, replyToPostId: null },
            });
            assert.ok(opPost);

            // 1. Like post
            const likeReq = new Request("http://localhost:3000/api/forum/likes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    targetType: "post",
                    targetId: opPost.id,
                    action: "like",
                    clientUserId: otherUser.id,
                }),
            });
            const likeRes = await toggleLikeRoute(likeReq);
            assert.strictEqual(likeRes.status, 200);
            const likeData = await likeRes.json();
            assert.strictEqual(likeData.liked, true);

            // 2. Unlike post
            const unlikeReq = new Request("http://localhost:3000/api/forum/likes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    targetType: "post",
                    targetId: opPost.id,
                    action: "unlike",
                    clientUserId: otherUser.id,
                }),
            });
            const unlikeRes = await toggleLikeRoute(unlikeReq);
            assert.strictEqual(unlikeRes.status, 200);
            const unlikeData = await unlikeRes.json();
            assert.strictEqual(unlikeData.liked, false);
        });
    });

    // ==========================================
    // 7. Cascading Discussion Deletion
    // ==========================================
    describe("DELETE /api/forum/discussions by Author", () => {
        it("should successfully delete discussion and cascade to its posts and likes", async () => {
            const req = new Request(
                `http://localhost:3000/api/forum/discussions?id=${createdDiscussionId}&clientUserId=${authorUser.id}`,
                { method: "DELETE" }
            );
            const res = await deleteDiscussionRoute(req);
            assert.strictEqual(res.status, 200);

            const result = await res.json();
            assert.strictEqual(result.success, true);

            // Verify cascading deletion from DB
            const discCheck = await prisma.discussion.findUnique({ where: { id: createdDiscussionId } });
            assert.strictEqual(discCheck, null, "Discussion must be deleted");

            const postsCheck = await prisma.post.findMany({ where: { discussionId: createdDiscussionId } });
            assert.strictEqual(postsCheck.length, 0, "All associated posts must be cascade-deleted");

            const likesCheck = await prisma.discussionLike.findMany({ where: { discussionId: createdDiscussionId } });
            assert.strictEqual(likesCheck.length, 0, "All associated discussion likes must be cascade-deleted");
        });
    });

    // ==========================================
    // 8. n8n Pipeline Ingestion
    // ==========================================
    describe("8. n8n Pipeline Ingestion (/api/forum/pipeline & /api/forum/discussions)", () => {
        const n8nSamplePayload = [
            {
                title: "समुदाय के लिए महत्वपूर्ण जानकारी",
                body: "हाल ही में प्राप्त जानकारी के अनुसार, इस विषय पर अभी और विवरण सामने आना बाकी है। स्थानीय नागरिकों से अनुरोध है कि वे आगामी अपडेट पर नजर बनाए रखें और समुदाय हित में सक्रिय रहें।\n\n---\n\n### मुख्य तथ्य\n\n- दिए गए लेख में कोई विशिष्ट तथ्य या घटना उपलब्ध नहीं है।\n\n### चर्चा के बिंदु\n\n1. इस विषय पर आपकी क्या राय है?\n2. समुदाय के विकास के लिए हमें आगे क्या कदम उठाने चाहिए?\n",
                image_url: "https://images.pexels.com/photos/1325754/pexels-photo-1325754.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
                image_alt: "Smiling team members engaging in a positive office discussion.",
                photographer: "Jopwell",
                photographer_url: "https://www.pexels.com/@jopwell",
                pexels_url: "https://www.pexels.com/photo/man-sitting-on-office-chair-1325754/",
            },
        ];

        let pipelineDiscussionId: string;

        after(async () => {
            if (pipelineDiscussionId) {
                await prisma.post.deleteMany({ where: { discussionId: pipelineDiscussionId } });
                await prisma.discussion.deleteMany({ where: { id: pipelineDiscussionId } });
            }
        });

        it("POST /api/forum/discussions should accept array response from n8n pipeline and return HTTP 201", async () => {
            const req = new Request("http://localhost:3000/api/forum/discussions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(n8nSamplePayload),
            });
            const res = await createDiscussionRoute(req);
            assert.strictEqual(res.status, 201);

            const result = await res.json();
            assert.ok(Array.isArray(result), "Array input should return array output");
            assert.strictEqual(result.length, 1);

            const created = result[0];
            assert.strictEqual(created.title, "समुदाय के लिए महत्वपूर्ण जानकारी");
            assert.ok(created.body.includes("मुख्य तथ्य"));
            assert.ok(created.id);
            assert.strictEqual(created.imageUrl, n8nSamplePayload[0].image_url);
            assert.strictEqual(created.photographer, "Jopwell");
            assert.ok(created.categoryId, "Should auto-assign category");

            pipelineDiscussionId = created.id;

            // Verify OP was automatically created in DB
            const op = await prisma.post.findFirst({
                where: { discussionId: created.id, replyToPostId: null },
            });
            assert.ok(op);
            assert.strictEqual(op.content, n8nSamplePayload[0].body);
        });

        it("GET /api/forum/pipeline should return active status and documentation", async () => {
            const res = await pipelineGetRoute();
            assert.strictEqual(res.status, 200);

            const data = await res.json();
            assert.strictEqual(data.status, "active");
            assert.ok(data.schema);
            assert.ok(Array.isArray(data.samplePayload));
        });

        it("POST /api/forum/pipeline should process n8n payload and return summary with created thread", async () => {
            const req = new Request("http://localhost:3000/api/forum/pipeline", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(n8nSamplePayload),
            });
            const res = await pipelinePostRoute(req);
            assert.strictEqual(res.status, 201);

            const data = await res.json();
            assert.strictEqual(data.success, true);
            assert.strictEqual(data.count, 1);
            assert.ok(Array.isArray(data.discussions));
            assert.strictEqual(data.discussions[0].title, "समुदाय के लिए महत्वपूर्ण जानकारी");

            // Clean up the pipeline route created thread
            const cleanupId = data.discussions[0].id;
            await prisma.post.deleteMany({ where: { discussionId: cleanupId } });
            await prisma.discussion.deleteMany({ where: { id: cleanupId } });
        });
    });

    describe("9. Bookmarks API (/api/forum/bookmarks)", () => {
        let testDiscId: string;

        before(async () => {
            const disc = await prisma.discussion.create({
                data: {
                    title: "Discussion For Bookmark Tests",
                    excerpt: "Bookmark test excerpt",
                    body: "Substantive body for bookmark test inquiry",
                    categoryId: sampleCategory.id,
                    authorId: authorUser.id,
                },
            });
            testDiscId = disc.id;
        });

        after(async () => {
            await prisma.bookmark.deleteMany({ where: { discussionId: testDiscId } });
            await prisma.post.deleteMany({ where: { discussionId: testDiscId } });
            await prisma.discussion.deleteMany({ where: { id: testDiscId } });
        });

        it("POST should reject missing discussionId with HTTP 400", async () => {
            const req = new Request("http://localhost:3000/api/forum/bookmarks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({}),
            });
            const res = await toggleBookmarkRoute(req);
            assert.strictEqual(res.status, 400);
        });

        it("POST should toggle bookmark (add -> remove) and return correct state", async () => {
            // 1. Add Bookmark
            const reqAdd = new Request("http://localhost:3000/api/forum/bookmarks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ discussionId: testDiscId, clientUserId: authorUser.id }),
            });
            const resAdd = await toggleBookmarkRoute(reqAdd);
            assert.strictEqual(resAdd.status, 200);
            const dataAdd = await resAdd.json();
            assert.strictEqual(dataAdd.bookmarked, true);
            assert.strictEqual(dataAdd.bookmarkCount, 1);

            // Verify in DB
            const dbBookmark = await prisma.bookmark.findUnique({
                where: {
                    userId_discussionId: {
                        userId: authorUser.id,
                        discussionId: testDiscId,
                    },
                },
            });
            assert.ok(dbBookmark);

            // 2. Remove Bookmark (Toggle off)
            const reqRemove = new Request("http://localhost:3000/api/forum/bookmarks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ discussionId: testDiscId, clientUserId: authorUser.id }),
            });
            const resRemove = await toggleBookmarkRoute(reqRemove);
            assert.strictEqual(resRemove.status, 200);
            const dataRemove = await resRemove.json();
            assert.strictEqual(dataRemove.bookmarked, false);
            assert.strictEqual(dataRemove.bookmarkCount, 0);

            // Verify removed from DB
            const dbCheck = await prisma.bookmark.findUnique({
                where: {
                    userId_discussionId: {
                        userId: authorUser.id,
                        discussionId: testDiscId,
                    },
                },
            });
            assert.strictEqual(dbCheck, null);
        });

        it("GET should return user's bookmarked discussions", async () => {
            // Re-add bookmark
            await prisma.bookmark.create({
                data: { userId: authorUser.id, discussionId: testDiscId },
            });

            const req = new Request(`http://localhost:3000/api/forum/bookmarks?clientUserId=${authorUser.id}`);
            const res = await getBookmarksRoute(req);
            assert.strictEqual(res.status, 200);

            const bookmarks = await res.json();
            assert.ok(Array.isArray(bookmarks));
            const found = bookmarks.find((b: { id: string }) => b.id === testDiscId);
            assert.ok(found);
            assert.strictEqual(found.title, "Discussion For Bookmark Tests");
            assert.strictEqual(found.isBookmarked, true);
        });
    });

    describe("10. Reports API (/api/forum/reports)", () => {
        let reportDiscId: string;
        let reportPostId: string;

        before(async () => {
            const disc = await prisma.discussion.create({
                data: {
                    title: "Discussion For Report Tests",
                    excerpt: "Report test excerpt",
                    body: "Content to test report functionality",
                    categoryId: sampleCategory.id,
                    authorId: otherUser.id,
                },
            });
            reportDiscId = disc.id;

            const post = await prisma.post.create({
                data: {
                    content: "A reply to test reporting",
                    discussionId: disc.id,
                    authorId: otherUser.id,
                },
            });
            reportPostId = post.id;
        });

        after(async () => {
            await prisma.report.deleteMany({ where: { OR: [{ discussionId: reportDiscId }, { postId: reportPostId }] } });
            await prisma.post.deleteMany({ where: { discussionId: reportDiscId } });
            await prisma.discussion.deleteMany({ where: { id: reportDiscId } });
        });

        it("POST should reject missing target with HTTP 400", async () => {
            const req = new Request("http://localhost:3000/api/forum/reports", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reason: "spam" }),
            });
            const res = await createReportRoute(req);
            assert.strictEqual(res.status, 400);
        });

        it("POST should reject missing reason with HTTP 400", async () => {
            const req = new Request("http://localhost:3000/api/forum/reports", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ discussionId: reportDiscId }),
            });
            const res = await createReportRoute(req);
            assert.strictEqual(res.status, 400);
        });

        it("POST should submit report for discussion and return HTTP 201", async () => {
            const req = new Request("http://localhost:3000/api/forum/reports", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    discussionId: reportDiscId,
                    reason: "misinformation",
                    details: "Historical fact cited is contradicted by standard texts.",
                    clientUserId: authorUser.id,
                }),
            });
            const res = await createReportRoute(req);
            assert.strictEqual(res.status, 201);

            const data = await res.json();
            assert.strictEqual(data.success, true);
            assert.ok(data.reportId);
            assert.strictEqual(data.alreadyReported, false);

            // Verify in DB
            const dbReport = await prisma.report.findUnique({ where: { id: data.reportId } });
            assert.ok(dbReport);
            assert.strictEqual(dbReport.reason, "misinformation");
            assert.strictEqual(dbReport.status, "PENDING");
            assert.strictEqual(dbReport.discussionId, reportDiscId);
        });

        it("POST should inform user if duplicate report is submitted", async () => {
            const req = new Request("http://localhost:3000/api/forum/reports", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    discussionId: reportDiscId,
                    reason: "misinformation",
                    clientUserId: authorUser.id,
                }),
            });
            const res = await createReportRoute(req);
            assert.strictEqual(res.status, 201);

            const data = await res.json();
            assert.strictEqual(data.success, true);
            assert.strictEqual(data.alreadyReported, true);
        });

        it("POST should submit report for a post / reply and return HTTP 201", async () => {
            const req = new Request("http://localhost:3000/api/forum/reports", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    postId: reportPostId,
                    reason: "harassment",
                    details: "Uncivil behavior in discussion reply.",
                    clientUserId: authorUser.id,
                }),
            });
            const res = await createReportRoute(req);
            assert.strictEqual(res.status, 201);

            const data = await res.json();
            assert.strictEqual(data.success, true);
            assert.ok(data.reportId);

            // Verify in DB
            const dbReport = await prisma.report.findUnique({ where: { id: data.reportId } });
            assert.ok(dbReport);
            assert.strictEqual(dbReport.postId, reportPostId);
            assert.strictEqual(dbReport.reason, "harassment");
        });

        it("GET should list reports for moderation review", async () => {
            const req = new Request("http://localhost:3000/api/forum/reports?status=PENDING");
            const res = await getReportsRoute(req);
            assert.strictEqual(res.status, 200);

            const reports = await res.json();
            assert.ok(Array.isArray(reports));
            assert.ok(reports.length >= 2);
            assert.ok(reports.some((r: { discussionId?: string }) => r.discussionId === reportDiscId));
        });
    });

    describe("11. Share API (/api/forum/share)", () => {
        let shareDiscId: string;

        before(async () => {
            const disc = await prisma.discussion.create({
                data: {
                    title: "Discussion For Share Tests",
                    excerpt: "Share test excerpt",
                    body: "Content to test share recording",
                    categoryId: sampleCategory.id,
                    authorId: authorUser.id,
                },
            });
            shareDiscId = disc.id;
        });

        after(async () => {
            await prisma.discussion.deleteMany({ where: { id: shareDiscId } });
        });

        it("POST should reject missing discussionId with HTTP 400", async () => {
            const req = new Request("http://localhost:3000/api/forum/share", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({}),
            });
            const res = await recordShareRoute(req);
            assert.strictEqual(res.status, 400);
        });

        it("POST should record share and increment discussion share count", async () => {
            const req1 = new Request("http://localhost:3000/api/forum/share", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ discussionId: shareDiscId }),
            });
            const res1 = await recordShareRoute(req1);
            assert.strictEqual(res1.status, 200);
            const data1 = await res1.json();
            assert.strictEqual(data1.success, true);
            assert.strictEqual(data1.shares, 1);

            // Share a second time
            const req2 = new Request("http://localhost:3000/api/forum/share", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ discussionId: shareDiscId }),
            });
            const res2 = await recordShareRoute(req2);
            assert.strictEqual(res2.status, 200);
            const data2 = await res2.json();
            assert.strictEqual(data2.shares, 2);

            // Verify in DB
            const dbDisc = await prisma.discussion.findUnique({ where: { id: shareDiscId } });
            assert.strictEqual(dbDisc?.shares, 2);
        });
    });
});
