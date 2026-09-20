// scripts/test-pipeline.ts
import { createDiscussion } from "../app/actions/forum";
import { prisma } from "../lib/prisma";

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

async function main() {
    console.log("🚀 Testing n8n pipeline ingestion...");
    console.log("📦 Ingesting payload:", JSON.stringify(n8nSamplePayload, null, 2));

    for (const item of n8nSamplePayload) {
        const created = await createDiscussion({
            title: item.title,
            body: item.body,
            imageUrl: item.image_url,
            imageAlt: item.image_alt,
            photographer: item.photographer,
            photographerUrl: item.photographer_url,
            pexelsUrl: item.pexels_url,
        });

        console.log("\n✅ Thread created successfully!");
        console.log("------------------------------------------");
        console.log(`📌 ID:             ${created.id}`);
        console.log(`📑 Title:          ${created.title}`);
        console.log(`🏛️  Category:       ${created.categoryLabel} (${created.category})`);
        console.log(`🧵 MegaThread:     ${created.megaThreadTitle || "Auto-anchored"}`);
        console.log(`🏷️  Tags:           ${created.tags.join(", ")}`);
        console.log(`🖼️  Image Saved:    ${created.imageUrl ? "Yes (Preserved in DB, hidden in UI)" : "No"}`);
        console.log("------------------------------------------");
        console.log("✨ You can now view this thread live in your browser on the Forum!");
    }
}

main()
    .catch((e) => {
        console.error("❌ Pipeline error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
