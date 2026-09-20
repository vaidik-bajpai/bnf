import { NextResponse } from "next/server";
import { createDiscussion } from "@/app/actions/forum";

export async function GET() {
    return NextResponse.json({
        service: "BHARAT-GANRAJYA Nationalists Front - n8n Ingestion Pipeline",
        status: "active",
        endpoint: "POST /api/forum/pipeline",
        format: "Array of discussion objects or single discussion object",
        schema: {
            title: "string (required)",
            body: "string (required, markdown/Devanagari supported)",
            image_url: "string (optional, preserved in DB without frontend rendering)",
            image_alt: "string (optional)",
            photographer: "string (optional)",
            photographer_url: "string (optional)",
            pexels_url: "string (optional)",
            categoryId: "string (optional, defaults to 'society' or relevant thematic anchor)",
            megaThreadId: "string (optional, auto-anchored)",
            tags: "string[] (optional, auto-generated if omitted)",
            authorId: "string (optional)",
        },
        samplePayload: [
            {
                title: "समुदाय के लिए महत्वपूर्ण जानकारी",
                body: "हाल ही में प्राप्त जानकारी के अनुसार...\n\n### मुख्य तथ्य\n\n- विवरण...",
                image_url: "https://images.pexels.com/photos/1325754/pexels-photo-1325754.jpeg",
                image_alt: "Smiling team members engaging in a positive office discussion.",
                photographer: "Jopwell",
                photographer_url: "https://www.pexels.com/@jopwell",
                pexels_url: "https://www.pexels.com/photo/man-sitting-on-office-chair-1325754/",
            },
        ],
    });
}

export async function POST(request: Request) {
    try {
        const payload = await request.json();
        const items = Array.isArray(payload) ? payload : [payload];

        if (items.length === 0) {
            return NextResponse.json({ error: "Empty payload array received from pipeline" }, { status: 400 });
        }

        const createdDiscussions = [];
        for (const item of items) {
            if (!item || !item.title || !item.body) {
                return NextResponse.json(
                    { error: "Each pipeline item must contain a 'title' and 'body'" },
                    { status: 400 }
                );
            }

            const discussion = await createDiscussion({
                title: item.title,
                body: item.body,
                excerpt: item.excerpt,
                categoryId: item.categoryId || item.category,
                megaThreadId: item.megaThreadId,
                tags: item.tags,
                authorId: item.authorId,
                image_url: item.image_url || item.imageUrl,
                image_alt: item.image_alt || item.imageAlt,
                photographer: item.photographer,
                photographer_url: item.photographer_url || item.photographerUrl,
                pexels_url: item.pexels_url || item.pexelsUrl,
            });

            createdDiscussions.push(discussion);
        }

        return NextResponse.json(
            {
                success: true,
                message: `Successfully processed and published ${createdDiscussions.length} thread${createdDiscussions.length > 1 ? "s" : ""
                    } from n8n pipeline`,
                count: createdDiscussions.length,
                discussions: createdDiscussions,
            },
            { status: 201 }
        );
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to process n8n pipeline payload";
        console.error("[n8n pipeline ingestion error]:", err);
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}
