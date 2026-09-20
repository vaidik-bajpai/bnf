import { NextResponse } from "next/server";
import { toggleBookmark, getUserBookmarks } from "@/app/actions/forum";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const clientUserId = searchParams.get("clientUserId") || undefined;
        const bookmarks = await getUserBookmarks(clientUserId);
        return NextResponse.json(bookmarks);
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to fetch bookmarks";
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { discussionId, clientUserId } = body;

        if (!discussionId) {
            return NextResponse.json({ error: "Missing discussionId" }, { status: 400 });
        }

        const result = await toggleBookmark(discussionId, clientUserId);
        return NextResponse.json(result);
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to toggle bookmark";
        const status = msg.includes("not found") ? 404 : 500;
        return NextResponse.json({ error: msg }, { status });
    }
}
