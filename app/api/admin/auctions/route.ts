import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

export const POST = async (req: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.isAdmin) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { name, description, minimumIncrease, startPrice, image } =
      await req.json();

    if (!name || !description || !minimumIncrease || !startPrice) {
      console.error("Missing auction item");
      return NextResponse.json(
        { error: "Missing auction item" },
        { status: 400 }
      );
    }

    let imageHref = null;

    if (image) {
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
        .from("auctions")
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
      } = supabase.storage.from("auctions").getPublicUrl(filename);

      imageHref = publicUrl;

      if (!publicUrl) {
        console.error("Failed to get public URL");
        return NextResponse.json(
          { error: "Failed to get public URL" },
          { status: 500 }
        );
      }
    }

    await prisma.auction.create({
      data: {
        name,
        description,
        minimumIncrease,
        startPrice,
        image: imageHref ?? null,
      },
    });

    revalidatePath("/");
    revalidatePath("/auksjon");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
};

export const PUT = async (req: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.isAdmin) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id, name, description, minimumIncrease, startPrice, image } =
      await req.json();

    if (!id || !name || !description || !minimumIncrease || !startPrice) {
      console.error("Missing auction item");
      return NextResponse.json(
        { error: "Missing auction item" },
        { status: 400 }
      );
    }

    const currentAuction = await prisma.auction.findUnique({
      where: { id: id as string },
    });

    if (!currentAuction) {
      console.error("Auction item not found");
      return NextResponse.json(
        { error: "Auction item not found" },
        { status: 404 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {
      name,
      description,
      minimumIncrease,
      startPrice,
    };

    if (image === null && currentAuction.image) {
      try {
        const url = new URL(currentAuction.image);
        const pathParts = url.pathname.split("/");
        const filename = pathParts[pathParts.length - 1];

        if (filename) {
          const { error: deleteError } = await supabase.storage
            .from("auctions")
            .remove([filename]);

          if (deleteError) {
            console.error("Failed to delete image:", deleteError);
          }
        }
      } catch (error) {
        console.error("Error parsing image URL:", error);
      }

      updateData.image = null;
    } else if (image && typeof image === "string" && image.includes("base64")) {
      const base64Data = image.split(",")[1];
      const buffer = Buffer.from(base64Data, "base64");
      const filename = `competition-${Date.now()}.png`;

      const { error: uploadError } = await supabase.storage
        .from("auctions")
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
      } = supabase.storage.from("auctions").getPublicUrl(filename);

      updateData.image = publicUrl;

      if (currentAuction.image) {
        try {
          const url = new URL(currentAuction.image);
          const pathParts = url.pathname.split("/");
          const filename = pathParts[pathParts.length - 1];

          if (filename) {
            await supabase.storage.from("auctions").remove([filename]);
          }
        } catch (error) {
          console.error("Error deleting old image:", error);
        }
      }
    } else if (image) {
      updateData.image = image;
    }

    await prisma.auction.update({
      where: { id: id },
      data: updateData,
    });

    revalidatePath("/");
    revalidatePath("/auksjon");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.isAdmin) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const id = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Missing auction ID" },
        { status: 400 }
      );
    }

    await prisma.auction.delete({
      where: { id: id as string },
    });

    await prisma.bid.deleteMany({
      where: { auctionId: id as string },
    });

    await prisma.collected.deleteMany({
      where: { auctionId: id as string },
    });

    revalidatePath("/");
    revalidatePath("/auksjon");

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
};
