import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import paypal from "@paypal/checkout-server-sdk";
import db from "@/lib/db";
import { validateRequest } from "@/auth";

// PayPal ortamı
let environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_SECRET_JOB,
);
let client = new paypal.core.PayPalHttpClient(environment);

export async function POST(req: Request) {
  // Kullanıcı doğrulaması
  const { user } = await validateRequest();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  // URL parametrelerini almak (token ve payerId)
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  const payerId = url.searchParams.get("PayerID");

  if (!token || !payerId) {
    return NextResponse.json(
      { error: "Token veya PayerID eksik!" },
      { status: 400 },
    );
  }

  try {
    // Ödeme onayını al
    const request = new paypal.orders.OrdersCaptureRequest(token);
    request.requestBody({});

    const response = await client.execute(request);

    if (response?.result?.status === "COMPLETED") {
      // Ödeme başarılıysa, referans ve ödeme bilgilerini al
      const reference = response.result.purchase_units[0].reference_id;
      const currencyCode =
        response.result.purchase_units[0].payments?.captures[0].amount
          ?.currency_code;
      const value =
        response.result.purchase_units[0].payments?.captures[0].amount?.value;

      // Veritabanından plan ve şirket bilgilerini al
      const plan = await db.plan.findUnique({ where: { id: reference } });
      const company = await db.company.findUnique({
        where: { userId: user.id },
      });

      if (!plan) {
        return NextResponse.json(
          { error: "Plan bulunamadı!" },
          { status: 404 },
        );
      }

      if (!company) {
        return NextResponse.json(
          { error: "Şirket bulunamadı!" },
          { status: 404 },
        );
      }

      // Ödeme bilgilerini veritabanına kaydet
      const order = await db.orderJob.create({
        data: {
          company_id: company.id,
          plan_id: plan.id,
          order_id: uuidv4(),
          payment_provider: "PayPal",
          amount: value,
          paid_in_currency: currencyCode,
          payment_status: "paid",
          transaction_id: reference,
        },
      });

      return NextResponse.json({
        message: "Transaction Completed Successfully",
        status: 200,
        orderId: order.id,
        reference,
      });
    }

    return NextResponse.json({
      message: "Transaction not completed",
      status: 500,
    });
  } catch (err) {
    console.error("Error processing the payment:", err);
    return NextResponse.json({
      message: "Error processing the payment",
      status: 500,
      error: err.message,
    });
  }
}
