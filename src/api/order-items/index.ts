import { useMutation, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase";
import { InsertTables } from "@/types";

export const useInsertOrderItems = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, error } = useMutation({
    mutationFn: async (items: InsertTables<"order_items">[]) => {
      const { data: newOrder, error } = await supabase
        .from("order_items")
        .insert(items)
        .select();
      if (error) {
        throw new Error(error.message);
      }
      return newOrder;
    },
  });

  return { insertOrderItems: mutateAsync, error };
};
