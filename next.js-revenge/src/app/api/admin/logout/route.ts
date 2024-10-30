import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Cookieを削除してセッションをリセット
    return NextResponse.json({ message: "Logged out" }, {
      headers: {
        "Set-Cookie": "session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly"
      }
    });
  } catch (error) {
    console.error("Logout Error:", error);
    return NextResponse.json({ message: "Logout error" }, { status: 500 });
  }
}
