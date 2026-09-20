import { NextResponse } from "next/server";
import { getForumStatsAction } from "@/app/actions/forum";

export async function GET() {
    try {
        const stats = await getForumStatsAction();
        return NextResponse.json(stats);
    } catch {
        return NextResponse.json({ error: "Failed to fetch forum stats" }, { status: 500 });
    }
}
