import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useMemo } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@components/useColorScheme";
import CartProvider from "@/providers/CartProvider";
import AuthProvider from "@/providers/AuthProvider";
import QueryProvider from "@/providers/QueryProvider";
import Colors from "@/constants/Colors";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  // Use your enhanced useColorScheme hook
  const colorScheme = useColorScheme();

  // Memoize theme objects to prevent unnecessary re-renders
  const customLightTheme = useMemo(
    () => ({
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        background: Colors.light.background,
        text: Colors.light.text,
        card: Colors.light.cardBackground,
        primary: Colors.light.tint,
        border: Colors.light.border,
      },
    }),
    []
  );

  const customDarkTheme = useMemo(
    () => ({
      ...DarkTheme,
      colors: {
        ...DarkTheme.colors,
        background: Colors.dark.background,
        text: Colors.dark.text,
        card: Colors.dark.cardBackground,
        primary: Colors.dark.tint,
        border: Colors.dark.border,
      },
    }),
    []
  );

  // Memoize the current theme based on colorScheme
  const currentTheme = useMemo(
    () => (colorScheme === "dark" ? customDarkTheme : customLightTheme),
    [colorScheme, customDarkTheme, customLightTheme]
  );

  return (
    <ThemeProvider value={currentTheme}>
      <AuthProvider>
        <QueryProvider>
          <CartProvider>
            <Stack
              screenOptions={{
                headerStyle: {
                  backgroundColor:
                    colorScheme === "dark"
                      ? Colors.dark.headerBackground
                      : Colors.light.headerBackground,
                },
                headerTintColor:
                  colorScheme === "dark" ? Colors.dark.text : Colors.light.text,
                contentStyle: {
                  backgroundColor:
                    colorScheme === "dark"
                      ? Colors.dark.background
                      : Colors.light.background,
                },
              }}
            >
              <Stack.Screen name="(user)" options={{ headerShown: false }} />
              <Stack.Screen name="(admin)" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen
                name="cart"
                options={{
                  presentation: "modal",
                  headerStyle: {
                    backgroundColor:
                      colorScheme === "dark"
                        ? Colors.dark.headerBackground
                        : Colors.light.headerBackground,
                  },
                  headerTintColor:
                    colorScheme === "dark"
                      ? Colors.dark.text
                      : Colors.light.text,
                }}
              />
            </Stack>
          </CartProvider>
        </QueryProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
