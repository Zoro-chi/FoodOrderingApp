import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";

import OrderListItem from "@/components/OrderListItem";
import OrderItemListItem from "@/components/OrderItemListitem";
import { useOrderDetails } from "@/api/orders";
import { useUpdateOrderSubscription } from "@/api/orders/subscriptions";

const OrderDetailsScreen = () => {
  const { id: idParam } = useLocalSearchParams();

  // Improved parsing to handle undefined or invalid values
  const id = idParam
    ? typeof idParam === "string"
      ? parseInt(idParam, 10)
      : parseInt(idParam[0], 10)
    : 0;

  const { product: order, isLoading, error } = useOrderDetails(id);

  useUpdateOrderSubscription(id);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return (
      <Text style={{ color: "red" }}>
        {error ? error.message : "Failed to load order details"}
      </Text>
    );
  }

  return (
    <View style={{ padding: 10, gap: 10, flex: 1 }}>
      <Stack.Screen options={{ title: `Order #${id}` }} />

      <FlatList
        data={order.order_items}
        renderItem={({ item }) => <OrderItemListItem item={item} />}
        contentContainerStyle={{ gap: 10 }}
        ListHeaderComponent={() => <OrderListItem order={order} />}
      />
    </View>
  );
};

export default OrderDetailsScreen;
