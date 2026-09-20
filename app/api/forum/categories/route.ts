import { NextResponse } from "next/server";
import { getCategoriesAction } from "@/app/actions/forum";

export async function GET() {
    try {
        const categories = await getCategoriesAction();
        return NextResponse.json(categories);
    } catch {
        return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
    }
}
