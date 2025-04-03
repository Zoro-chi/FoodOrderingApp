import { View, Text, FlatList, Pressable } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";

import orders from "@assets/data/orders";
import OrderListItem from "@/components/OrderListItem";
import OrderItemListItem from "@/components/OrderItemListitem";
import { OrderStatusList } from "@/types";
import Colors from "@/constants/Colors";

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
        ListFooterComponent={() => (
          <>
            <Text
              style={{
                fontWeight: "bold",
                color: "#fff",
                marginVertical: 20,
                textAlign: "center",
              }}
            >
              Status
            </Text>
            <View
              style={{ flexDirection: "row", justifyContent: "space-around" }}
            >
              {OrderStatusList.map((status) => (
                <Pressable
                  key={status}
                  onPress={() => console.warn("Update status")}
                  style={{
                    borderColor: Colors.light.tint,
                    borderWidth: 1,
                    padding: 10,
                    borderRadius: 5,
                    marginVertical: 10,
                    backgroundColor:
                      order.status === status
                        ? Colors.light.tint
                        : "transparent",
                  }}
                >
                  <Text
                    style={{
                      color:
                        order.status === status ? "white" : Colors.light.tint,
                    }}
                  >
                    {status}
                  </Text>
                </Pressable>
              ))}
            </View>
          </>
        )}
      />
    </View>
  );
};

export default OrderDetailsScreen;
