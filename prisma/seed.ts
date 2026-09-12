// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
    { id: "history", name: "Indian History", color: "#B85428" },
    { id: "philosophy", name: "Indic Philosophy", color: "#0F1C3F" },
    { id: "culture", name: "Culture & Heritage", color: "#C8971A" },
    { id: "literature", name: "Literature & Languages", color: "#2D6A4F" },
    { id: "science", name: "Science & Knowledge", color: "#1D3557" },
    { id: "art", name: "Art & Architecture", color: "#6B3A2A" },
    { id: "society", name: "Society & Civilization", color: "#4A4A8A" },
    { id: "development", name: "National Development", color: "#2B7A0B" },
];

const sampleDiscussions = [
    {
        title: "Aryabhata and the Kerala School: How Indian mathematics reshaped the world",
        excerpt: "Before Newton and Leibniz, the Kerala School had developed infinite series for sine, cosine, and the value of π. Madhava's work in the 14th century anticipates calculus by three centuries. Why has this story been so underrepresented in global histories of science?",
        body: "Before Newton and Leibniz, the Kerala School had developed infinite series for sine, cosine, and the value of π. Madhava's work in the 14th century anticipates calculus by three centuries. Why has this story been so underrepresented in global histories of science?",
        categoryId: "science",
        pinned: true,
        views: 2843,
        tags: ["mathematics", "astronomy", "kerala-school", "aryabhata"],
        authorName: "Arjun Krishnaswamy",
        authorEmail: "arjun@indicforum.in",
        authorInitials: "AK",
        authorBg: "#B85428",
    },
    {
        title: "Nalanda: The world's first residential university and what it tells us about Indian intellectual culture",
        excerpt: "At its height, Nalanda hosted over 10,000 students from China, Korea, Central Asia, and Southeast Asia. Its nine-million-manuscript library took three months to burn. What can its pedagogical model teach modern universities?",
        body: "At its height, Nalanda hosted over 10,000 students from China, Korea, Central Asia, and Southeast Asia. Its nine-million-manuscript library took three months to burn. What can its pedagogical model teach modern universities?",
        categoryId: "history",
        pinned: true,
        views: 3920,
        tags: ["nalanda", "education", "ancient-india", "buddhism"],
        authorName: "Priya Menon",
        authorEmail: "priya@indicforum.in",
        authorInitials: "PM",
        authorBg: "#2D6A4F",
    },
    {
        title: "The Arthashastra: Chanakya's relevance to modern geopolitics and public administration",
        excerpt: "Written in the 4th century BCE, Kautilya's Arthashastra contains remarkably modern insights on diplomatic strategy, counter-intelligence, trade policy, and state welfare. A comparative reading with Machiavelli reveals striking contrasts.",
        body: "Written in the 4th century BCE, Kautilya's Arthashastra contains remarkably modern insights on diplomatic strategy, counter-intelligence, trade policy, and state welfare. A comparative reading with Machiavelli reveals striking contrasts.",
        categoryId: "philosophy",
        pinned: false,
        views: 1876,
        tags: ["arthashastra", "chanakya", "economics", "governance"],
        authorName: "Rohan Desai",
        authorEmail: "rohan@indicforum.in",
        authorInitials: "RD",
        authorBg: "#0F1C3F",
    },
    {
        title: "ISRO's journey: From Thumba to Chandrayaan — building a space civilization from scratch",
        excerpt: "In 1963, India launched its first sounding rocket from a church in Thumba. By 2023, it had soft-landed on the Moon's south pole for the first time in history. What does this arc tell us about Indian institutional ambition?",
        body: "In 1963, India launched its first sounding rocket from a church in Thumba. By 2023, it had soft-landed on the Moon's south pole for the first time in history. What does this arc tell us about Indian institutional ambition?",
        categoryId: "development",
        pinned: false,
        views: 5200,
        tags: ["isro", "space", "science", "chandrayaan"],
        authorName: "Vikram Rao",
        authorEmail: "vikram@indicforum.in",
        authorInitials: "VR",
        authorBg: "#0A4A6A",
    },
];

async function main() {
    // 1. Seed Categories
    for (const cat of categories) {
        await prisma.category.upsert({
            where: { id: cat.id },
            update: {},
            create: cat,
        });
    }

    // 2. Seed Discussions + Authors
    for (const disc of sampleDiscussions) {
        const author = await prisma.user.upsert({
            where: { email: disc.authorEmail },
            update: {},
            create: {
                name: disc.authorName,
                email: disc.authorEmail,
                initials: disc.authorInitials,
                bg: disc.authorBg,
            },
        });

        const existing = await prisma.discussion.findFirst({
            where: { title: disc.title },
        });

        if (!existing) {
            await prisma.discussion.create({
                data: {
                    title: disc.title,
                    excerpt: disc.excerpt,
                    body: disc.body,
                    categoryId: disc.categoryId,
                    pinned: disc.pinned,
                    views: disc.views,
                    tags: disc.tags,
                    authorId: author.id,
                },
            });

            await prisma.category.update({
                where: { id: disc.categoryId },
                data: { count: { increment: 1 } },
            });
        }
    }

    console.log("Database seeded successfully with categories and discussions.");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });