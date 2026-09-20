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

const scholars = [
    { name: "Arjun Krishnaswamy", email: "arjun@indicforum.in", username: "arjun_k", initials: "AK", bg: "#B85428" },
    { name: "Priya Menon", email: "priya@indicforum.in", username: "priya_m", initials: "PM", bg: "#2D6A4F" },
    { name: "Rohan Desai", email: "rohan@indicforum.in", username: "rohan_d", initials: "RD", bg: "#0F1C3F" },
    { name: "Kavitha Ramachandran", email: "kavitha@indicforum.in", username: "kavitha_r", initials: "KR", bg: "#5C2D8A" },
    { name: "Muthu Selvam", email: "muthu@indicforum.in", username: "muthu_s", initials: "MS", bg: "#6B3A2A" },
    { name: "Siddharth Pawar", email: "siddharth@indicforum.in", username: "siddharth_p", initials: "SP", bg: "#0F3460" },
    { name: "Deepa Narayan", email: "deepa@indicforum.in", username: "deepa_n", initials: "DN", bg: "#8B4513" },
    { name: "Vikram Rao", email: "vikram@indicforum.in", username: "vikram_r", initials: "VR", bg: "#0A4A6A" },
    { name: "Dr. Anand Radhakrishnan", email: "anand@indicforum.in", username: "anand_r", initials: "AR", bg: "#1D3557" },
    { name: "Maitreyi Sen", email: "maitreyi@indicforum.in", username: "maitreyi_s", initials: "MS", bg: "#4A4A8A" },
    { name: "Vaidik Acharya", email: "vaidik@indicforum.in", username: "vaidik_a", initials: "VA", bg: "#0F1C3F" },
    { name: "Dr. Charaka Gupta", email: "charaka@indicforum.in", username: "charaka_g", initials: "CG", bg: "#2D6A4F" },
    { name: "Rahul Krishnan", email: "rahul@indicforum.in", username: "rahul_k", initials: "RK", bg: "#0F1C3F" },
    { name: "Ananya Iyer", email: "ananya@indicforum.in", username: "ananya_i", initials: "AI", bg: "#5C2D8A" },
];

const seedMegaThreads = [
    {
        id: "mega-history",
        title: "Indian Civilizational History",
        description: "From the Saraswati-Sindhu civilization to classical empires, maritime networks, education centers, and the living continuity of Bharat across millennia.",
        categoryId: "history",
        featured: true,
        participantCount: 342,
        tags: ["civilization", "nalanda", "maritime", "trade-routes", "continuity"],
    },
    {
        id: "mega-philosophy",
        title: "Indic Philosophy, Logic & Epistemology",
        description: "The Six Darshanas, Nyaya epistemology, Buddhist and Jain logic, Advaita Vedanta, and the civilizational tradition of open debate (Vada).",
        categoryId: "philosophy",
        featured: true,
        participantCount: 289,
        tags: ["darshanas", "nyaya", "vedanta", "epistemology", "pramanas"],
    },
    {
        id: "mega-science",
        title: "Science, Mathematics & Indigenous Technologies",
        description: "Indian contributions to mathematics, Kerala School calculus, astronomy, metallurgy, Ayurveda, and the institutional arc to modern ISRO frontiers.",
        categoryId: "science",
        featured: true,
        participantCount: 412,
        tags: ["kerala-school", "calculus", "aryabhata", "metallurgy", "isro"],
    },
    {
        id: "mega-literature",
        title: "Classical Literature, Epics & Linguistic Traditions",
        description: "Paninian generative grammar, 2,000-year Tamil Sangam poetry, Sanskrit Kavya traditions, and the transformative vernacular Bhakti revolution.",
        categoryId: "literature",
        featured: false,
        participantCount: 215,
        tags: ["sangam", "sanskrit", "panini", "bhakti", "kavya"],
    },
    {
        id: "mega-development",
        title: "Statecraft, Sovereignty & National Renewal",
        description: "Arthashastra diplomacy, Dharma-centered governance, civilizational resistance, Ambedkar's constitutional vision, and modern institutional resurgence.",
        categoryId: "development",
        featured: false,
        participantCount: 378,
        tags: ["arthashastra", "constitution", "ambedkar", "sovereignty", "governance"],
    },
    {
        id: "mega-art",
        title: "Sacred Architecture, Art & Urban Planning",
        description: "From Harappan subterranean drainage grids to the temple mandala geometry of Thanjavur, rock-cut wonders of Ellora, and Vijayanagara splendor.",
        categoryId: "art",
        featured: false,
        participantCount: 194,
        tags: ["temples", "hampi", "vijayanagara", "indus-valley", "sculpture"],
    },
];

