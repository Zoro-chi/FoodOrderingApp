import { Text, FlatList, ActivityIndicator } from "react-native";

import ProductListItem from "@components/ProductListItem";
import { useProductsList } from "@/api/products";

export default function MenuScreen() {
  const { products, error, isLoading } = useProductsList();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <FlatList
      data={products}
      renderItem={({ item }) => <ProductListItem product={item} />}
      numColumns={2}
      contentContainerStyle={{ gap: 10, padding: 10 }}
      columnWrapperStyle={{ gap: 10 }}
    />
  );
}
