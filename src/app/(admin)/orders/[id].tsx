import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";

import OrderListItem from "@/components/OrderListItem";
import OrderItemListItem from "@/components/OrderItemListitem";
import { OrderStatusList } from "@/types";
import Colors from "@/constants/Colors";
import { useOrderDetails, useUpdateOrder } from "@/api/orders";
import { notifyUserAboutOrderUpdate } from "@/lib/notifications";

const OrderDetailsScreen = () => {
  const { id: idParam } = useLocalSearchParams();

  // Improved parsing to handle undefined or invalid values
  const id = idParam
    ? typeof idParam === "string"
      ? parseInt(idParam, 10)
      : parseInt(idParam[0], 10)
    : 0;

  const { product: order, isLoading, error } = useOrderDetails(id);
  const { updateOrder } = useUpdateOrder();

  const updateStatus = async (status: string) => {
    try {
      await updateOrder({
        id: id,
        updatedFields: { status },
      });

      console.log("Notify :", order?.user_id);
      if (order) {
        await notifyUserAboutOrderUpdate({ ...order, status });
      }
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error || !order) {
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
                  onPress={() => updateStatus(status)}
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
