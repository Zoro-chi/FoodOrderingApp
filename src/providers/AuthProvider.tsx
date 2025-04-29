import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";

type AuthData = {
  session: Session | null;
  profile: any;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthData>({
  session: null,
  loading: true,
  profile: null,
  isAdmin: false,
  signOut: async () => {},
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  type Profile = {
    avatar_url: string | null;
    full_name: string | null;
    group: string;
    id: string;
    updated_at: string | null;
    username: string | null;
    website: string | null;
  };

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Add refs to prevent state updates after unmounting and concurrent auth operations
  const isMounted = useRef(true);
  const isProcessingAuth = useRef(false);

  // Centralized sign-out function
  const signOut = useCallback(async () => {
    try {
      console.log("Starting centralized sign-out process");
      await supabase.auth.signOut();
      // Auth state change listener will handle the rest
    } catch (error) {
      console.error("Error in centralized sign-out:", error);
    }
  }, []);

  // Separate profile fetching function
  const fetchProfile = useCallback(async (userSession: Session | null) => {
    if (!userSession) {
      if (isMounted.current) setProfile(null);
      return;
    }

    try {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userSession.user.id)
        .single();

      if (isMounted.current) setProfile(data || null);
    } catch (error) {
      console.error("Error fetching profile:", error);
      if (isMounted.current) setProfile(null);
    }
  }, []);

  useEffect(() => {
    // Set mounted flag
    isMounted.current = true;

    const fetchSession = async () => {
      if (isProcessingAuth.current) return;

      try {
        isProcessingAuth.current = true;

        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Error fetching session:", error);
        } else if (isMounted.current) {
          console.log("Initial session fetch complete");
          setSession(session);

          // Only fetch profile if we have a session
          if (session) {
            await fetchProfile(session);
          }
        }
      } catch (error) {
        console.error("Unexpected error in fetchSession:", error);
      } finally {
        isProcessingAuth.current = false;
        if (isMounted.current) setLoading(false);
      }
    };

    fetchSession();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth state changed:", event);

        // Handle the auth state change asynchronously
        if (isProcessingAuth.current) {
          console.log("Skipping concurrent auth state change:", event);
          return;
        }

        try {
          isProcessingAuth.current = true;

          if (isMounted.current) {
            console.log(`Processing auth state change: ${event}`);

            // Update session state
            setSession(newSession);

            // Handle profile state based on event type
            if (event === "SIGNED_OUT") {
              setProfile(null);
            } else if (
              newSession &&
              (event === "SIGNED_IN" || event === "TOKEN_REFRESHED")
            ) {
              await fetchProfile(newSession);
            }
          }
        } finally {
          isProcessingAuth.current = false;
        }
      }
    );

    // Clean up on unmount
    return () => {
      isMounted.current = false;

      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [fetchProfile]);

  return (
    <AuthContext.Provider
      value={{
        session,
        loading,
        profile,
        isAdmin: profile?.group === "ADMIN",
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
