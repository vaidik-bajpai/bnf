// prisma/unseed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function unseed() {
    console.log("🌱 Unseeding database: clearing all records...");

    // 1. Delete reports, bookmarks, and likes
    const deletedReports = await prisma.report.deleteMany({});
    const deletedBookmarks = await prisma.bookmark.deleteMany({});
    const deletedPostLikes = await prisma.postLike.deleteMany({});
    const deletedDiscLikes = await prisma.discussionLike.deleteMany({});
    console.log(`✓ Deleted ${deletedReports.count} reports, ${deletedBookmarks.count} bookmarks, ${deletedPostLikes.count} post likes, ${deletedDiscLikes.count} discussion likes`);

    // 2. Delete posts
    const deletedPosts = await prisma.post.deleteMany({});
    console.log(`✓ Deleted ${deletedPosts.count} posts`);

    // 3. Delete discussions
    const deletedDiscussions = await prisma.discussion.deleteMany({});
    console.log(`✓ Deleted ${deletedDiscussions.count} discussions`);

    // 4. Delete megathreads
    const deletedMegaThreads = await prisma.megaThread.deleteMany({});
    console.log(`✓ Deleted ${deletedMegaThreads.count} megathreads`);

    // 5. Delete categories
    const deletedCategories = await prisma.category.deleteMany({});
    console.log(`✓ Deleted ${deletedCategories.count} categories`);

    // 6. Delete auth accounts, sessions, verification tokens, and users
    const deletedAccounts = await prisma.account.deleteMany({});
    const deletedSessions = await prisma.session.deleteMany({});
    const deletedTokens = await prisma.verificationToken.deleteMany({});
    const deletedUsers = await prisma.user.deleteMany({});
    console.log(`✓ Deleted ${deletedAccounts.count} accounts, ${deletedSessions.count} sessions, ${deletedTokens.count} tokens, ${deletedUsers.count} users`);

    console.log("✨ Database successfully unseeded!");
}

// Execute when invoked directly from CLI
if (require.main === module || process.argv[1]?.endsWith("unseed.ts")) {
    unseed()
        .then(async () => {
            await prisma.$disconnect();
        })
        .catch(async (e) => {
            console.error("Unseed error:", e);
            await prisma.$disconnect();
            process.exit(1);
        });
}
