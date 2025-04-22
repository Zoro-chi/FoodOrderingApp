import {
  useColorScheme as useNativeColorScheme,
  Appearance,
} from "react-native";
import { useEffect, useState } from "react";

export function useColorScheme() {
  const [colorScheme, setColorScheme] = useState(
    Appearance.getColorScheme() || "dark"
  );

  useEffect(() => {
    const subscription = Appearance.addChangeListener(
      ({ colorScheme: newColorScheme }) => {
        setColorScheme(newColorScheme || "dark");
      }
    );

    return () => subscription.remove();
  }, []);

  return colorScheme;
}
