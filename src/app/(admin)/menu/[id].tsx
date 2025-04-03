import { useState } from "react";
import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";

import products from "@assets/data/products";
import { defaultPizzaImage } from "@/components/ProductListItem";
import Button from "@/components/Button";
import { useCart } from "@/providers/CartProvider";
import { PizzaSize } from "@/types";

const ProductDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState<PizzaSize>("M");
  const product = products.find((product) => product.id.toString() === id);
  const { onAddItem } = useCart();

  const addToCart = () => {
    if (!product) {
      console.error("Product not found");
      return;
    }

    onAddItem(product, selectedSize);
    router.push("/cart");
  };

  if (!product) {
    return (
      <View>
        <Text>Product not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: product.name,
        }}
      />

      <Image
        source={{ uri: product.image || defaultPizzaImage }}
        style={styles.image}
      />

      <Text style={styles.title}> {product.name} </Text>
      <Text style={styles.price}> ${product.price} </Text>
    </View>
  );
};

export default ProductDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: "#fff",
    padding: 10,
    // alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    aspectRatio: 1,
  },
  price: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
});
