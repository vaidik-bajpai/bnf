import {
    Compass,
    Lightbulb,
    Award,
    BookOpen,
    Zap,
    Globe,
    Users,
    Shield,
    Star
} from "lucide-react";
import type {
    Leader,
    ForumCategory,
    Discussion,
    ReplyData,
    KnowledgeSystem,
    TimelineEvent,
    MegaThread,
    Post,
    Author,
} from "@/types/forum";

export const leaders: Leader[] = [
    {
        name: "Chanakya",
        era: "c. 375-283 BCE",
        domain: "Philosopher - Strategist",
        desc: "Author of the Arthashastra - the world's first treatise on statecraft, taxation, and diplomacy - who unified Bharat under the Maurya Empire.",
        initials: "CK",
        bg: "#8B4513",
    },
    {
        name: "Aryabhata",
        era: "476-550 CE",
        domain: "Mathematician - Astronomer",
        desc: "Calculated the value of π, explained eclipses with orbital mechanics, and posited Earth's rotation - a millennium before Copernicus.",
        initials: "AB",
        bg: "#1D3557",
    },
    {
        name: "Adi Shankaracharya",
        era: "788-820 CE",
        domain: "Philosopher - Reformer",
        desc: "Synthesized Advaita Vedanta, established four mathas across India, and revitalized a unified philosophical tradition from Kerala to Kashmir.",
        initials: "AS",
        bg: "#6B3A2A",
    },
    {
        name: "Rani Lakshmibai",
        era: "1828-1858 CE",
        domain: "Queen - Freedom Fighter",
        desc: "The Rani of Jhansi became an enduring symbol of resistance during the 1857 uprising - embodying sovereignty, courage, and sacrifice.",
        initials: "RL",
        bg: "#5C2D8A",
    },
    {
        name: "Rabindranath Tagore",
        era: "1861-1941 CE",
        domain: "Poet - Philosopher",
        desc: "Nobel laureate whose Gitanjali transformed world literature. Composed India's national anthem and envisioned an enlightened civilizational future.",
        initials: "RT",
        bg: "#1A4A6A",
    },
    {
        name: "Swami Vivekananda",
        era: "1863-1902 CE",
        domain: "Vedanta Teacher",
        desc: "Brought India's philosophical traditions to the world stage at the 1893 Parliament of Religions, redefining global understanding of Indic thought.",
        initials: "SV",
        bg: "#B85428",
    },
    {
        name: "Subhas Chandra Bose",
        era: "1897-1945 CE",
        domain: "Freedom Fighter",
        desc: '"Netaji" forged the Indian National Army and declared a provisional Free India government - the fiercest voice for complete independence.',
        initials: "SC",
        bg: "#7B1A1A",
    },
    {
        name: "B. R. Ambedkar",
        era: "1891-1956 CE",
        domain: "Jurist - Reformer",
        desc: "Chief architect of the Indian Constitution, tireless crusader for social justice, and a towering intellect who recast the foundations of modern India.",
        initials: "BA",
        bg: "#0F3460",
    },
    {
        name: "C. V. Raman",
        era: "1888-1970 CE",
        domain: "Physicist",
        desc: "Discovered the Raman Effect - scattering of light revealing molecular structure - winning India's first Nobel Prize in the sciences in 1930.",
        initials: "CR",
        bg: "#1A5C3A",
    },
    {
        name: "Vikram Sarabhai",
        era: "1919-1971 CE",
        domain: "Scientist - Visionary",
        desc: "Founding father of India's space program. His establishment of ISRO laid the groundwork for India becoming a major spacefaring civilization.",
        initials: "VS",
        bg: "#0A4A6A",
    },
    {
        name: "APJ Abdul Kalam",
        era: "1931-2015 CE",
        domain: "Scientist - President",
        desc: "The Missile Man of India who led landmark ISRO achievements and served as the 11th President, inspiring generations with his vision of a rising India.",
        initials: "AK",
        bg: "#3A2A7A",
    },
    {
        name: "Sushruta",
        era: "c. 600 BCE",
        domain: "Physician - Surgeon",
        desc: "Composed the Sushruta Samhita, describing over 300 surgical procedures and 120 surgical instruments - the world's oldest surgical tradition.",
        initials: "SU",
        bg: "#2A6A5A",
    },
];

export const forumCategories: ForumCategory[] = [
    { id: "history", name: "Indian History", icon: <Compass className="w-5 h-5" />, count: 847, color: "#B85428" },
    { id: "philosophy", name: "Indic Philosophy", icon: <Lightbulb className="w-5 h-5" />, count: 523, color: "#0F1C3F" },
    { id: "culture", name: "Culture & Heritage", icon: <Award className="w-5 h-5" />, count: 634, color: "#C8971A" },
    { id: "literature", name: "Literature & Languages", icon: <BookOpen className="w-5 h-5" />, count: 412, color: "#2D6A4F" },
    { id: "science", name: "Science & Knowledge", icon: <Zap className="w-5 h-5" />, count: 389, color: "#1D3557" },
    { id: "art", name: "Art & Architecture", icon: <Globe className="w-5 h-5" />, count: 298, color: "#6B3A2A" },
    { id: "society", name: "Society & Civilization", icon: <Users className="w-5 h-5" />, count: 567, color: "#4A4A8A" },
    { id: "development", name: "National Development", icon: <Shield className="w-5 h-5" />, count: 723, color: "#2B7A0B" },
];

