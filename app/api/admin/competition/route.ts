import { createClient } from "@supabase/supabase-js";
import { prisma } from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

async function checkAuth() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.isAdmin) {
    return false;
  }

  return true;
}

export async function POST(req: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { title, description, time, image } = await req.json();

    if (!title || !description || !time || !image) {
      console.error("Missing required fields");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (typeof image !== "string" || !image.includes("base64")) {
      console.error("Invalid image format. Expected base64 string.");
      return NextResponse.json(
        { error: "Invalid image format. Expected base64 string." },
        { status: 400 }
      );
    }

    const base64Data = image.split(",")[1];
    if (!base64Data) {
      console.error("Invalid base64 image format");
      return NextResponse.json(
        { error: "Invalid base64 image format" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(base64Data, "base64");
    const filename = `competition-${Date.now()}.png`;

    const { error: uploadError } = await supabase.storage
      .from("competitions")
      .upload(filename, buffer, {
        contentType: "image/png",
      });

    if (uploadError) {
      console.error("Failed to upload image:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload image: " + uploadError.message },
        { status: 500 }
      );
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("competitions").getPublicUrl(filename);

    if (!publicUrl) {
      console.error("Failed to get public URL");
      return NextResponse.json(
        { error: "Failed to get public URL" },
        { status: 500 }
      );
    }

    const competition = await prisma.competition.create({
      data: {
        title,
        description,
        time: new Date(time),
        image: publicUrl,
      },
    });

    return NextResponse.json(competition, { status: 200 });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json(
      {
        error:
          "Internal Server Error: " +
          (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { id, title, description, time, image } = await req.json();

    if (!id || !title || !description || !time) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {
      title,
      description,
      time: new Date(time),
    };

    if (image && typeof image === "string" && image.includes("base64")) {
      const base64Data = image.split(",")[1];
      const buffer = Buffer.from(base64Data, "base64");
      const filename = `competition-${Date.now()}.png`;

      const { error: uploadError } = await supabase.storage
        .from("competitions")
        .upload(filename, buffer, {
          contentType: "image/png",
        });

      if (uploadError) {
        console.error("Failed to upload image:", uploadError);
        return NextResponse.json(
          { error: "Failed to upload image: " + uploadError.message },
          { status: 500 }
        );
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("competitions").getPublicUrl(filename);

      updateData.image = publicUrl;
    } else if (image) {
      updateData.image = image;
    }

    const competition = await prisma.competition.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(competition, { status: 200 });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json(
      {
        error:
          "Internal Server Error: " +
          (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Missing competition ID" },
        { status: 400 }
      );
    }

    const competition = await prisma.competition.findUnique({
      where: { id },
    });

    if (competition?.image) {
      const url = new URL(competition.image);
      const pathParts = url.pathname.split("/");
      const filename = pathParts[pathParts.length - 1];

      if (filename) {
        await supabase.storage.from("competitions").remove([filename]);
      }
    }

    await prisma.competition.delete({
      where: { id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json(
      {
        error:
          "Internal Server Error: " +
          (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 }
    );
  }
}
