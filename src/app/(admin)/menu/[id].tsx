import { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import { useLocalSearchParams, Stack, useRouter, Link } from "expo-router";

import { defaultPizzaImage } from "@/components/ProductListItem";
import { useCart } from "@/providers/CartProvider";
import { PizzaSize } from "@/types";
import Colors from "@/constants/Colors";
import { useProduct } from "@/api/products";

const ProductDetailsScreen = () => {
  const { id: idParam } = useLocalSearchParams();
  const colorScheme = useColorScheme() || "dark";

  // Improved parsing to handle undefined or invalid values
  const id = idParam
    ? typeof idParam === "string"
      ? parseInt(idParam, 10)
      : parseInt(idParam[0], 10)
    : 0;

  const { product, error, isLoading } = useProduct(id);

  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState<PizzaSize>("M");

  const { onAddItem } = useCart();

  const backgroundColor = Colors[colorScheme].background;
  const textColor = Colors[colorScheme].text;
  const tintColor = Colors[colorScheme].tint;

  const addToCart = () => {
    if (!product) {
      console.error("Product not found");
      return;
    }

    onAddItem(product, selectedSize);
    router.push("/cart");
  };

  if (isLoading) {
    return <ActivityIndicator color={tintColor} />;
  }

  if (error || !id) {
    return (
      <Text style={{ color: "red" }}>
        {error ? error.message : "Invalid product ID"}
      </Text>
    );
  }

  if (!product) {
    return <Text style={{ color: "red" }}>Product not found</Text>;
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Stack.Screen
        options={{
          title: product.name,
          headerRight: () => (
            <Link href={`/(admin)/menu/create?id=${id}`} asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="pencil"
                    size={20}
                    color={tintColor}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />

      <Image
        source={{ uri: product.image || defaultPizzaImage }}
        style={styles.image}
      />

      <Text style={[styles.title, { color: textColor }]}> {product.name} </Text>
      <Text style={[styles.price, { color: textColor }]}>
        {" "}
        ${product.price}{" "}
      </Text>
    </View>
  );
};

export default ProductDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },
  image: {
    width: "100%",
    aspectRatio: 1,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
});