export const megaThreads: MegaThread[] = [
    {
        id: "mega-history",
        title: "Indian Civilizational History",
        description: "From the Saraswati-Sindhu civilization to classical empires, maritime networks, education centers, and the living continuity of Bharat across millennia.",
        category: "history",
        categoryLabel: "Indian History",
        createdAt: "2026-01-15T08:00:00.000Z",
        updatedAt: "2026-09-12T18:30:00.000Z",
        discussionCount: 4,
        participantCount: 342,
        featured: true,
        tags: ["civilization", "nalanda", "maritime", "trade-routes", "continuity"],
    },
    {
        id: "mega-philosophy",
        title: "Indic Philosophy, Logic & Epistemology",
        description: "The Six Darshanas, Nyaya epistemology, Buddhist and Jain logic, Advaita Vedanta, and the civilizational tradition of open debate (Vada).",
        category: "philosophy",
        categoryLabel: "Indic Philosophy",
        createdAt: "2026-01-20T10:00:00.000Z",
        updatedAt: "2026-09-11T14:20:00.000Z",
        discussionCount: 3,
        participantCount: 289,
        featured: true,
        tags: ["darshanas", "nyaya", "vedanta", "epistemology", "pramanas"],
    },
    {
        id: "mega-science",
        title: "Science, Mathematics & Indigenous Technologies",
        description: "Indian contributions to mathematics, Kerala School calculus, astronomy, metallurgy, Ayurveda, and the institutional arc to modern ISRO frontiers.",
        category: "science",
        categoryLabel: "Science & Knowledge",
        createdAt: "2026-02-01T09:00:00.000Z",
        updatedAt: "2026-09-13T09:15:00.000Z",
        discussionCount: 3,
        participantCount: 412,
        featured: true,
        tags: ["kerala-school", "calculus", "aryabhata", "metallurgy", "isro"],
    },
    {
        id: "mega-literature",
        title: "Classical Literature, Epics & Linguistic Traditions",
        description: "Paninian generative grammar, 2,000-year Tamil Sangam poetry, Sanskrit Kavya traditions, and the transformative vernacular Bhakti revolution.",
        category: "literature",
        categoryLabel: "Literature & Languages",
        createdAt: "2026-02-10T11:00:00.000Z",
        updatedAt: "2026-09-10T12:00:00.000Z",
        discussionCount: 3,
        participantCount: 215,
        featured: false,
        tags: ["sangam", "sanskrit", "panini", "bhakti", "kavya"],
    },
    {
        id: "mega-development",
        title: "Statecraft, Sovereignty & National Renewal",
        description: "Arthashastra diplomacy, Dharma-centered governance, civilizational resistance, Ambedkar's constitutional vision, and modern institutional resurgence.",
        category: "development",
        categoryLabel: "National Development",
        createdAt: "2026-02-18T14:00:00.000Z",
        updatedAt: "2026-09-13T10:45:00.000Z",
        discussionCount: 3,
        participantCount: 378,
        featured: false,
        tags: ["arthashastra", "constitution", "ambedkar", "sovereignty", "governance"],
    },
    {
        id: "mega-art",
        title: "Sacred Architecture, Art & Urban Planning",
        description: "From Harappan subterranean drainage grids to the temple mandala geometry of Thanjavur, rock-cut wonders of Ellora, and Vijayanagara splendor.",
        category: "art",
        categoryLabel: "Art & Architecture",
        createdAt: "2026-03-01T08:30:00.000Z",
        updatedAt: "2026-09-08T16:00:00.000Z",
        discussionCount: 2,
        participantCount: 194,
        featured: false,
        tags: ["temples", "hampi", "vijayanagara", "indus-valley", "sculpture"],
    },
];

