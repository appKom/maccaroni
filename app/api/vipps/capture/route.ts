import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/authOptions";

export const POST = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId, amount, transactionText } = await req.json();

  const payload = {
    merchantInfo: {
      merchantSerialNumber: process.env.VIPPS_MERCHANT_SERIAL_NO,
    },
    transaction: {
      amount, // amount in minor units; for full capture you could omit or send null
      transactionText: transactionText || "Donation Capture",
    },
  };

  try {
    const response = await fetch(
      `${process.env.VIPPS_BASE_URL}/ecomm/v2/payments/${orderId}/capture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.VIPPS_ACCESS_TOKEN ?? ""}`,
          "Merchant-Serial-Number": process.env.VIPPS_MERCHANT_SERIAL_NO ?? "",
          "X-Request-Id": orderId,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errData = await response.json();
      return NextResponse.json({ error: errData }, { status: response.status });
    }

    const data = await response.json();

    // (TODO) Update your database record for orderId with the captured payment details.
    console.log("Payment captured for order:", orderId);

    return NextResponse.json(
      { orderId, redirectUrl: data.url },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
};
