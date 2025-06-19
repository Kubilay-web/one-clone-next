import { NextResponse } from "next/server";
import db from "@/lib/db";
const paypal = require("@paypal/checkout-server-sdk");

// PayPal environment configuration
let clientId = process.env.PAYPAL_CLIENT_ID;
let clientSecret = process.env.PAYPAL_CLIENT_SECRET;

// Sandbox environment (for production, use LiveEnvironment)
let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
let client = new paypal.core.PayPalHttpClient(environment);

// Create a function to handle the PayPal order request
const createOrder = async (plan) => {
  // Construct a request object and set desired parameters
  let request = new paypal.orders.OrdersCreateRequest();
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        reference_id: plan.id,
        amount: {
          currency_code: "USD",
          value: plan.price.toString(), // PayPal expects value as a string
        },
      },
    ],
    application_context: {
      return_url: "http://localhost:3000/dashboard/company/success",
      cancel_url: "http://localhost:3000/dashboard/company/cancel",
    },
  });

  // Execute the PayPal order creation request and return the approval URL
  try {
    const response = await client.execute(request);
    console.log("PayPal Response =>", response); // Log the full response to debug

    // Check if response.result and response.result.links are defined
    if (
      response.result &&
      Array.isArray(response.result.links) &&
      response.result.links.length > 1
    ) {
      console.log("PayPal Order =>", response.result.links);
      return response.result.links[1].href; // Approval URL is usually at index 1
    } else {
      throw new Error("PayPal response does not contain valid links.");
    }
  } catch (err) {
    console.log("Error creating PayPal order =>", err);
    throw new Error(err.message);
  }
};

// Handle the POST request in the Next.js API route
export async function POST(req, context) {
  try {
    // Fetch the plan from the database using Prisma
    const plan = await db.plan.findUnique({
      where: { id: context.params.id },
    });

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" });
    }

    // Create PayPal order
    const approvalUrl = await createOrder(plan);

    // Return the approval URL to the client
    return NextResponse.json({ id: approvalUrl });
  } catch (err) {
    console.log("Error =>", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