export const discussions: Discussion[] = [
    {
        id: "1",
        megaThreadId: "mega-science",
        title: "Aryabhata and the Kerala School: How Indian mathematics reshaped the world",
        excerpt: "Before Newton and Leibniz, the Kerala School had developed infinite series for sine, cosine, and the value of π. Madhava's work in the 14th century anticipates calculus by three centuries. Why has this story been so underrepresented in global histories of science?",
        body: "Before Newton and Leibniz, the Kerala School of Astronomy and Mathematics had developed infinite series for trigonometric functions and π. Madhava of Sangamagrama's work in the 14th century anticipates key concepts of calculus by three centuries. Texts like the Yuktibhasa systematically prove these results. How did these mathematical insights emerge from astronomical computation, and why does standard global curriculum continue to omit this critical lineage?",
        author: { name: "Arjun Krishnaswamy", username: "arjun_k", initials: "AK", bg: "#B85428" },
        category: "science",
        categoryLabel: "Science & Knowledge",
        replies: 5,
        replyCount: 5,
        views: 2843,
        viewCount: 2843,
        lastActivity: "2 hours ago",
        createdAt: "2026-09-12T14:30:00.000Z",
        updatedAt: "2026-09-13T09:15:00.000Z",
        pinned: true,
        tags: ["mathematics", "astronomy", "kerala-school", "aryabhata"],
    },
    {
        id: "2",
        megaThreadId: "mega-history",
        title: "Nalanda: The world's first residential university and what it tells us about Indian intellectual culture",
        excerpt: "At its height, Nalanda hosted over 10,000 students from China, Korea, Central Asia, and Southeast Asia. Its nine-million-manuscript library took three months to burn. What can its pedagogical model teach modern universities?",
        body: "At its height, Nalanda hosted over 10,000 students and 2,000 faculty from across Asia. Admission was rigorous—the Dvarapala (gatekeeper) conducted an oral examination that only about 20-30% of applicants passed. The pedagogical model prioritized debate (Vada), critical inquiry, and multi-disciplinary learning alongside astronomy, medicine, and logic. What can this ancient residential model teach our contemporary universities?",
        author: { name: "Priya Menon", username: "priya_m", initials: "PM", bg: "#2D6A4F" },
        category: "history",
        categoryLabel: "Indian History",
        replies: 7,
        replyCount: 7,
        views: 3920,
        viewCount: 3920,
        lastActivity: "1 hour ago",
        createdAt: "2026-09-11T10:00:00.000Z",
        updatedAt: "2026-09-13T10:15:00.000Z",
        pinned: true,
        tags: ["nalanda", "education", "ancient-india", "buddhism"],
    },
    {
        id: "3",
        megaThreadId: "mega-philosophy",
        title: "The Arthashastra: Chanakya's relevance to modern geopolitics and public administration",
        excerpt: "Written in the 4th century BCE, Kautilya's Arthashastra contains remarkably modern insights on diplomatic strategy, counter-intelligence, trade policy, and state welfare. A comparative reading with Machiavelli reveals striking contrasts.",
        body: "Written in the 4th century BCE, Kautilya's Arthashastra contains remarkably modern insights on diplomatic strategy (Mandala theory), counter-intelligence, trade regulation, and Yogakshema (the sovereign duty of public welfare). Unlike Machiavelli, Kautilya anchors political realism within Dharma and sustainable statecraft. How can modern foreign policy draw from this treatise?",
        author: { name: "Rohan Desai", username: "rohan_d", initials: "RD", bg: "#0F1C3F" },
        category: "philosophy",
        categoryLabel: "Indic Philosophy",
        replies: 4,
        replyCount: 4,
        views: 1876,
        viewCount: 1876,
        lastActivity: "1 day ago",
        createdAt: "2026-09-10T12:00:00.000Z",
        updatedAt: "2026-09-12T16:00:00.000Z",
        tags: ["arthashastra", "chanakya", "economics", "governance"],
    },
    {
        id: "4",
        megaThreadId: "mega-literature",
        title: "The Bhakti Movement: India's great social reform revolution, 12th-17th century",
        excerpt: "Kabir, Mirabai, Tukaram, Basavanna - the Bhakti poet-saints challenged caste, elevated vernacular languages, and produced some of humanity's most luminous devotional poetry. A forgotten revolution?",
        body: "Kabir, Mirabai, Tukaram, Basavanna, and Akka Mahadevi—the Bhakti poet-saints dismantled rigid caste boundaries, elevated regional vernacular languages into literary powerhouses, and created an intimate, non-hierarchical spirituality. How did this decentralized spiritual movement preserve social cohesion through centuries of disruption?",
        author: { name: "Kavitha Ramachandran", username: "kavitha_r", initials: "KR", bg: "#5C2D8A" },
        category: "literature",
        categoryLabel: "Literature & Languages",
        replies: 3,
        replyCount: 3,
        views: 2210,
        viewCount: 2210,
        lastActivity: "2 days ago",
        createdAt: "2026-09-09T09:00:00.000Z",
        updatedAt: "2026-09-11T15:00:00.000Z",
        tags: ["bhakti", "kabir", "mirabai", "social-reform"],
    },
    {
        id: "5",
        megaThreadId: "mega-literature",
        title: "Sangam poetry: A 2,000-year-old secular literary tradition that rivals the Greek classics",
        excerpt: "The Sangam poems (300 BCE - 300 CE) represent perhaps the oldest secular literature in Asia. Their sophisticated classification of love poetry by landscape - Akam poetry - has no parallel in the ancient world.",
        body: "The Sangam corpus (c. 300 BCE - 300 CE) represents one of the world's most sophisticated poetic systems. Its classification of human emotion mapped to five natural landscapes (Tinai)—Kurinji (mountains), Mullai (forests), Marutham (pastures), Neythal (seashore), and Palai (desert)—bridges ecology with interior psychology.",
        author: { name: "Muthu Selvam", username: "muthu_s", initials: "MS", bg: "#6B3A2A" },
        category: "literature",
        categoryLabel: "Literature & Languages",
        replies: 2,
        replyCount: 2,
        views: 1420,
        viewCount: 1420,
        lastActivity: "3 days ago",
        createdAt: "2026-09-08T11:00:00.000Z",
        updatedAt: "2026-09-10T18:00:00.000Z",
        tags: ["tamil", "sangam", "literature", "classical"],
    },
    {
        id: "6",
        megaThreadId: "mega-development",
        title: "Reading the Indian Constitution as a revolutionary document: Ambedkar's philosophical framework",
        excerpt: "The Indian Constitution is not just a legal charter - it is a manifesto for civilizational transformation. How did Ambedkar encode the principles of liberty, equality, and fraternity against centuries of social hierarchy?",
        body: "Dr. B. R. Ambedkar described constitutional morality not as a natural sentiment, but as an acquired discipline essential for a diverse democracy. How does our constitutional jurisprudence balance individual rights with collective community identities and transformative affirmative action?",
        author: { name: "Siddharth Pawar", username: "siddharth_p", initials: "SP", bg: "#0F3460" },
        category: "development",
        categoryLabel: "National Development",
        replies: 4,
        replyCount: 4,
        views: 4100,
        viewCount: 4100,
        lastActivity: "4 hours ago",
        createdAt: "2026-09-11T14:00:00.000Z",
        updatedAt: "2026-09-13T07:30:00.000Z",
        tags: ["ambedkar", "constitution", "equality", "democracy"],
    },
    {
        id: "7",
        megaThreadId: "mega-art",
        title: "Hampi and Vijayanagara: The last great Hindu empire and its architectural legacy",
        excerpt: "At its peak in the 14th-16th centuries, Vijayanagara was one of the largest cities on Earth, visited by Portuguese, Persian, and Chinese travellers who marveled at its wealth. What can its ruins still teach us?",
        body: "From the musical pillars of the Vittala temple to the monumental aquatic channels and stone bazars stretching over miles, Vijayanagara embodied architectural, hydrological, and economic mastery in the Tungabhadra river valley. How did its defensive landscape shape its urban layout?",
        author: { name: "Deepa Narayan", username: "deepa_n", initials: "DN", bg: "#8B4513" },
        category: "art",
        categoryLabel: "Art & Architecture",
        replies: 3,
        replyCount: 3,
        views: 1650,
        viewCount: 1650,
        lastActivity: "5 days ago",
        createdAt: "2026-09-07T09:00:00.000Z",
        updatedAt: "2026-09-08T14:00:00.000Z",
        tags: ["vijayanagara", "hampi", "architecture", "south-india"],
    },
    {
        id: "8",
        megaThreadId: "mega-development",
        title: "ISRO's journey: From Thumba to Chandrayaan - building a space civilization from scratch",
        excerpt: "In 1963, India launched its first sounding rocket from a church in Thumba. By 2023, it had soft-landed on the Moon's south pole for the first time in history. What does this arc tell us about Indian institutional ambition?",
        body: "Vikram Sarabhai envisioned that a developing country must be second to none in the application of advanced technologies to the real problems of society. From transporting rocket cones on bicycles in Thumba to frugal interplanetary missions like Mangalyaan and Chandrayaan-3, what institutional culture enabled ISRO's unique trajectory?",
        author: { name: "Vikram Rao", username: "vikram_r", initials: "VR", bg: "#0A4A6A" },
        category: "development",
        categoryLabel: "National Development",
        replies: 4,
        replyCount: 4,
        views: 5200,
        viewCount: 5200,
        lastActivity: "30 mins ago",
        createdAt: "2026-09-12T16:00:00.000Z",
        updatedAt: "2026-09-13T10:45:00.000Z",
        tags: ["isro", "space", "science", "chandrayaan"],
    },
    {
        id: "9",
        megaThreadId: "mega-history",
        title: "Indian maritime trade: Chola naval networks and the Indian Ocean trade sphere",
        excerpt: "Rajendra Chola's naval expedition to Srivijaya in 1025 CE was the culmination of over a millennium of active Indian Ocean seafaring, trading spices, textiles, and philosophical manuscripts.",
        body: "From Roman-era ports like Arikamedu and Muziris to the maritime guilds of the Cholas (Manigramam and Ayyavole 500), Indian merchants dominated maritime trade across the Bay of Bengal and the Arabian Sea. How was this trade organized without militarized colonization?",
        author: { name: "Dr. Anand Radhakrishnan", username: "anand_r", initials: "AR", bg: "#1D3557" },
        category: "history",
        categoryLabel: "Indian History",
        replies: 3,
        replyCount: 3,
        views: 2150,
        viewCount: 2150,
        lastActivity: "6 hours ago",
        createdAt: "2026-09-10T08:00:00.000Z",
        updatedAt: "2026-09-13T05:00:00.000Z",
        tags: ["chola", "maritime", "trade", "indian-ocean"],
    },
    {
        id: "10",
        megaThreadId: "mega-history",
        title: "Preservation of classical literature and manuscript traditions across ancient mathas",
        excerpt: "How millions of palm-leaf and birch-bark manuscripts survived climate and turmoil through systematic copyist traditions in temples, mathas, and granthasalas.",
        body: "Before paper and printing, how did the civilizational memory of Bharat survive? Mathas and universities maintained Lipikaras (scribes) who continuously recopied palm-leaf manuscripts every few decades. What are the urgent imperatives today for cataloging and digitizing the estimated 5 million surviving manuscripts?",
        author: { name: "Maitreyi Sen", username: "maitreyi_s", initials: "MS", bg: "#4A4A8A" },
        category: "history",
        categoryLabel: "Indian History",
        replies: 2,
        replyCount: 2,
        views: 1580,
        viewCount: 1580,
        lastActivity: "1 day ago",
        createdAt: "2026-09-08T15:00:00.000Z",
        updatedAt: "2026-09-12T11:00:00.000Z",
        tags: ["manuscripts", "preservation", "epigraphy", "mathas"],
    },
    {
        id: "11",
        megaThreadId: "mega-philosophy",
        title: "Nyaya Epistemology: The four Pramanas and how classical India defined empirical truth",
        excerpt: "The Nyaya school developed a rigorous formal epistemology based on Pratyaksha (perception), Anumana (inference), Upamana (comparison), and Shabda (testimony).",
        body: "Gautama's Nyaya Sutras establish an exacting framework for validating knowledge claims. Anumana involves a five-step syllogism (Pratijna, Hetu, Udaharana, Upanaya, Nigamana) that integrates deduction with empirical observation. Why is this methodology so crucial for contemporary scientific epistemology?",
        author: { name: "Vaidik Acharya", username: "vaidik_a", initials: "VA", bg: "#0F1C3F" },
        category: "philosophy",
        categoryLabel: "Indic Philosophy",
        replies: 3,
        replyCount: 3,
        views: 1980,
        viewCount: 1980,
        lastActivity: "3 hours ago",
        createdAt: "2026-09-11T12:00:00.000Z",
        updatedAt: "2026-09-13T08:00:00.000Z",
        tags: ["nyaya", "logic", "epistemology", "pramanas"],
    },
    {
        id: "12",
        megaThreadId: "mega-science",
        title: "Sushruta Samhita: The world's oldest surgical treatise and rhinoplasty techniques",
        excerpt: "Composed around 600 BCE, the Sushruta Samhita details reconstructive plastic surgery, cataract couching, and 121 surgical instruments that anticipate modern tools.",
        body: "Sushruta's techniques for forehead-flap rhinoplasty remained unmatched until British surgeons observed Indian practitioners in Pune in 1793 and brought the technique back to London. How did ancient Indian surgeons understand antisepsis, anesthesia, and anatomical dissection using soaked cadavers?",
        author: { name: "Dr. Charaka Gupta", username: "charaka_g", initials: "CG", bg: "#2D6A4F" },
        category: "science",
        categoryLabel: "Science & Knowledge",
        replies: 3,
        replyCount: 3,
        views: 2490,
        viewCount: 2490,
        lastActivity: "8 hours ago",
        createdAt: "2026-09-09T14:00:00.000Z",
        updatedAt: "2026-09-13T03:00:00.000Z",
        tags: ["sushruta", "surgery", "medicine", "ayurveda"],
    },
];

