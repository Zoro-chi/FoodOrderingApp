import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";

import orders from "@assets/data/orders";
import OrderListItem from "@/components/OrderListItem";

const OrdersScreen = () => {
  return (
    <FlatList
      data={orders}
      renderItem={({ item }) => <OrderListItem order={item} />}
      contentContainerStyle={{ padding: 10, gap: 10 }}
    />
  );
};

export default OrdersScreen;

const styles = StyleSheet.create({});
