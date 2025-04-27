import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  useColorScheme,
} from "react-native";
import { Link, useSegments } from "expo-router";

import Colors from "@constants/Colors";
import { Tables } from "../types";
import RemoteImage from "./RemoteImage";

type ProductListItemProps = {
  product: Tables<"products">;
};

export const defaultPizzaImage =
  "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png";

const ProductListItem = ({ product }: ProductListItemProps) => {
  const segments = useSegments();
  const colorScheme = useColorScheme() || "dark";
  const backgroundColor = Colors[colorScheme].cardBackground;
  const textColor = Colors[colorScheme].text;
  const tintColor = Colors[colorScheme].tint;

  return (
    <Link href={`./menu/${product.id}`} asChild>
      <Pressable style={[styles.container, { backgroundColor }]}>
        <RemoteImage
          path={product.image}
          fallback={defaultPizzaImage}
          style={[styles.image, { backgroundColor: tintColor }]}
          resizeMode="contain"
        />

        <Text style={[styles.title, { color: textColor }]}>
          {" "}
          {product.name}{" "}
        </Text>
        <Text style={[styles.price, { color: tintColor }]}>
          {" "}
          ${product.price}{" "}
        </Text>
      </Pressable>
    </Link>
  );
};

export default ProductListItem;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 10,
    flex: 1,
    maxWidth: "50%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
  price: {
    fontSize: 13,
    fontWeight: "bold",
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    marginVertical: 10,
    borderRadius: 10,
  },
});
