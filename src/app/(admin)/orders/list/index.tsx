import { StyleSheet, Text, FlatList, ActivityIndicator } from "react-native";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

import OrderListItem from "@/components/OrderListItem";
import { useAdminOrderList } from "@/api/orders";

const OrdersScreen = () => {
  const { orders, error, isLoading } = useAdminOrderList({ archived: false });

  useEffect(() => {
    const channel = supabase
      .channel("custom-insert-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          console.log("Change received!", payload);
        }
      )
      .subscribe();

    // Clean up the subscription when component unmounts
    return () => {
      channel.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Failed to fetch</Text>;
  }

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
