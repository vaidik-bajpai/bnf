// app/api/forum/discussions/route.ts
import { NextResponse } from "next/server";
import { getDiscussions, createDiscussion } from "@/app/actions/forum";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const search = searchParams.get("search") || undefined;
    const sortBy = (searchParams.get("sortBy") as any) || "latest";

    try {
        const data = await getDiscussions({ categoryId, search, sortBy });
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch discussions" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = await createDiscussion(body);
        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create discussion" }, { status: 500 });
    }
}