export const initialPosts: Post[] = [
    // ==========================================
    // Discussion 2: Nalanda (mega-history)
    // ==========================================
    {
        id: "post-2-1",
        discussionId: "2",
        author: { name: "Priya Menon", username: "priya_m", initials: "PM", bg: "#2D6A4F" },
        content: "At its height, Nalanda hosted over 10,000 students and 2,000 faculty from across Asia. Admission was rigorous—the Dvarapala (gatekeeper) conducted an oral examination that only about 20-30% of applicants passed. The pedagogical model prioritized debate (Vada), critical inquiry, and multi-disciplinary learning alongside astronomy, medicine, and logic. What can this ancient residential model teach our contemporary universities?",
        createdAt: "2026-09-11T10:00:00.000Z",
        replyToPostId: null, // Original Post (OP)
        likes: 42,
    },
    {
        id: "post-2-2",
        discussionId: "2",
        author: { name: "Arjun Krishnaswamy", username: "arjun_k", initials: "AK", bg: "#B85428" },
        content: "The Dvarapala examination is particularly fascinating. It wasn't about rote memory of scriptures; it tested the applicant's dialectical agility and capacity for spontaneous reasoning. Modern university entrance exams have devolved largely into standardized multiple-choice memorization tests, abandoning this emphasis on live oral argumentation.",
        createdAt: "2026-09-11T11:20:00.000Z",
        replyToPostId: "post-2-1", // Reply referencing post 1
        likes: 29,
    },
    {
        id: "post-2-3",
        discussionId: "2",
        author: { name: "Dr. Anand Radhakrishnan", username: "anand_r", initials: "AR", bg: "#1D3557" },
        content: "Let us also remember the residential funding model. Nalanda was endowed by royal charters with the revenues of over a hundred villages. This gave the acharyas complete intellectual and economic autonomy from transient political whims. Modern public universities constantly struggle with funding interference.",
        createdAt: "2026-09-11T13:45:00.000Z",
        replyToPostId: "post-2-1", // Reply referencing post 1
        likes: 31,
    },
    {
        id: "post-2-4",
        discussionId: "2",
        author: { name: "Maitreyi Sen", username: "maitreyi_s", initials: "MS", bg: "#4A4A8A" },
        content: "Spot on Arjun. In fact, Tibetan chronicles describe how Xuanzang spent months preparing specifically for the Nalanda gate examination before he was permitted entry to study under Silabhadra. The peer learning ecosystem was extraordinary because every single admitted student was an intellectual powerhouse in their own right.",
        createdAt: "2026-09-11T15:10:00.000Z",
        replyToPostId: "post-2-2", // Reply referencing post 2
        likes: 19,
    },
    {
        id: "post-2-5",
        discussionId: "2",
        author: { name: "Priya Menon", username: "priya_m", initials: "PM", bg: "#2D6A4F" },
        content: "Excellent point regarding the village endowments, Anand. What strikes me is that this endowment was respected across multiple dynasties—Guptas, Harsha, and the Palas all renewed and expanded these land grants despite having differing religious leanings. There was an overarching civilizational consensus on patronizing higher learning.",
        createdAt: "2026-09-11T17:30:00.000Z",
        replyToPostId: "post-2-3", // Reply referencing post 3
        likes: 24,
    },
    {
        id: "post-2-6",
        discussionId: "2",
        author: { name: "Rohan Desai", username: "rohan_d", initials: "RD", bg: "#0F1C3F" },
        content: "Has anyone here read Dharmasvamin's account from 1235 CE? Even amidst the ruins, a 90-year-old monk, Rahula Shribhadra, was still teaching Sanskrit grammar to a handful of students with Dharmasvamin bringing him food. That dedication to knowledge transmission even after destruction is deeply moving.",
        createdAt: "2026-09-12T09:15:00.000Z",
        replyToPostId: null, // Independent post in discussion
        likes: 38,
    },
    {
        id: "post-2-7",
        discussionId: "2",
        author: { name: "Kavitha Ramachandran", username: "kavitha_r", initials: "KR", bg: "#5C2D8A" },
        content: "I also wanted to highlight Takshashila's contrasting decentralized model. Unlike Nalanda's centralized vihara campus, Takshashila functioned as an agglomeration of autonomous gurukulas where masters like Chanakya and Panini taught independently under a common intellectual ecosystem.",
        createdAt: "2026-09-13T10:15:00.000Z",
        replyToPostId: "post-deleted-999", // Testing graceful fallback for unavailable post!
        likes: 15,
    },

    // ==========================================
    // Discussion 1: Aryabhata & Kerala School (mega-science)
    // ==========================================
    {
        id: "post-1-1",
        discussionId: "1",
        author: { name: "Arjun Krishnaswamy", username: "arjun_k", initials: "AK", bg: "#B85428" },
        content: "Before Newton and Leibniz, the Kerala School of Astronomy and Mathematics had developed infinite series for trigonometric functions and π. Madhava of Sangamagrama's work in the 14th century anticipates key concepts of calculus by three centuries. Texts like the Yuktibhasa systematically prove these results. How did these mathematical insights emerge from astronomical computation, and why does standard global curriculum continue to omit this critical lineage?",
        createdAt: "2026-09-12T14:30:00.000Z",
        replyToPostId: null, // OP
        likes: 51,
    },
    {
        id: "post-1-2",
        discussionId: "1",
        author: { name: "Priya Menon", username: "priya_m", initials: "PM", bg: "#2D6A4F" },
        content: "Excellent framing. What is often overlooked is that Aryabhata was building on a tradition going back to the Vedanga Jyotisha (c. 1200 BCE), which already contained sophisticated cyclical astronomical calculations. The continuity and accumulation of Indian scientific thought across centuries is remarkable - it wasn't a series of isolated geniuses but an ongoing institutional and textual tradition.",
        createdAt: "2026-09-12T15:45:00.000Z",
        replyToPostId: "post-1-1",
        likes: 34,
    },
    {
        id: "post-1-3",
        discussionId: "1",
        author: { name: "Rahul Krishnan", username: "rahul_k", initials: "RK", bg: "#0F1C3F" },
        content: "The transmission question is fascinating. Al-Khwarizmi's 'Algoritmi de numero Indorum' (9th c. CE) explicitly credits Indian scholars for the decimal positional system and zero. The word 'algorithm' is a Latinisation of al-Khwarizmi's name. Furthermore, Jesuit missionaries like Matteo Ricci were stationed in Cochin in the 16th century, right when Kerala school manuscripts were flourishing.",
        createdAt: "2026-09-12T18:00:00.000Z",
        replyToPostId: "post-1-2",
        likes: 45,
    },
    {
        id: "post-1-4",
        discussionId: "1",
        author: { name: "Ananya Iyer", username: "ananya_i", initials: "AI", bg: "#5C2D8A" },
        content: "The historiographical question matters a great deal. The history of science has been largely written through a Eurocentric lens that systematically under-represented non-Western contributions. Decolonizing the history of science is not about chauvinism—it's about historical accuracy. We owe it to the Madhavas, Brahmaguptas, and Ramanujans to reconstruct a truer record.",
        createdAt: "2026-09-13T06:20:00.000Z",
        replyToPostId: "post-1-1",
        likes: 38,
    },
    {
        id: "post-1-5",
        discussionId: "1",
        author: { name: "Arjun Krishnaswamy", username: "arjun_k", initials: "AK", bg: "#B85428" },
        content: "Precisely Rahul. George Gheverghese Joseph's 'Crest of the Peacock' documents evidence of astronomical tables being collected by Jesuits in Malabar to solve the maritime navigation longitude problem. This transmission conduit warrants far deeper archival investigation.",
        createdAt: "2026-09-13T09:15:00.000Z",
        replyToPostId: "post-1-3",
        likes: 27,
    },

    // ==========================================
    // Discussion 3: Arthashastra (mega-philosophy)
    // ==========================================
    {
        id: "post-3-1",
        discussionId: "3",
        author: { name: "Rohan Desai", username: "rohan_d", initials: "RD", bg: "#0F1C3F" },
        content: "Written in the 4th century BCE, Kautilya's Arthashastra contains remarkably modern insights on diplomatic strategy (Mandala theory), counter-intelligence, trade regulation, and Yogakshema (the sovereign duty of public welfare). Unlike Machiavelli, Kautilya anchors political realism within Dharma and sustainable statecraft. How can modern foreign policy draw from this treatise?",
        createdAt: "2026-09-10T12:00:00.000Z",
        replyToPostId: null, // OP
        likes: 39,
    },
    {
        id: "post-3-2",
        discussionId: "3",
        author: { name: "Siddharth Pawar", username: "siddharth_p", initials: "SP", bg: "#0F3460" },
        content: "The crucial difference with Machiavelli lies in Kautilya's definition of Yogakshema—the king has no personal interest distinct from the well-being and prosperity of his subjects: 'Prajasukhe sukham rajnah, prajanam cha hite hitam'. Power is never an end in itself; it is strictly an instrument for societal harmony.",
        createdAt: "2026-09-10T14:30:00.000Z",
        replyToPostId: "post-3-1",
        likes: 33,
    },
    {
        id: "post-3-3",
        discussionId: "3",
        author: { name: "Vikram Rao", username: "vikram_r", initials: "VR", bg: "#0A4A6A" },
        content: "The Mandala theory of concentric geopolitical circles—where your immediate neighbor is a natural competitor and their neighbor a natural ally—anticipates contemporary balance-of-power realism by two millennia. It is actively studied today in strategic defense colleges worldwide.",
        createdAt: "2026-09-11T08:15:00.000Z",
        replyToPostId: "post-3-1",
        likes: 26,
    },
    {
        id: "post-3-4",
        discussionId: "3",
        author: { name: "Rohan Desai", username: "rohan_d", initials: "RD", bg: "#0F1C3F" },
        content: "Yes Vikram, and notice how Kautilya discusses economic intelligence and state monopolies on mining and forestry. He recognized that military capability is completely derivative of state fiscal health (Kosha). Without treasury surplus, geopolitical deterrence collapses.",
        createdAt: "2026-09-12T16:00:00.000Z",
        replyToPostId: "post-3-3",
        likes: 21,
    },

    // ==========================================
    // Discussion 8: ISRO's Journey (mega-development)
    // ==========================================
    {
        id: "post-8-1",
        discussionId: "8",
        author: { name: "Vikram Rao", username: "vikram_r", initials: "VR", bg: "#0A4A6A" },
        content: "Vikram Sarabhai envisioned that a developing country must be second to none in the application of advanced technologies to the real problems of society. From transporting rocket cones on bicycles in Thumba to frugal interplanetary missions like Mangalyaan and Chandrayaan-3, what institutional culture enabled ISRO's unique trajectory?",
        createdAt: "2026-09-12T16:00:00.000Z",
        replyToPostId: null, // OP
        likes: 67,
    },
    {
        id: "post-8-2",
        discussionId: "8",
        author: { name: "Arjun Krishnaswamy", username: "arjun_k", initials: "AK", bg: "#B85428" },
        content: "The defining factor was Sarabhai and Satish Dhawan's culture of psychological safety and accountability. When SLV-3 failed in 1979, Satish Dhawan took the press conference and accepted full responsibility. When it succeeded in 1980, he stepped back and sent Abdul Kalam to address the nation.",
        createdAt: "2026-09-12T17:20:00.000Z",
        replyToPostId: "post-8-1",
        likes: 54,
    },
    {
        id: "post-8-3",
        discussionId: "8",
        author: { name: "Deepa Narayan", username: "deepa_n", initials: "DN", bg: "#8B4513" },
        content: "Also note the indigenous supply chain. When cryogenic engine technology was denied under sanctions in the 1990s, ISRO developed the CE-20 cryogenic engine internally through collaboration with Indian private industry and academic labs over two decades.",
        createdAt: "2026-09-13T08:30:00.000Z",
        replyToPostId: "post-8-2",
        likes: 41,
    },
    {
        id: "post-8-4",
        discussionId: "8",
        author: { name: "Vikram Rao", username: "vikram_r", initials: "VR", bg: "#0A4A6A" },
        content: "That self-reliance (Atmanirbharta) is now bearing fruit in the Gaganyaan human spaceflight mission and the Chandrayaan sample return missions. It demonstrates civilizational endurance in scientific enterprise.",
        createdAt: "2026-09-13T10:45:00.000Z",
        replyToPostId: "post-8-3",
        likes: 36,
    },
];

