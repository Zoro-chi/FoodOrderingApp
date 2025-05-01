import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { stripe } from "./stripe.ts";

export const createOrRetrieveProfile = async (req: Request) => {
  try {
    // Get authorization header
    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      console.log("No Authorization header found in request");
      return null; // Return null instead of throwing to allow anonymous access for payments
    }

    // Use the project URL from environment variables (prefer SUPABASE_URL over EXPO versions)
    const supabaseUrl =
      Deno.env.get("SUPABASE_URL") ||
      Deno.env.get("EXPO_PUBLIC_SUPABASE_URL") ||
      "";
    const supabaseKey =
      Deno.env.get("SUPABASE_ANON_KEY") ||
      Deno.env.get("EXPO_PUBLIC_SUPABASE_ANON_KEY") ||
      "";

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase environment variables");
      return null;
    }

    console.log("Creating Supabase client with URL:", supabaseUrl);

    const supabaseClient = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: { Authorization: authHeader },
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Get user info
    const { data, error: userError } = await supabaseClient.auth.getUser();

    if (userError) {
      console.error("Error getting user:", userError.message);
      return null;
    }

    const { user } = data;

    console.log("User retrieved:", user || "No user");

    if (!user) {
      console.log("No user found despite valid authorization");
      return null;
    }

    const { data: profile, error: queryError } = await supabaseClient
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (queryError || !profile) {
      console.error(
        "Error fetching profile:",
        queryError?.message || "No profile"
      );
      throw new Error("Profile not found");
    }

    console.log("Profile retrieved:", profile);

    if (profile.stripe_customer_id) {
      return profile.stripe_customer_id;
    }

    // Create a new Stripe customer if none exists
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: {
        uid: user.id,
      },
    });
    console.log("Customer: ", customer);

    await supabaseClient
      .from("profiles")
      .update({ stripe_customer_id: customer.id })
      .eq("id", profile.id);

    return customer.id;
  } catch (error) {
    console.error("Error in createOrRetrieveProfile:", error);
    // For payment processing, we might want to continue even without a user
    return null;
  }
};
