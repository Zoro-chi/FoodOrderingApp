// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { stripe } from "../_utils/stripe.ts";
import { createOrRetrieveProfile } from "../_utils/supabase.ts";

console.log("Payment sheet function called");

// Get environment variables for Stripe configuration
const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
const stripePublishableKey =
  Deno.env.get("STRIPE_PUBLISHABLE_KEY") ||
  Deno.env.get("EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY");

// Print all environment variables for debugging
console.log(
  "Available environment variables:",
  Object.keys(Deno.env.toObject())
);

if (!stripeSecretKey) {
  console.error("STRIPE_SECRET_KEY is not set in environment variables");
}

if (!stripePublishableKey) {
  console.error("No publishable key found in environment variables");
}

Deno.serve(async (req: Request) => {
  try {
    console.log(`Request method: ${req.method}`);

    // Check if CORS preflight request
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Parse request body
    const body = await req.json().catch((err) => {
      console.error("Error parsing request body:", err);
      return {};
    });

    console.log("Received request body:", body);
    const { amount } = body;

    if (!amount || typeof amount !== "number") {
      console.error("Invalid amount:", amount);
      return new Response(
        JSON.stringify({ error: "Invalid amount provided" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Create or retrieve user profile
    const user = await createOrRetrieveProfile(req);
    if (user) {
      console.log("User found:", user.id);
      // You could associate the payment with the user here if needed
    } else {
      console.log("Processing payment without authenticated user");
    }

    console.log(`Creating payment intent for amount: ${amount}`);

    // Create an ephermeralKey so that the Stripe SDK can fetch the customer's stored payment methods.
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: user },
      { apiVersion: "2020-08-27" }
    );

    // Check if Stripe is properly initialized
    if (!stripeSecretKey) {
      console.error(
        "Cannot create payment intent: STRIPE_SECRET_KEY is not set"
      );
      return new Response(
        JSON.stringify({
          error: "Stripe configuration error",
          details: "Secret key missing",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Create payment intent with error handling
    let paymentIntent;
    try {
      paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        customer: user,
      });
      console.log("Payment intent created:", paymentIntent.id);
    } catch (stripeError: any) {
      console.error("Stripe API error:", stripeError);
      return new Response(
        JSON.stringify({
          error: "Failed to create payment intent",
          details: stripeError.message || "Stripe API error",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (!stripePublishableKey) {
      console.error("Publishable key not found in environment");
      return new Response(
        JSON.stringify({
          error: "Server configuration error",
          details: "Publishable key missing",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const res = {
      paymentIntent: paymentIntent.client_secret,
      publishableKey: stripePublishableKey,
      customer: user,
      ephemeralKey: ephemeralKey.secret,
    };

    console.log("Response payload:", {
      paymentIntent: paymentIntent.client_secret ? "exists" : "missing",
      publishableKey: stripePublishableKey ? "exists" : "missing",
    });

    return new Response(JSON.stringify(res), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error: any) {
    console.error("Error creating payment intent:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to create payment intent",
        details: error.message || "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});
