import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

export const createOrRetrieveProfile = async (req: Request) => {
  const supabaseClient = createClient(
    Deno.env.get("EXPO_PUBLIC_SUPABASE_URL") ?? "",
    Deno.env.get("EXPO_PUBLIC_SUPABASE_ANON_KEY") ?? "",
    {
      global: {
        headers: { Authorization: req.headers.get("Authorization")! },
      },
    }
  );
  // Now we can get the session or user object
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  console.log(user);
  if (!user) throw new Error("No user found");
};
