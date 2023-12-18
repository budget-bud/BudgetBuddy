import { registerActivity } from "@/utils/registerActivity";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    registerActivity("Categories page visited");

    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();
    if (userErr) {
      return NextResponse.json({ error: userErr.message }, { status: 500 });
    }

    const { data: categories, error } = await supabase
      .from("Categories")
      .select("*")
      .match({ user_id: user?.id });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const categoriesWithT = await Promise.all(
      categories?.map(async (category) => {
        const { data: transactions, error: transactionsError } = await supabase
          .from("Transactions")
          .select("movement")
          .eq("user_id", user?.id)
          .eq("category_id", category.id);

        const totalAmount = transactions?.reduce((acc, curr) => {
          return acc + curr.movement;
        }, 0);

        if (transactionsError) {
          return NextResponse.json(
            { error: transactionsError.message },
            { status: 500 },
          );
        }

        return { ...category, totalAmount };
      }) || [],
    );

    return NextResponse.json({ categories: categoriesWithT }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    registerActivity("Category created");

    const body = await req.json();
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const userId = user?.id;
    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 500 });
    }

    const { data: categories, error } = await supabase
      .from("Categories")
      .insert([
        {
          user_id: userId,
          title: body.title,
          description: body.description,
          type: body.type,
          limit: body.limit,
        },
      ])
      .select("*");

    const categoriesWithT = await Promise.all(
      categories?.map(async (category) => {
        const { data: transactions, error: transactionsError } = await supabase
          .from("Transactions")
          .select("movement")
          .eq("user_id", user?.id)
          .eq("category_id", category.id);

        const totalAmount = transactions?.reduce((acc, curr) => {
          return acc + curr.movement;
        }, 0);

        if (transactionsError) {
          return NextResponse.json(
            { error: transactionsError.message },
            { status: 500 },
          );
        }

        return { ...category, totalAmount };
      }) || [],
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ categories: categoriesWithT }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    registerActivity("Category updated");

    const body = await req.json();
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data: categories, error } = await supabase
      .from("Categories")
      .update({
        title: body.title,
        description: body.description,
        type: body.type,
        limit: body.limit,
      })
      .match({ id: body.id });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ categories }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  registerActivity("Category deleted");
  try {
    const body = await req.json();
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data: categories, error } = await supabase
      .from("Categories")
      .delete()
      .eq("id", body.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ categories }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
