import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase";

export const useProductsList = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*");
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });

  return { products: data, error, isLoading };
};

export const useProduct = (id: number) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
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

export const useInsertProduct = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, error } = useMutation({
    mutationFn: async (data: any) => {
      const { data: newProduct, error } = await supabase
        .from("products")
        .insert({
          name: data.name,
          image: data.image,
          price: data.price,
        })
        .select()
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return newProduct;
    },

    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
    },

    async onError(error) {
      console.error("Error inserting product:", error);
    },
  });

  return { insertProduct: mutateAsync, error };
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, error } = useMutation({
    mutationFn: async (data: any) => {
      const { data: updatedProduct, error } = await supabase
        .from("products")
        .update({
          name: data.name,
          image: data.image,
          price: data.price,
        })
        .eq("id", data.id)
        .select("*")
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return updatedProduct;
    },

    async onSuccess(_, data) {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      await queryClient.invalidateQueries({ queryKey: ["product", data.id] });
    },

    async onError(error) {
      console.error("Error updating product:", error);
    },
  });

  return { updateProduct: mutateAsync, error };
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, error } = useMutation({
    mutationFn: async (id: number) => {
      const { data: deletedProduct, error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);
      if (error) {
        throw new Error(error.message);
      }
      return deletedProduct;
    },

    async onSuccess(_, id) {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      await queryClient.invalidateQueries({ queryKey: ["product", id] });
    },

    async onError(error) {
      console.error("Error deleting product:", error);
    },
  });

  return { deleteProduct: mutateAsync, error };
};
