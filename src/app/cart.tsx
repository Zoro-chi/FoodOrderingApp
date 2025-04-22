import { View, Text, Platform, FlatList, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";

import { useCart } from "@/providers/CartProvider";
import CartListItem from "@/components/CartListItem";
import Button from "@/components/Button";

const CartScreen = () => {
  const { items, totalPrice, checkout } = useCart();

  return (
    <View>
      <FlatList
        data={items}
        renderItem={({ item }) => <CartListItem cartItem={item} />}
        contentContainerStyle={{ padding: 10, gap: 10 }}
      />

      <Text style={styles.totalText}> Total: ${totalPrice} </Text>
      <View>
        <Button onPress={checkout} text="Checkout" />
      </View>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  totalText: {
    color: "#fff",
    fontSize: 20,
    marginTop: 20,
    fontWeight: "500",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
