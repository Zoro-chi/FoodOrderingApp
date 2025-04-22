import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { Tables } from "@/database.types";
import { InsertTables, UpdateTables } from "@/types";

export const useAdminOrderList = ({ archived = false }) => {
  const statuses = archived ? ["DELIVERED"] : ["NEW", "COOKING", "DELIVERING"];

  const { data, error, isLoading } = useQuery({
    queryKey: ["orders", { archived }],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .in("status", statuses)
        .order("created_at", { ascending: false });
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });

  return { orders: data, error, isLoading };
};

export const useMyOrderList = () => {
  const { session } = useAuth();
  const id = session?.user.id;

  const { data, error, isLoading } = useQuery({
    queryKey: ["orders", { userId: id }],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", id)
        .order("created_at", { ascending: false });
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });

  return { orders: data, error, isLoading };
};

export const useOrderDetails = (id: number) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*, products(*))")
        .eq("id", id)
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });

  return { product: data, error, isLoading };
};

export const useInsertOrder = () => {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const userId = session?.user.id;

  const { mutateAsync, error } = useMutation({
    mutationFn: async (data: InsertTables<"orders">) => {
      const { data: newOrder, error } = await supabase
        .from("orders")
        .insert({
          ...data,
          user_id: userId,
        })
        .select()
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return newOrder;
    },

    async onSuccess(newOrder) {
      console.log("Order created", newOrder);
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
    },

    async onError(error) {
      console.error("Error inserting:", error);
    },
  });

  return { insertOrder: mutateAsync, error };
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, error } = useMutation({
    mutationFn: async ({
      id,
      updatedFields,
    }: {
      id: number;
      updatedFields: UpdateTables<"orders">;
    }) => {
      const { data, error } = await supabase
        .from("orders")
        .update(updatedFields)
        .eq("id", id)
        .select()
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },

    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["order", id] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },

    onError: (error) => {
      console.error("Error updating order:", error);
    },
  });

  return { updateOrder: mutateAsync, error };
};
