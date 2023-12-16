import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json(
      {
        name: "John Doe",
        //profileImage: "https://i.pravatar.cc/300",
        balance: 1000,
        chats: [
          {
            name: "Chat 1",
            id: "1",
          },
          {
            name: "Chat 2",
            id: "2",
          },
          {
            name: "Chat 3",
            id: "3",
          },
        ],
      },
      { status: 200 },
    );
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