// In-memory mutable stores for interactive frontend persistence
const mockDiscussions: Discussion[] = [...discussions];
const mockPosts: Post[] = [...initialPosts];
const mockMegaThreads: MegaThread[] = [...megaThreads];

export function getMegaThreads(): MegaThread[] {
    return [...mockMegaThreads];
}

export function getMegaThreadById(id: string): MegaThread | undefined {
    return mockMegaThreads.find((mt) => mt.id === id);
}

export function getDiscussionsByMegaThread(megaThreadId: string): Discussion[] {
    return mockDiscussions.filter((d) => d.megaThreadId === megaThreadId);
}

export function getAllDiscussions(): Discussion[] {
    return [...mockDiscussions];
}

export function getDiscussionById(id: string): Discussion | undefined {
    return mockDiscussions.find((d) => d.id === id);
}

export function getPostsByDiscussionId(discussionId: string): Post[] {
    return mockPosts.filter((p) => p.discussionId === discussionId);
}

export function addMockDiscussion(data: {
    title: string;
    body: string;
    megaThreadId: string;
    categoryId?: string;
    tags?: string[];
    author: Author;
}): Discussion {
    const parentMegaThread = mockMegaThreads.find((m) => m.id === data.megaThreadId);
    const categoryId = data.categoryId || parentMegaThread?.category || "history";
    const categoryObj = forumCategories.find((c) => c.id === categoryId);

    const newId = `disc-${Date.now()}`;
    const newDiscussion: Discussion = {
        id: newId,
        megaThreadId: data.megaThreadId,
        title: data.title,
        excerpt: data.body.length > 160 ? data.body.slice(0, 160) + "..." : data.body,
        body: data.body,
        author: data.author,
        category: categoryId,
        categoryLabel: categoryObj?.name || parentMegaThread?.categoryLabel || "General",
        replies: 0,
        replyCount: 0,
        views: 1,
        viewCount: 1,
        lastActivity: "Just now",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: data.tags || [],
    };

    mockDiscussions.unshift(newDiscussion);

    // Also create the opening post (OP) for this discussion
    const opPost: Post = {
        id: `post-${newId}-op`,
        discussionId: newId,
        author: data.author,
        content: data.body,
        createdAt: new Date().toISOString(),
        replyToPostId: null,
        likes: 1,
    };
    mockPosts.push(opPost);

    // Increment discussion count on parent MegaThread
    if (parentMegaThread) {
        parentMegaThread.discussionCount += 1;
        parentMegaThread.updatedAt = new Date().toISOString();
    }

    return newDiscussion;
}

