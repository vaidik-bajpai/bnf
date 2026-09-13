import { NextResponse } from "next/server";
import {
    postReply,
    updatePost,
    deletePost,
} from "@/app/actions/forum";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { discussionId, content, replyToPostId, authorId } = body;
        if (!discussionId || !content) {
            return NextResponse.json({ error: "Missing discussionId or content" }, { status: 400 });
        }
        const result = await postReply({
            discussionId,
            content,
            replyToPostId,
            authorId,
        });
        return NextResponse.json(result, { status: 201 });
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to post reply";
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, content, clientUserId } = body;
        if (!id || !content) {
            return NextResponse.json({ error: "Missing post ID or content" }, { status: 400 });
        }
        const result = await updatePost(id, { content }, clientUserId);
        return NextResponse.json(result);
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to update reply";
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        const clientUserId = searchParams.get("clientUserId") || undefined;
        if (!id) {
            return NextResponse.json({ error: "Missing post ID" }, { status: 400 });
        }
        const result = await deletePost(id, clientUserId);
        return NextResponse.json(result);
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to delete reply";
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}
