import { NextResponse } from "next/server";
import { createReport, getReports } from "@/app/actions/forum";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status") || undefined;
        const reports = await getReports(status);
        return NextResponse.json(reports);
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to fetch reports";
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { discussionId, postId, reason, details, clientUserId } = body;

        if (!discussionId && !postId) {
            return NextResponse.json(
                { error: "Missing target: either discussionId or postId must be provided" },
                { status: 400 }
            );
        }

        if (!reason || typeof reason !== "string" || !reason.trim()) {
            return NextResponse.json(
                { error: "Missing or empty report reason" },
                { status: 400 }
            );
        }

        const result = await createReport(
            { discussionId, postId, reason, details },
            clientUserId
        );

        return NextResponse.json(result, { status: 201 });
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to create report";
        const status = msg.includes("not found") ? 404 : 500;
        return NextResponse.json({ error: msg }, { status });
    }
}
