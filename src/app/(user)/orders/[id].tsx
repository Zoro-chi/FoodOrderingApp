import { View, Text, FlatList } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import orders from "@assets/data/orders";
import OrderListItem from "@/components/OrderListItem";
import OrderItemListItem from "@/components/OrderItemListitem";

const OrderDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  const order = orders.find((order) => order.id === Number(id));
  if (!order) {
    return <Text>Order not found</Text>;
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
