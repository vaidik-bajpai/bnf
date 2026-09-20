import { NextResponse } from "next/server";
import { toggleLike } from "@/app/actions/forum";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { targetType, targetId, action, clientUserId } = body;

        if (!targetType || !targetId) {
            return NextResponse.json(
                { error: "Missing targetType ('post' | 'discussion') or targetId" },
                { status: 400 }
            );
        }

        if (targetType !== "post" && targetType !== "discussion") {
            return NextResponse.json(
                { error: "targetType must be 'post' or 'discussion'" },
                { status: 400 }
            );
        }

        const result = await toggleLike(
            targetType,
            targetId,
            action === "unlike" ? "unlike" : "like",
            clientUserId
        );

        return NextResponse.json(result);
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to process like";
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}
