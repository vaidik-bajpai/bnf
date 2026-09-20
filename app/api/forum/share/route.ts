import { NextResponse } from "next/server";
import { recordShare } from "@/app/actions/forum";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { discussionId } = body;

        if (!discussionId) {
            return NextResponse.json({ error: "Missing discussionId" }, { status: 400 });
        }

        const result = await recordShare(discussionId);
        return NextResponse.json(result);
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to record share";
        const status = msg.includes("not found") ? 404 : 500;
        return NextResponse.json({ error: msg }, { status });
    }
}
