import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";

export const useAdminOrderList = ({ archived = false }) => {
  const statuses = archived ? ["DELIVERED"] : ["NEW", "COOKING", "DELIVERING"];

  const { data, error, isLoading } = useQuery({
    queryKey: ["orders", { archived }],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .in("status", statuses);
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
        .eq("user_id", id);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });

  return { orders: data, error, isLoading };
};
