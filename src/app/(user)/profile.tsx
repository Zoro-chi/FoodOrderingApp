import { View, Text, StyleSheet, useColorScheme } from "react-native";
import { useState } from "react";

import { useAuth } from "@/providers/AuthProvider";
import Button from "@/components/Button";
import Colors from "@/constants/Colors";

const ProfileScreen = () => {
  const colorScheme = useColorScheme() || "light";
  const { profile, signOut } = useAuth();
  const [loading, setLoading] = useState(false);

  // Get theme colors
  const backgroundColor = Colors[colorScheme].background;
  const textColor = Colors[colorScheme].text;

  const handleSignOut = async () => {
    if (loading) return; // Prevent multiple sign-out attempts

    setLoading(true);
    try {
      console.log("Profile: Starting sign out process");
      await signOut();
      // Auth state changes will be handled by the provider
    } catch (error) {
      console.error("Error signing out:", error);
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: textColor }]}>User Profile</Text>

      {profile && (
        <View style={styles.profileInfo}>
          <Text style={[styles.infoText, { color: textColor }]}>
            Email: {profile.username}
          </Text>
        </View>
      )}

      <Button
        text={loading ? "Signing Out..." : "Sign Out"}
        onPress={handleSignOut}
        disabled={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  profileInfo: {
    marginBottom: 30,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default ProfileScreen;