const seedDiscussions = [
    {
        id: "1",
        megaThreadId: "mega-science",
        title: "Aryabhata and the Kerala School: How Indian mathematics reshaped the world",
        excerpt: "Before Newton and Leibniz, the Kerala School had developed infinite series for sine, cosine, and the value of π. Madhava's work in the 14th century anticipates calculus by three centuries. Why has this story been so underrepresented in global histories of science?",
        body: "Before Newton and Leibniz, the Kerala School of Astronomy and Mathematics had developed infinite series for trigonometric functions and π. Madhava of Sangamagrama's work in the 14th century anticipates key concepts of calculus by three centuries. Texts like the Yuktibhasa systematically prove these results. How did these mathematical insights emerge from astronomical computation, and why does standard global curriculum continue to omit this critical lineage?",
        authorEmail: "arjun@indicforum.in",
        categoryId: "science",
        pinned: true,
        views: 2843,
        likes: 51,
        tags: ["mathematics", "astronomy", "kerala-school", "aryabhata"],
        posts: [
            {
                id: "post-1-1",
                authorEmail: "arjun@indicforum.in",
                content: "Before Newton and Leibniz, the Kerala School of Astronomy and Mathematics had developed infinite series for trigonometric functions and π. Madhava of Sangamagrama's work in the 14th century anticipates key concepts of calculus by three centuries. Texts like the Yuktibhasa systematically prove these results. How did these mathematical insights emerge from astronomical computation, and why does standard global curriculum continue to omit this critical lineage?",
                replyToPostId: null,
                likes: 51,
            },
            {
                id: "post-1-2",
                authorEmail: "priya@indicforum.in",
                content: "Excellent framing. What is often overlooked is that Aryabhata was building on a tradition going back to the Vedanga Jyotisha (c. 1200 BCE), which already contained sophisticated cyclical astronomical calculations. The continuity and accumulation of Indian scientific thought across centuries is remarkable - it wasn't a series of isolated geniuses but an ongoing institutional and textual tradition.",
                replyToPostId: "post-1-1",
                likes: 34,
            },
            {
                id: "post-1-3",
                authorEmail: "rahul@indicforum.in",
                content: "The transmission question is fascinating. Al-Khwarizmi's 'Algoritmi de numero Indorum' (9th c. CE) explicitly credits Indian scholars for the decimal positional system and zero. The word 'algorithm' is a Latinisation of al-Khwarizmi's name. Furthermore, Jesuit missionaries like Matteo Ricci were stationed in Cochin in the 16th century, right when Kerala school manuscripts were flourishing.",
                replyToPostId: "post-1-2",
                likes: 45,
            },
            {
                id: "post-1-4",
                authorEmail: "ananya@indicforum.in",
                content: "The historiographical question matters a great deal. The history of science has been largely written through a Eurocentric lens that systematically under-represented non-Western contributions. Decolonizing the history of science is not about chauvinism—it's about historical accuracy. We owe it to the Madhavas, Brahmaguptas, and Ramanujans to reconstruct a truer record.",
                replyToPostId: "post-1-1",
                likes: 38,
            },
            {
                id: "post-1-5",
                authorEmail: "arjun@indicforum.in",
                content: "Precisely Rahul. George Gheverghese Joseph's 'Crest of the Peacock' documents evidence of astronomical tables being collected by Jesuits in Malabar to solve the maritime navigation longitude problem. This transmission conduit warrants far deeper archival investigation.",
                replyToPostId: "post-1-3",
                likes: 27,
            },
        ],
    },
    {
        id: "2",
        megaThreadId: "mega-history",
        title: "Nalanda: The world's first residential university and what it tells us about Indian intellectual culture",
        excerpt: "At its height, Nalanda hosted over 10,000 students from China, Korea, Central Asia, and Southeast Asia. Its nine-million-manuscript library took three months to burn. What can its pedagogical model teach modern universities?",
        body: "At its height, Nalanda hosted over 10,000 students and 2,000 faculty from across Asia. Admission was rigorous—the Dvarapala (gatekeeper) conducted an oral examination that only about 20-30% of applicants passed. The pedagogical model prioritized debate (Vada), critical inquiry, and multi-disciplinary learning alongside astronomy, medicine, and logic. What can this ancient residential model teach our contemporary universities?",
        authorEmail: "priya@indicforum.in",
        categoryId: "history",
        pinned: true,
        views: 3920,
        likes: 64,
        tags: ["nalanda", "education", "ancient-india", "buddhism"],
        posts: [
            {
                id: "post-2-1",
                authorEmail: "priya@indicforum.in",
                content: "At its height, Nalanda hosted over 10,000 students and 2,000 faculty from across Asia. Admission was rigorous—the Dvarapala (gatekeeper) conducted an oral examination that only about 20-30% of applicants passed. The pedagogical model prioritized debate (Vada), critical inquiry, and multi-disciplinary learning alongside astronomy, medicine, and logic. What can this ancient residential model teach our contemporary universities?",
                replyToPostId: null,
                likes: 42,
            },
            {
                id: "post-2-2",
                authorEmail: "arjun@indicforum.in",
                content: "The Dvarapala examination is particularly fascinating. It wasn't about rote memory of scriptures; it tested the applicant's dialectical agility and capacity for spontaneous reasoning. Modern university entrance exams have devolved largely into standardized multiple-choice memorization tests, abandoning this emphasis on live oral argumentation.",
                replyToPostId: "post-2-1",
                likes: 29,
            },
            {
                id: "post-2-3",
                authorEmail: "anand@indicforum.in",
                content: "Let us also remember the residential funding model. Nalanda was endowed by royal charters with the revenues of over a hundred villages. This gave the acharyas complete intellectual and economic autonomy from transient political whims. Modern public universities constantly struggle with funding interference.",
                replyToPostId: "post-2-1",
                likes: 31,
            },
            {
                id: "post-2-4",
                authorEmail: "maitreyi@indicforum.in",
                content: "Spot on Arjun. In fact, Tibetan chronicles describe how Xuanzang spent months preparing specifically for the Nalanda gate examination before he was permitted entry to study under Silabhadra. The peer learning ecosystem was extraordinary because every single admitted student was an intellectual powerhouse in their own right.",
                replyToPostId: "post-2-2",
                likes: 19,
            },
            {
                id: "post-2-5",
                authorEmail: "priya@indicforum.in",
                content: "Excellent point regarding the village endowments, Anand. What strikes me is that this endowment was respected across multiple dynasties—Guptas, Harsha, and the Palas all renewed and expanded these land grants despite having differing religious leanings. There was an overarching civilizational consensus on patronizing higher learning.",
                replyToPostId: "post-2-3",
                likes: 24,
            },
            {
                id: "post-2-6",
                authorEmail: "rohan@indicforum.in",
                content: "Has anyone here read Dharmasvamin's account from 1235 CE? Even amidst the ruins, a 90-year-old monk, Rahula Shribhadra, was still teaching Sanskrit grammar to a handful of students with Dharmasvamin bringing him food. That dedication to knowledge transmission even after destruction is deeply moving.",
                replyToPostId: null,
                likes: 38,
            },
            {
                id: "post-2-7",
                authorEmail: "kavitha@indicforum.in",
                content: "I also wanted to highlight Takshashila's contrasting decentralized model. Unlike Nalanda's centralized vihara campus, Takshashila functioned as an agglomeration of autonomous gurukulas where masters like Chanakya and Panini taught independently under a common intellectual ecosystem.",
                replyToPostId: "post-2-4",
                likes: 15,
            },
        ],
    },
    {
        id: "3",
        megaThreadId: "mega-philosophy",
        title: "The Arthashastra: Chanakya's relevance to modern geopolitics and public administration",
        excerpt: "Written in the 4th century BCE, Kautilya's Arthashastra contains remarkably modern insights on diplomatic strategy, counter-intelligence, trade policy, and state welfare. A comparative reading with Machiavelli reveals striking contrasts.",
        body: "Written in the 4th century BCE, Kautilya's Arthashastra contains remarkably modern insights on diplomatic strategy (Mandala theory), counter-intelligence, trade regulation, and Yogakshema (the sovereign duty of public welfare). Unlike Machiavelli, Kautilya anchors political realism within Dharma and sustainable statecraft. How can modern foreign policy draw from this treatise?",
        authorEmail: "rohan@indicforum.in",
        categoryId: "philosophy",
        pinned: false,
        views: 1876,
        likes: 42,
        tags: ["arthashastra", "chanakya", "economics", "governance"],
        posts: [
            {
                id: "post-3-1",
                authorEmail: "rohan@indicforum.in",
                content: "Written in the 4th century BCE, Kautilya's Arthashastra contains remarkably modern insights on diplomatic strategy (Mandala theory), counter-intelligence, trade regulation, and Yogakshema (the sovereign duty of public welfare). Unlike Machiavelli, Kautilya anchors political realism within Dharma and sustainable statecraft. How can modern foreign policy draw from this treatise?",
                replyToPostId: null,
                likes: 39,
            },
            {
                id: "post-3-2",
                authorEmail: "siddharth@indicforum.in",
                content: "The crucial difference with Machiavelli lies in Kautilya's definition of Yogakshema—the king has no personal interest distinct from the well-being and prosperity of his subjects: 'Prajasukhe sukham rajnah, prajanam cha hite hitam'. Power is never an end in itself; it is strictly an instrument for societal harmony.",
                replyToPostId: "post-3-1",
                likes: 33,
            },
            {
                id: "post-3-3",
                authorEmail: "vikram@indicforum.in",
                content: "The Mandala theory of concentric geopolitical circles—where your immediate neighbor is a natural competitor and their neighbor a natural ally—anticipates contemporary balance-of-power realism by two millennia. It is actively studied today in strategic defense colleges worldwide.",
                replyToPostId: "post-3-1",
                likes: 26,
            },
            {
                id: "post-3-4",
                authorEmail: "rohan@indicforum.in",
                content: "Yes Vikram, and notice how Kautilya discusses economic intelligence and state monopolies on mining and forestry. He recognized that military capability is completely derivative of state fiscal health (Kosha). Without treasury surplus, geopolitical deterrence collapses.",
                replyToPostId: "post-3-3",
                likes: 21,
            },
        ],
    },
    {
        id: "8",
        megaThreadId: "mega-development",
        title: "ISRO's journey: From Thumba to Chandrayaan - building a space civilization from scratch",
        excerpt: "In 1963, India launched its first sounding rocket from a church in Thumba. By 2023, it had soft-landed on the Moon's south pole for the first time in history. What does this arc tell us about Indian institutional ambition?",
        body: "Vikram Sarabhai envisioned that a developing country must be second to none in the application of advanced technologies to the real problems of society. From transporting rocket cones on bicycles in Thumba to frugal interplanetary missions like Mangalyaan and Chandrayaan-3, what institutional culture enabled ISRO's unique trajectory?",
        authorEmail: "vikram@indicforum.in",
        categoryId: "development",
        pinned: false,
        views: 5200,
        likes: 88,
        tags: ["isro", "space", "science", "chandrayaan"],
        posts: [
            {
                id: "post-8-1",
                authorEmail: "vikram@indicforum.in",
                content: "Vikram Sarabhai envisioned that a developing country must be second to none in the application of advanced technologies to the real problems of society. From transporting rocket cones on bicycles in Thumba to frugal interplanetary missions like Mangalyaan and Chandrayaan-3, what institutional culture enabled ISRO's unique trajectory?",
                replyToPostId: null,
                likes: 67,
            },
            {
                id: "post-8-2",
                authorEmail: "arjun@indicforum.in",
                content: "The defining factor was Sarabhai and Satish Dhawan's culture of psychological safety and accountability. When SLV-3 failed in 1979, Satish Dhawan took the press conference and accepted full responsibility. When it succeeded in 1980, he stepped back and sent Abdul Kalam to address the nation.",
                replyToPostId: "post-8-1",
                likes: 54,
            },
            {
                id: "post-8-3",
                authorEmail: "deepa@indicforum.in",
                content: "Also note the indigenous supply chain. When cryogenic engine technology was denied under sanctions in the 1990s, ISRO developed the CE-20 cryogenic engine internally through collaboration with Indian private industry and academic labs over two decades.",
                replyToPostId: "post-8-2",
                likes: 41,
            },
            {
                id: "post-8-4",
                authorEmail: "vikram@indicforum.in",
                content: "That self-reliance (Atmanirbharta) is now bearing fruit in the Gaganyaan human spaceflight mission and the Chandrayaan sample return missions. It demonstrates civilizational endurance in scientific enterprise.",
                replyToPostId: "post-8-3",
                likes: 36,
            },
        ],
    },
    {
        id: "9",
        megaThreadId: "mega-history",
        title: "Indian maritime trade: Chola naval networks and the Indian Ocean trade sphere",
        excerpt: "Rajendra Chola's naval expedition to Srivijaya in 1025 CE was the culmination of over a millennium of active Indian Ocean seafaring, trading spices, textiles, and philosophical manuscripts.",
        body: "From Roman-era ports like Arikamedu and Muziris to the maritime guilds of the Cholas (Manigramam and Ayyavole 500), Indian merchants dominated maritime trade across the Bay of Bengal and the Arabian Sea. How was this trade organized without militarized colonization?",
        authorEmail: "anand@indicforum.in",
        categoryId: "history",
        pinned: false,
        views: 2150,
        likes: 35,
        tags: ["chola", "maritime", "trade", "indian-ocean"],
        posts: [
            {
                id: "post-9-1",
                authorEmail: "anand@indicforum.in",
                content: "From Roman-era ports like Arikamedu and Muziris to the maritime guilds of the Cholas (Manigramam and Ayyavole 500), Indian merchants dominated maritime trade across the Bay of Bengal and the Arabian Sea. How was this trade organized without militarized colonization?",
                replyToPostId: null,
                likes: 35,
            },
        ],
    },
    {
        id: "11",
        megaThreadId: "mega-philosophy",
        title: "Nyaya Epistemology: The four Pramanas and how classical India defined empirical truth",
        excerpt: "The Nyaya school developed a rigorous formal epistemology based on Pratyaksha (perception), Anumana (inference), Upamana (comparison), and Shabda (testimony).",
        body: "Gautama's Nyaya Sutras establish an exacting framework for validating knowledge claims. Anumana involves a five-step syllogism (Pratijna, Hetu, Udaharana, Upanaya, Nigamana) that integrates deduction with empirical observation. Why is this methodology so crucial for contemporary scientific epistemology?",
        authorEmail: "vaidik@indicforum.in",
        categoryId: "philosophy",
        pinned: false,
        views: 1980,
        likes: 29,
        tags: ["nyaya", "logic", "epistemology", "pramanas"],
        posts: [
            {
                id: "post-11-1",
                authorEmail: "vaidik@indicforum.in",
                content: "Gautama's Nyaya Sutras establish an exacting framework for validating knowledge claims. Anumana involves a five-step syllogism (Pratijna, Hetu, Udaharana, Upanaya, Nigamana) that integrates deduction with empirical observation. Why is this methodology so crucial for contemporary scientific epistemology?",
                replyToPostId: null,
                likes: 29,
            },
        ],
    },
];

