import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { prisma } from "@/lib/prisma";
import {
    getCategoriesAction,
    voteDiscussionAction,
    votePostAction,
    togglePostBookmarkAction,
    toggleCategoryStarAction,
    toggleCategoryFavoriteAction,
    addCategoryTagAction,
    createDiscussion,
    postReply,
} from "@/app/actions/forum";

describe("Forum Advanced Architecture & Requirements", () => {
    let testUserId: string;
    let testDiscussionId: string;
    let testPostId: string;

    before(async () => {
        // Ensure test user exists
        let user = await prisma.user.findFirst({
            where: { email: "test.scholar@indicforum.in" },
        });
        if (!user) {
            user = await prisma.user.create({
                data: {
                    name: "Test Scholar",
                    email: "test.scholar@indicforum.in",
                    username: "test_scholar",
                    initials: "TS",
                    bg: "#B85428",
                },
            });
        }
        testUserId = user.id;

        // Create a test suggestion discussion
        const disc = await createDiscussion({
            title: "Test Suggestion: National Cultural Archive",
            body: "We propose setting up an open access digital archive for palm leaf manuscripts.",
            categoryId: "community-posts",
            tags: ["archive", "heritage", "digital"],
            forumType: "suggestion",
            authorId: testUserId,
        });
        testDiscussionId = disc.id;

        // Create a test reply / answer post
        const post = await postReply({
            discussionId: testDiscussionId,
            content: "This is a key answer contribution that should be upvoted.",
            authorId: testUserId,
        });
        if (post) {
            testPostId = post.id;
        }
    });

    after(async () => {
        // Cleanup test data
        try {
            if (testDiscussionId) {
                await prisma.discussion.delete({ where: { id: testDiscussionId } }).catch(() => {});
            }
            if (testUserId) {
                await prisma.user.delete({ where: { id: testUserId } }).catch(() => {});
            }
        } catch {
            // Ignore cleanup errors
        }
    });

    it("1. getCategoriesAction should return Content Gallery smaller categories (videos, vlogs, community-posts)", async () => {
        const categories = await getCategoriesAction();
        assert.ok(Array.isArray(categories));
        assert.ok(categories.length >= 3);

        const videoCat = categories.find((c) => c.id === "videos");
        const vlogCat = categories.find((c) => c.id === "vlogs");
        const commCat = categories.find((c) => c.id === "community-posts");

        assert.ok(videoCat, "videos category exists");
        assert.equal(videoCat?.megaCategoryId, "content-gallery");

        assert.ok(vlogCat, "vlogs category exists");
        assert.equal(vlogCat?.megaCategoryId, "content-gallery");

        assert.ok(commCat, "community-posts category exists");
        assert.equal(commCat?.megaCategoryId, "content-gallery");
    });

    it("2. Suggestion Forum: voteDiscussionAction should upvote and downvote the OP", async () => {
        // Upvote
        const upvoteRes = await voteDiscussionAction(testDiscussionId, "UP", testUserId);
        assert.equal(upvoteRes.userVote, "up");
        assert.ok(upvoteRes.upvotes >= 1);

        // Switch to Downvote
        const downvoteRes = await voteDiscussionAction(testDiscussionId, "DOWN", testUserId);
        assert.equal(downvoteRes.userVote, "down");
        assert.ok(downvoteRes.downvotes >= 1);

        // Click Downvote again to remove vote
        const toggleOffRes = await voteDiscussionAction(testDiscussionId, "DOWN", testUserId);
        assert.equal(toggleOffRes.userVote, null);
    });

    it("3. Question Forum: votePostAction should upvote and downvote an answer post", async () => {
        assert.ok(testPostId, "Test post ID exists");

        // Upvote answer
        const upvoteRes = await votePostAction(testPostId, "UP", testUserId);
        assert.equal(upvoteRes.userVote, "up");
        assert.ok(upvoteRes.upvotes >= 1);

        // Switch to Downvote
        const downvoteRes = await votePostAction(testPostId, "DOWN", testUserId);
        assert.equal(downvoteRes.userVote, "down");
        assert.ok(downvoteRes.downvotes >= 1);

        // Toggle off
        const toggleOffRes = await votePostAction(testPostId, "DOWN", testUserId);
        assert.equal(toggleOffRes.userVote, null);
    });

    it("4. Comment Bookmarking: togglePostBookmarkAction should bookmark individual comments", async () => {
        assert.ok(testPostId, "Test post ID exists");

        // Bookmark comment
        const bm1 = await togglePostBookmarkAction(testPostId, testUserId);
        assert.equal(bm1.bookmarked, true);

        // Unbookmark comment
        const bm2 = await togglePostBookmarkAction(testPostId, testUserId);
        assert.equal(bm2.bookmarked, false);
    });

    it("5. Starring & Favoriting Categories: toggleCategoryStarAction and toggleCategoryFavoriteAction", async () => {
        // Star category
        const starRes1 = await toggleCategoryStarAction("videos", testUserId);
        assert.equal(typeof starRes1.isStarred, "boolean");

        // Favorite category
        const favRes1 = await toggleCategoryFavoriteAction("videos", testUserId);
        assert.equal(typeof favRes1.isFavorite, "boolean");
    });

    it("6. Multiple Tags: addCategoryTagAction should add multiple tags to a category", async () => {
        const res1 = await addCategoryTagAction("videos", "webinars");
        assert.ok(Array.isArray(res1.tags));
        assert.ok(res1.tags.includes("webinars"));

        const res2 = await addCategoryTagAction("videos", "podcasts");
        assert.ok(res2.tags.includes("podcasts"));
        assert.ok(res2.tags.includes("webinars"));
    });
});
