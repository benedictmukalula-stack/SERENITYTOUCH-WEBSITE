import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

export async function GET() {
  try {
    const services = await db.service.findMany({
      where: {
        active: true,
      },
      orderBy: {
        sortOrder: "asc",
      },
      include: {
        addons: {
          where: {
            active: true,
          },
          orderBy: {
            name: "asc",
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        services,
      },
      {
        headers: CORS_HEADERS,
      }
    );
  } catch (err) {
    console.error("[Services GET]", err);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to load services",
      },
      {
        status: 500,
        headers: CORS_HEADERS,
      }
    );
  }
}
