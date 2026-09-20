import { NextResponse } from "next/server";
import {
    getDiscussions,
    getThreadById,
    createDiscussion,
    updateDiscussion,
    deleteDiscussion,
} from "@/app/actions/forum";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const clientUserId = searchParams.get("clientUserId") || undefined;

    if (id) {
        try {
            const thread = await getThreadById(id, clientUserId);
            if (!thread) return NextResponse.json({ error: "Discussion not found" }, { status: 404 });
            return NextResponse.json(thread);
        } catch {
            return NextResponse.json({ error: "Failed to fetch discussion" }, { status: 500 });
        }
    }

    const categoryId = searchParams.get("categoryId");
    const megaThreadId = searchParams.get("megaThreadId");
    const search = searchParams.get("search") || undefined;
    const sortByParam = searchParams.get("sortBy");
    const sortBy = (sortByParam === "trending" || sortByParam === "pinned") ? sortByParam : "latest";

    try {
        const data = await getDiscussions({ categoryId, megaThreadId, search, sortBy });
        return NextResponse.json(data);
    } catch {
        return NextResponse.json({ error: "Failed to fetch discussions" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const payload = await request.json();
        const items = Array.isArray(payload) ? payload : [payload];

        if (items.length === 0) {
            return NextResponse.json({ error: "Empty payload array" }, { status: 400 });
        }

        const createdResults = [];
        for (const item of items) {
            if (!item || !item.title || !item.body) {
                return NextResponse.json({ error: "Missing title or body" }, { status: 400 });
            }
            const result = await createDiscussion(item);
            createdResults.push(result);
        }

        const responseData = Array.isArray(payload) ? createdResults : createdResults[0];
        return NextResponse.json(responseData, { status: 201 });
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to create discussion";
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, clientUserId, ...data } = body;
        if (!id) return NextResponse.json({ error: "Missing discussion ID" }, { status: 400 });
        const result = await updateDiscussion(id, data, clientUserId);
        return NextResponse.json(result);
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to update discussion";
        const status = msg.includes("Unauthorized") ? 403 : msg.includes("not found") ? 404 : 500;
        return NextResponse.json({ error: msg }, { status });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        const clientUserId = searchParams.get("clientUserId") || undefined;
        if (!id) return NextResponse.json({ error: "Missing discussion ID" }, { status: 400 });
        const result = await deleteDiscussion(id, clientUserId);
        return NextResponse.json(result);
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to delete discussion";
        const status = msg.includes("Unauthorized") ? 403 : msg.includes("not found") ? 404 : 500;
        return NextResponse.json({ error: msg }, { status });
    }
}