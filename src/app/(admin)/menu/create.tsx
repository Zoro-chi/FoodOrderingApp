import { useEffect, useState } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  Alert,
  useColorScheme,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";
import { randomUUID } from "expo-crypto";

import Button from "@/components/Button";
import { defaultPizzaImage } from "@/components/ProductListItem";
import Colors from "@/constants/Colors";
import {
  useDeleteProduct,
  useInsertProduct,
  useProduct,
  useUpdateProduct,
} from "@/api/products";
import { supabase } from "@/lib/supabase";

const CreateProductScreen = () => {
  const colorScheme = useColorScheme() || "light";
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const router = useRouter();

  // Get theme colors
  const backgroundColor = Colors[colorScheme].background;
  const textColor = Colors[colorScheme].text;
  const tintColor = Colors[colorScheme].tint;

  const { id: idString } = useLocalSearchParams();
  // Improved parsing to handle undefined or invalid values
  const id = idString
    ? typeof idString === "string"
      ? parseInt(idString, 10)
      : parseInt(idString[0], 10)
    : 0;

  const isUpdating = !!id;

  const { insertProduct } = useInsertProduct();
  const { updateProduct } = useUpdateProduct();
  const { deleteProduct } = useDeleteProduct();
  const { product: updatingProduct } = useProduct(id);

  useEffect(() => {
    if (updatingProduct) {
      setName(updatingProduct.name);
      setPrice(updatingProduct.price.toString());
      setImage(updatingProduct.image);
    }
  }, [updatingProduct]);

  const resetFields = () => {
    setName("");
    setPrice("");
  };

  const validateInput = () => {
    setErrors([]);
    const errors = [];
    if (!name) {
      errors.push("Name is required");
    }
    if (!price) {
      errors.push("Price is required");
    } else if (isNaN(parseFloat(price))) {
      errors.push("Price must be a number");
    }

    setErrors(errors);
    return errors.length === 0;
  };

  const onSubmit = () => {
    if (isUpdating) {
      onUpdate();
    } else {
      onCreate();
    }
  };

  const onUpdate = () => {
    if (!validateInput()) {
      console.log("Validation errors:", errors);
      return;
    }

    updateProduct(
      {
        id,
        name,
        price: parseFloat(price),
        image,
      },
      {
        onSuccess: () => {
          console.log("Product updated");
          resetFields();
          router.back();
        },
        onError: (error) => {
          console.error("Error updating product:", error);
          setErrors([error.message]);
        },
      }
    );
  };

  const onCreate = async () => {
    if (!validateInput()) {
      console.log("Validation errors:", errors);
      return;
    }

    const imagePath = await uploadImage();

    insertProduct(
      {
        name,
        price: parseFloat(price),
        image: imagePath,
      },
      {
        onSuccess: () => {
          console.log("Product created");
          resetFields();
          router.back();
        },
        onError: (error) => {
          console.error("Error creating product:", error);
          setErrors([error.message]);
        },
      }
    );

    resetFields();
  };

  const onDelete = () => {
    deleteProduct(id, {
      onSuccess: () => {
        console.log("Product deleted");
        router.replace("/(admin)");
      },
      onError: (error) => {
        console.error("Error deleting product:", error);
        setErrors([error.message]);
      },
    });
    resetFields();
  };

  const confirmDelete = () => {
    Alert.alert("Confirm", "Are you sure you want to delete this product?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: onDelete,
        style: "destructive",
      },
    ]);
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!image?.startsWith("file://")) {
      return;
    }

    const base64 = await FileSystem.readAsStringAsync(image, {
      encoding: "base64",
    });
    const filePath = `${randomUUID()}.png`;
    const contentType = "image/png";
    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(filePath, decode(base64), { contentType });

    console.log("Upload result:", data, error);

    if (data) {
      return data.path;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Stack.Screen
        options={{ title: isUpdating ? "Update Product" : "Create Product" }}
      />

      <Image
        source={{ uri: image || defaultPizzaImage }}
        style={styles.image}
      />
      <Text
        style={[styles.textButton, { color: tintColor }]}
        onPress={pickImage}
      >
        Select Image
      </Text>

      <Text
        style={[
          styles.label,
          { color: colorScheme === "dark" ? "#ccc" : "grey" },
        ]}
      >
        Name
      </Text>
      <TextInput
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        style={[
          styles.input,
          {
            color: textColor,
            backgroundColor: colorScheme === "dark" ? "#333" : "gainsboro",
          },
        ]}
        placeholder="Enter product name"
        placeholderTextColor={colorScheme === "dark" ? "#aaa" : "#777"}
      />

      <Text
        style={[
          styles.label,
          { color: colorScheme === "dark" ? "#ccc" : "grey" },
        ]}
      >
        Price ($)
      </Text>
      <TextInput
        value={price}
        onChangeText={setPrice}
        style={[
          styles.input,
          {
            color: textColor,
            backgroundColor: colorScheme === "dark" ? "#333" : "gainsboro",
          },
        ]}
        placeholder="9.99"
        placeholderTextColor={colorScheme === "dark" ? "#aaa" : "#777"}
        keyboardType="numeric"
      />

      {errors.length > 0 && (
        <View style={{ backgroundColor: "transparent" }}>
          {errors.map((error, index) => (
            <Text key={index} style={{ color: "red" }}>
              {error}
            </Text>
          ))}
        </View>
      )}

      <Button text={isUpdating ? "Update" : "Create"} onPress={onSubmit} />
      {isUpdating && (
        <Text
          onPress={confirmDelete}
          style={[styles.textButton, { color: "red" }]}
        >
          Delete
        </Text>
      )}
    </View>
  );
};

export default CreateProductScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 10,
  },
  label: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 20,
  },
  image: {
    width: "50%",
    aspectRatio: 1,
    alignSelf: "center",
  },
  textButton: {
    alignSelf: "center",
    fontWeight: "bold",
    marginVertical: 10,
  },
});