export function addMockPost(data: {
    discussionId: string;
    content: string;
    author: Author;
    replyToPostId: string | null;
}): Post {
    const newPost: Post = {
        id: `post-${Date.now()}`,
        discussionId: data.discussionId,
        author: data.author,
        content: data.content,
        createdAt: new Date().toISOString(),
        replyToPostId: data.replyToPostId,
        likes: 0,
    };

    mockPosts.push(newPost);

    // Update parent discussion replies & lastActivity
    const targetDisc = mockDiscussions.find((d) => d.id === data.discussionId);
    if (targetDisc) {
        targetDisc.replies = (targetDisc.replies || 0) + 1;
        targetDisc.replyCount = targetDisc.replies;
        targetDisc.lastActivity = "Just now";
        targetDisc.updatedAt = new Date().toISOString();
    }

    return newPost;
}

export function toggleMockLike(
    id: string,
    action?: "like" | "unlike"
): { likes: number; liked: boolean } {
    const post = mockPosts.find((p) => p.id === id);
    if (post) {
        if (action === "unlike") {
            post.likes = Math.max(0, (post.likes || 1) - 1);
            return { likes: post.likes, liked: false };
        } else {
            post.likes = (post.likes || 0) + 1;
            return { likes: post.likes, liked: true };
        }
    }
    const disc = mockDiscussions.find((d) => d.id === id);
    if (disc) {
        if (action === "unlike") {
            disc.likes = Math.max(0, (disc.likes || 1) - 1);
            return { likes: disc.likes, liked: false };
        } else {
            disc.likes = (disc.likes || 0) + 1;
            return { likes: disc.likes, liked: true };
        }
    }
    return { likes: 0, liked: false };
}

