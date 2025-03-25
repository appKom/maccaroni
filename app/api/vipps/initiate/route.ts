import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import { v4 as uuidv4 } from "uuid";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Generate a unique orderId (reference in ePayment) and read POST body
  const orderId = uuidv4();
  const body = await req.json();

  // Vipps ePayment expects an Amount object: { value, currency }
  // 'userFlow' controls how Vipps sends the user to the payment screen
  // 'returnUrl' is required when using WEB_REDIRECT
  // 'customer' is needed for PUSH_MESSAGE (optional if WEB_REDIRECT)
  const payload = {
    amount: {
      value: body.amount, // e.g. 5000 => 50.00 NOK
      currency: "NOK",
    },
    reference: orderId,
    paymentMethod: {
      type: "WALLET", // Typically "WALLET" for Vipps
    },
    userFlow: "WEB_REDIRECT",
    returnUrl: process.env.VIPPS_FALLBACK_URL,
    paymentDescription: body.transactionText || "Donation Payment",
    // If you need a push message or want to prefill the phone number:
    // customer: { phoneNumber: body.mobileNumber }
  };

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.VIPPS_ACCESS_TOKEN ?? ""}`,
    "Ocp-Apim-Subscription-Key": process.env.OCP_APIM_SUBSCRIPTION_KEY ?? "",
    "Merchant-Serial-Number": process.env.VIPPS_MERCHANT_SERIAL_NO ?? "",
    "Idempotency-Key": orderId, // Must be unique for each create-payment call
  };

  try {
    const response = await fetch(
      `${process.env.VIPPS_BASE_URL}/epayment/v1/payments`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errData = await response.json();
      console.error("Vipps error:", errData);
      return NextResponse.json({ error: errData }, { status: response.status });
    }

    const data = await response.json();
    console.log(
      "Payment created successfully, storing donation order:",
      orderId
    );

    return NextResponse.json(
      { orderId, redirectUrl: data.url },
      { status: 200 }
    );
  } catch (err) {
    console.error("Payment initiation error:", err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
};
