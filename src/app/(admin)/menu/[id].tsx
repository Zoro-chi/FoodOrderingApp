import { useState } from "react";
import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";

import products from "@assets/data/products";
import { defaultPizzaImage } from "@/components/ProductListItem";
import Button from "@/components/Button";
import { useCart } from "@/providers/CartProvider";
import { PizzaSize } from "@/types";

const sizes: PizzaSize[] = ["S", "M", "L", "XL"];

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

      <Text> Select your size: </Text>
      <View style={styles.sizes}>
        {sizes.map((size) => (
          <Pressable
            key={size}
            style={[
              styles.size,
              { backgroundColor: size === selectedSize ? "gainsboro" : "#000" },
            ]}
            onPress={() => setSelectedSize(size)}
          >
            <Text
              style={[
                styles.sizeText,
                { color: size === selectedSize ? "white" : "gray" },
              ]}
            >
              {size}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.price}> ${product.price} </Text>

      <Button onPress={addToCart} text="Add to cart" />
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
    marginTop: "auto",
  },
  sizes: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  size: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "gainsboro",
    padding: 10,
    width: 50,
    aspectRatio: 1,
    borderRadius: 25,
  },
  sizeText: {
    fontSize: 20,
    fontWeight: "500",
    color: "#fff",
  },
});
