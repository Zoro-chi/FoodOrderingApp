import { supabase } from "@/lib/supabase";
import { View, Text, StyleSheet, useColorScheme } from "react-native";
import { useState } from "react";

import Colors from "@/constants/Colors";
import Button from "@/components/Button";
import { useAuth } from "@/providers/AuthProvider";

const ProfileScreen = () => {
  const colorScheme = useColorScheme() || "dark";
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);

  // Get theme colors
  const backgroundColor = Colors[colorScheme].background;
  const textColor = Colors[colorScheme].text;

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <Text>User Profile</Text>

      <Button
        text={loading ? "Signing Out..." : "Sign Out"}
        onPress={handleSignOut}
        disabled={loading}
      />
    </View>
  );
};

export default ProfileScreen;