async function main() {
    console.log("Seeding BHARAT-GANRAJYA Nationalists Front database...");

    // 1. Seed Categories
    for (const cat of categories) {
        await prisma.category.upsert({
            where: { id: cat.id },
            update: { name: cat.name, color: cat.color },
            create: cat,
        });
    }
    console.log(`✓ Seeded ${categories.length} categories.`);

    // 2. Seed Scholars / Users
    const userMap = new Map<string, string>();
    for (const s of scholars) {
        const user = await prisma.user.upsert({
            where: { email: s.email },
            update: {
                name: s.name,
                username: s.username,
                initials: s.initials,
                bg: s.bg,
            },
            create: {
                name: s.name,
                email: s.email,
                username: s.username,
                initials: s.initials,
                bg: s.bg,
            },
        });
        userMap.set(s.email, user.id);
    }
    console.log(`✓ Seeded ${scholars.length} scholars/users.`);

    // 3. Seed MegaThreads
    for (const mt of seedMegaThreads) {
        await prisma.megaThread.upsert({
            where: { id: mt.id },
            update: {
                title: mt.title,
                description: mt.description,
                categoryId: mt.categoryId,
                featured: mt.featured,
                tags: mt.tags,
                participantCount: mt.participantCount,
            },
            create: {
                id: mt.id,
                title: mt.title,
                description: mt.description,
                categoryId: mt.categoryId,
                featured: mt.featured,
                tags: mt.tags,
                participantCount: mt.participantCount,
            },
        });
    }
    console.log(`✓ Seeded ${seedMegaThreads.length} MegaThreads.`);

    // 4. Seed Discussions & Flat Posts
    for (const disc of seedDiscussions) {
        const authorId = userMap.get(disc.authorEmail);
        if (!authorId) continue;

        const createdDisc = await prisma.discussion.upsert({
            where: { id: disc.id },
            update: {
                title: disc.title,
                excerpt: disc.excerpt,
                body: disc.body,
                megaThreadId: disc.megaThreadId,
                categoryId: disc.categoryId,
                pinned: disc.pinned,
                views: disc.views,
                likes: disc.likes,
                tags: disc.tags,
                authorId,
            },
            create: {
                id: disc.id,
                title: disc.title,
                excerpt: disc.excerpt,
                body: disc.body,
                megaThreadId: disc.megaThreadId,
                categoryId: disc.categoryId,
                pinned: disc.pinned,
                views: disc.views,
                likes: disc.likes,
                tags: disc.tags,
                authorId,
            },
        });

        // Seed Posts for this discussion
        for (const p of disc.posts) {
            const postAuthorId = userMap.get(p.authorEmail) || authorId;
            await prisma.post.upsert({
                where: { id: p.id },
                update: {
                    content: p.content,
                    likes: p.likes,
                    replyToPostId: p.replyToPostId,
                    discussionId: createdDisc.id,
                    authorId: postAuthorId,
                },
                create: {
                    id: p.id,
                    content: p.content,
                    likes: p.likes,
                    replyToPostId: p.replyToPostId,
                    discussionId: createdDisc.id,
                    authorId: postAuthorId,
                },
            });
        }

        // Update MegaThread discussion count
        if (disc.megaThreadId) {
            const count = await prisma.discussion.count({
                where: { megaThreadId: disc.megaThreadId },
            });
            await prisma.megaThread.update({
                where: { id: disc.megaThreadId },
                data: { discussionCount: count },
            });
        }

        // Update Category discussion count
        const catCount = await prisma.discussion.count({
            where: { categoryId: disc.categoryId },
        });
        await prisma.category.update({
            where: { id: disc.categoryId },
            data: { count: catCount },
        });
    }

    // 5. Seed authentic Likes from scholars for discussions and posts
    const allUsers = await prisma.user.findMany();
    const allDiscussions = await prisma.discussion.findMany();
    const allPosts = await prisma.post.findMany();

    if (allUsers.length > 0) {
        // Seed discussion likes
        for (const disc of allDiscussions) {
            const likeCount = 2 + (disc.title.length % 5);
            const likers = allUsers.slice(0, Math.min(likeCount, allUsers.length));
            for (const liker of likers) {
                await prisma.discussionLike.upsert({
                    where: {
                        userId_discussionId: {
                            userId: liker.id,
                            discussionId: disc.id,
                        },
                    },
                    update: {},
                    create: {
                        userId: liker.id,
                        discussionId: disc.id,
                    },
                });
            }
            const count = await prisma.discussionLike.count({ where: { discussionId: disc.id } });
            await prisma.discussion.update({
                where: { id: disc.id },
                data: { likes: count },
            });
        }

        // Seed post likes
        for (let i = 0; i < allPosts.length; i++) {
            const post = allPosts[i];
            const likeCount = (i % 4) + 1;
            const likers = allUsers.slice(i % 3, (i % 3) + likeCount);
            for (const liker of likers) {
                await prisma.postLike.upsert({
                    where: {
                        userId_postId: {
                            userId: liker.id,
                            postId: post.id,
                        },
                    },
                    update: {},
                    create: {
                        userId: liker.id,
                        postId: post.id,
                    },
                });
            }
            const count = await prisma.postLike.count({ where: { postId: post.id } });
            await prisma.post.update({
                where: { id: post.id },
                data: { likes: count },
            });
        }
    }

    console.log("✓ Database successfully populated with MegaThreads, discussions, flat posts, and sample likes.");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error("Seed error:", e);
        await prisma.$disconnect();
        process.exit(1);
    });