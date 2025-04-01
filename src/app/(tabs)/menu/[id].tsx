import { useState } from "react";
import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";

import products from "@assets/data/products";
import { defaultPizzaImage } from "@/components/ProductListItem";
import Button from "@/components/Button";

const sizes = ["S", "M", "L", "XL"];

const ProductDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  const [selectedSize, setSelectedSize] = useState("M");
  const product = products.find((product) => product.id.toString() === id);

  const addToCart = () => {
    console.warn("Adding to cart, size: ", selectedSize);
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

      <Button text="Add to cart" onPress={addToCart} />
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
