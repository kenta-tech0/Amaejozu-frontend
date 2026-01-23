import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL || "http://localhost:8000";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader) {
      return NextResponse.json(
        { detail: "認証が必要です" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const response = await fetch(`${API_URL}/api/watchlist/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: authHeader,
      },
    });

    // DELETEの場合、204 No Content の可能性があるのでチェック
    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Delete from watchlist error:", error);
    return NextResponse.json(
      { detail: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}
