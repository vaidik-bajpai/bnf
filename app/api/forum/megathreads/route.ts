import { NextResponse } from "next/server";
import {
    getMegaThreadsAction,
    getMegaThreadByIdAction,
} from "@/app/actions/forum";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
        try {
            const thread = await getMegaThreadByIdAction(id);
            if (!thread) return NextResponse.json({ error: "MegaThread not found" }, { status: 404 });
            return NextResponse.json(thread);
        } catch {
            return NextResponse.json({ error: "Failed to fetch megathread" }, { status: 500 });
        }
    }

    try {
        const list = await getMegaThreadsAction();
        return NextResponse.json(list);
    } catch {
        return NextResponse.json({ error: "Failed to fetch megathreads" }, { status: 500 });
    }
}
