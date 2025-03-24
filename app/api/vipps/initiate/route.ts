import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import { v4 as uuidv4 } from "uuid";
import { NextRequest, NextResponse } from "next/server";

export default async function POST(req: NextRequest, res: NextResponse) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orderId = uuidv4();

  const body = await req.json();

  const payload = {
    customerInfo: {
      mobileNumber: req.body.mobileNumber || undefined,
    },
    merchantInfo: {
      merchantSerialNumber: process.env.VIPPS_MERCHANT_SERIAL_NO,
      callbackPrefix: process.env.VIPPS_CALLBACK_PREFIX,
      fallBack: process.env.VIPPS_FALLBACK_URL, // URL where donor is redirected after payment completes or cancels
    },
    transaction: {
      amount: body.amount, // donation amount in minor units (e.g. 5000 for 50 NOK)
      orderId,
      transactionText: body.transactionText || "Donation Payment",
    },
  };

  try {
    const response = await fetch(
      `${process.env.VIPPS_BASE_URL}/ecomm/v2/payments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.VIPPS_ACCESS_TOKEN}`,
          "Ocp-Apim-Subscription-Key":
            process.env.VIPPS_OCP_APIM_SUBSCRIPTION_KEY,
          "Merchant-Serial-Number": process.env.VIPPS_MERCHANT_SERIAL_NO,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errData = await response.json();
      return NextResponse.json({ error: errData }, { status: response.status });
    }

    const data = await response.json();

    // (TODO) Store the orderId and donation details in your database here.
    console.log("Storing donation order:", orderId);

    // Return the orderId and the redirect URL for the donor to complete payment.
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
}