export function updateMockDiscussion(
    id: string,
    data: { title?: string; body?: string; categoryId?: string; tags?: string[] }
): Discussion | null {
    const disc = mockDiscussions.find((d) => d.id === id);
    if (!disc) return null;
    if (data.title) disc.title = data.title;
    if (data.body) {
        disc.body = data.body;
        disc.excerpt = data.body.length > 160 ? data.body.slice(0, 160) + "..." : data.body;
    }
    if (data.categoryId) {
        disc.category = data.categoryId;
        const cat = forumCategories.find((c) => c.id === data.categoryId);
        disc.categoryLabel = cat?.name || disc.categoryLabel;
    }
    if (data.tags) disc.tags = data.tags;
    disc.updatedAt = new Date().toISOString();

    // Update OP post if body changed
    if (data.body) {
        const op = mockPosts.find((p) => p.discussionId === id && !p.replyToPostId);
        if (op) {
            op.content = data.body;
            op.updatedAt = new Date().toISOString();
        }
    }
    return disc;
}

export function deleteMockDiscussion(id: string): boolean {
    const index = mockDiscussions.findIndex((d) => d.id === id);
    if (index === -1) return false;
    mockDiscussions.splice(index, 1);
    for (let i = mockPosts.length - 1; i >= 0; i--) {
        if (mockPosts[i].discussionId === id) {
            mockPosts.splice(i, 1);
        }
    }
    return true;
}

export function updateMockPost(id: string, content: string): Post | null {
    const post = mockPosts.find((p) => p.id === id);
    if (!post) return null;
    post.content = content;
    post.updatedAt = new Date().toISOString();
    return post;
}

