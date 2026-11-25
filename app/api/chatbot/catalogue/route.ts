import { NextRequest, NextResponse } from "next/server";
import {
    getCatalogue,
    getProjects,
    getService,
    getCaseStudies,
    getCaseStudy,
} from "@/utils/chatbot/catalogue";
export async function GET(request: NextRequest) {
    if (process.env.CHATBOT_ENABLED === "false")
        return NextResponse.json(
            { error: "Assistant disabled." },
            { status: 404 },
        );
    const service = request.nextUrl.searchParams.get("service");
    const group = request.nextUrl.searchParams.get("group");
    const caseStudy = request.nextUrl.searchParams.get("caseStudy");
    const caseStudies = request.nextUrl.searchParams.get("caseStudies") === "1";
    if (
        [service, group, caseStudy].some(
            (value) =>
                value !== null && !/^[a-z0-9][a-z0-9-]{0,120}$/i.test(value),
        )
    )
        return NextResponse.json(
            { error: "Invalid selection." },
            { status: 400 },
        );
    const data = caseStudy
        ? await getCaseStudy(caseStudy)
        : caseStudies
          ? await getCaseStudies()
          : service
            ? await getService(service)
            : group
              ? await getProjects(group)
              : await getCatalogue();
    if (!data)
        return NextResponse.json(
            { error: "This information is temporarily unavailable." },
            { status: 503 },
        );
    return NextResponse.json(data, {
        headers: { "Cache-Control": "public, max-age=60, s-maxage=300" },
    });
}
