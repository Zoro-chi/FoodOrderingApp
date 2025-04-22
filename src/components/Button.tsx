import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import Colors from "../constants/Colors";
import { forwardRef } from "react";

type ButtonProps = {
  text: string;
} & React.ComponentPropsWithoutRef<typeof Pressable>;

const Button = forwardRef<View | null, ButtonProps>(
  ({ text, style, ...pressableProps }, ref) => {
    const colorScheme = useColorScheme() || "dark";
    const tintColor = Colors[colorScheme].tint;

    return (
      <Pressable
        ref={ref}
        {...pressableProps}
        style={({ pressed }) => ({
          ...styles.container,
          backgroundColor: tintColor,
          opacity: pressed ? 0.9 : 1,
          ...(style as object),
        })}
      >
        <Text style={styles.text}>{text}</Text>
      </Pressable>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    padding: 15,
    alignItems: "center",
    borderRadius: 100,
    marginVertical: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});

export default Button;
