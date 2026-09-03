import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_API_KEY as string, {
  apiVersion: "2026-08-26.dahlia",
});

const plan_Prices: Record<string, { amount: number; name: string }> = {
  starter: {
    amount: 900, // $9.00
    name: "MetaPulse - Starter Plan",
  },
  ultimate: {
    amount: 2900, // $29.00
    name: "MetaPulse - Ultimate Plan",
  },
};

export async function POST(req: Request) {
  try {
    const { planId } = await req.json();
    const selectPlanId = plan_Prices[planId];
    if (!selectPlanId) {
      return NextResponse.json(
        { error: "Invalid plan selected" },
        { status: 400 },
      );
    }

    const origin =
      req.headers.get("origin") ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      managed_payments: { enabled: false },
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: selectPlanId.name,
            },
            unit_amount: selectPlanId.amount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        planId: planId,
      },
      success_url: `${origin}/dashboard?payment=success`,
      cancel_url: `${origin}/pricing?payment=cancelled`,
    });
    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    console.error("Stripe Checkout Error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}