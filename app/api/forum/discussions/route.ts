import { NextResponse } from "next/server";
import {
    getDiscussions,
    createDiscussion,
    updateDiscussion,
    deleteDiscussion,
} from "@/app/actions/forum";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const search = searchParams.get("search") || undefined;
    const sortByParam = searchParams.get("sortBy");
    const sortBy = (sortByParam === "trending" || sortByParam === "pinned") ? sortByParam : "latest";

    try {
        const data = await getDiscussions({ categoryId, search, sortBy });
        return NextResponse.json(data);
    } catch {
        return NextResponse.json({ error: "Failed to fetch discussions" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = await createDiscussion(body);
        return NextResponse.json(result, { status: 201 });
    } catch {
        return NextResponse.json({ error: "Failed to create discussion" }, { status: 500 });
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
        return NextResponse.json({ error: msg }, { status: 500 });
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
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}