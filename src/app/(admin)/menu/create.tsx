import { useState } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";

import Button from "@/components/Button";

const CreateProductScreen = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

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

  const onCreate = () => {
    if (!validateInput()) {
      console.log("Validation errors:", errors);
      return;
    }
    console.log("Product created", name, price);
    resetFields();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        style={styles.input}
        placeholder="Enter product name"
        placeholderTextColor="#aaa"
      />

      <Text style={styles.label}>Price ($)</Text>
      <TextInput
        value={price}
        onChangeText={setPrice}
        style={styles.input}
        placeholder="9.99"
        placeholderTextColor="#aaa"
        keyboardType="numeric"
      />

      {errors.length > 0 && (
        <View>
          {errors.map((error, index) => (
            <Text key={index} style={{ color: "red" }}>
              {error}
            </Text>
          ))}
        </View>
      )}

      <Button text="Create Product" onPress={onCreate} />
    </View>
  );
};

export default CreateProductScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 10,
    color: "#fff",
  },
  label: {
    fontSize: 17,
    fontWeight: "bold",
    color: "grey",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "gainsboro",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 20,
  },
});