export function deleteMockPost(id: string): boolean {
    const index = mockPosts.findIndex((p) => p.id === id);
    if (index === -1) return false;
    const post = mockPosts[index];
    mockPosts.splice(index, 1);

    mockPosts.forEach((p) => {
        if (p.replyToPostId === id) {
            p.replyToPostId = null;
        }
    });

    const disc = mockDiscussions.find((d) => d.id === post.discussionId);
    if (disc) {
        disc.replies = Math.max(0, (disc.replies || 1) - 1);
        disc.replyCount = disc.replies;
    }
    return true;
}

export const sampleReplies: ReplyData[] = [
    {
        id: "r1",
        author: { name: "Priya Menon", initials: "PM", bg: "#2D6A4F" },
        content: "Excellent framing. What is often overlooked is that Aryabhata was building on a tradition going back to the Vedanga Jyotisha (c. 1200 BCE), which already contained sophisticated cyclical astronomical calculations. The continuity and accumulation of Indian scientific thought across centuries is remarkable - it wasn't a series of isolated geniuses but an ongoing institutional and textual tradition.",
        timestamp: "3 hours ago",
        likes: 23,
        nested: [
            {
                id: "r1-1",
                author: { name: "Arjun Krishnaswamy", initials: "AK", bg: "#B85428" },
                content: "Exactly right - and Madhava of the Kerala School (14th c.) extended this further with his infinite power series for sine and cosine, which are essentially the foundations of calculus. The Yuktibhasa is a stunning mathematical text. The fact that this predates Newton and Leibniz by 300 years is not seriously disputed, yet it barely appears in standard histories of mathematics.",
                timestamp: "2 hours ago",
                likes: 18,
            },
        ],
    },
    {
        id: "r2",
        author: { name: "Rahul Krishnan", initials: "RK", bg: "#0F1C3F" },
        content: 'The transmission question is fascinating. Al-Khwarizmi\'s "Algoritmi de numero Indorum" (9th c. CE) is essentially a systematic account of Indian numerical methods - he explicitly credits Indian scholars. The decimal positional number system, including zero as a placeholder and arithmetic concept, reached Europe via the Arab world. The word "algorithm" is a Latinisation of al-Khwarizmi\'s name. We are all working in an intellectual tradition shaped by India, and most people have no idea.',
        timestamp: "4 hours ago",
        likes: 35,
        nested: [],
    },
    {
        id: "r3",
        author: { name: "Ananya Iyer", initials: "AI", bg: "#5C2D8A" },
        content: "The historiographical question matters a great deal. The history of science has been largely written through a Eurocentric lens that systematically under-represented and often ignored non-Western contributions. Decolonizing the history of science is not about nationalism - it's about accuracy. We owe it to the Aryabhatas, Brahmaguptas, and Ramanujanans to reconstruct a fuller and truer record.",
        timestamp: "6 hours ago",
        likes: 41,
        nested: [],
    },
];

export const knowledgeSystems: KnowledgeSystem[] = [
    {
        icon: <Star className="w-6 h-6" />,
        title: "Astronomy & Mathematics",
        items: [
            "Aryabhata - heliocentric model, zero",
            "Kerala School - infinite series, proto-calculus",
            "Brahmagupta - algebra, negative numbers",
        ],
        color: "#1D3557",
    },
    {
        icon: <Zap className="w-6 h-6" />,
        title: "Medicine & Life Sciences",
        items: [
            "Sushruta Samhita - 300+ surgical procedures",
            "Charaka Samhita - systematic internal medicine",
            "Ayurveda - holistic pharmacology",
        ],
        color: "#2D6A4F",
    },
    {
        icon: <Lightbulb className="w-6 h-6" />,
        title: "Philosophy & Logic",
        items: [
            "Nyaya - epistemology and formal debate",
            "Mimamsa - hermeneutics and interpretation",
            "Advaita Vedanta - non-dual metaphysics",
        ],
        color: "#5C2D8A",
    },
    {
        icon: <BookOpen className="w-6 h-6" />,
        title: "Literature & Language",
        items: [
            "Panini's Ashtadhyayi - first formal grammar",
            "Sanskrit - mother of Indo-European languages",
            "Tamil Sangam literature - 2,000-year tradition",
        ],
        color: "#8B4513",
    },
    {
        icon: <Globe className="w-6 h-6" />,
        title: "Architecture & Engineering",
        items: [
            "Indus Valley - grid-planned cities, sewage",
            "Dravidian & Nagara temple traditions",
            "Stepwells, aqueducts, and urban planning",
        ],
        color: "#B85428",
    },
    {
        icon: <Award className="w-6 h-6" />,
        title: "Music, Dance & Art",
        items: [
            "Natya Shastra - world's oldest performing arts text",
            "Hindustani & Carnatic classical systems",
            "Miniature painting, Madhubani, Warli traditions",
        ],
        color: "#C8971A",
    },
];

export const timeline: TimelineEvent[] = [
    { year: "2600 BCE", event: "Indus Valley Civilization", note: "Grid-planned cities with sewage systems at Harappa & Mohenjo-daro" },
    { year: "700 BCE", event: "Upanishads Composed", note: "The philosophical foundations of Vedanta and non-dualist thought" },
    { year: "500 BCE", event: "Sushruta & Charaka", note: "World's oldest systematic surgical and medical treatises" },
    { year: "321 BCE", event: "Maurya Empire", note: "Chandragupta unifies the subcontinent; Chanakya writes the Arthashastra" },
    { year: "499 CE", event: "Aryabhata's Discoveries", note: "Calculates Earth's rotation, eclipse mechanism, and value of π" },
    { year: "700 CE", event: "Nalanda at Its Height", note: "Ten thousand students from across Asia; nine million manuscripts" },
    { year: "1857", event: "First War of Independence", note: "Rani Lakshmibai, Mangal Pandey - the first organised national resistance" },
    { year: "1947", event: "Independence", note: "Nehru, Gandhi, Ambedkar - a free republic founded on a revolutionary Constitution" },
    { year: "1969", event: "ISRO Founded", note: "Vikram Sarabhai launches India's space program from a church in Kerala" },
    { year: "2023", event: "Chandrayaan-3", note: "India becomes the first nation to land on the Moon's south pole" },
];