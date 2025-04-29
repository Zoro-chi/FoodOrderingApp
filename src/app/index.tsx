import { View, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import Button from "../components/Button";
import { Link, Redirect } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";

const index = () => {
  const { session, loading, isAdmin, signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  if (loading) {
    return <ActivityIndicator />;
  }

  if (!session) {
    return <Redirect href={"/sign-in"} />;
  }

  if (!isAdmin) {
    return <Redirect href={"/(user)"} />;
  }

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      // Auth changes will be handled by the provider
    } catch (error) {
      console.error("Error signing out:", error);
      setIsSigningOut(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 10 }}>
      <Link href={"/(user)"} asChild>
        <Button text="User" />
      </Link>
      <Link href={"/(admin)"} asChild>
        <Button text="Admin" />
      </Link>

      <Button
        onPress={handleSignOut}
        text={isSigningOut ? "Signing out..." : "Sign out"}
        disabled={isSigningOut}
      />
    </View>
  );
};

export default index;
