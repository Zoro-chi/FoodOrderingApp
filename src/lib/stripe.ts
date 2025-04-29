import { Alert } from "react-native";
import { supabase } from "./supabase";
import {
  initPaymentSheet,
  presentPaymentSheet,
} from "@stripe/stripe-react-native";

// Track payment sheet initialization state
let isPaymentSheetInitialized = false;

const fetchPaymentSheetParams = async (amount: number) => {
  console.log("Fetching payment sheet params with amount:", amount);

  try {
    const { data, error } = await supabase.functions.invoke("payment-sheet", {
      body: { amount },
    });

    if (error) {
      console.error("Error fetching payment sheet params:", error);
      throw new Error(`Payment setup failed: ${error.message}`);
    }

    if (!data) {
      console.error("No data returned from payment-sheet function");
      throw new Error("No response from payment service");
    }

    console.log("Payment sheet params:", data);

    // Log the actual values to help with debugging
    console.log("Payment Intent:", data.paymentIntent ? "exists" : "missing");
    console.log("Publishable Key:", data.publishableKey ? "exists" : "missing");

    if (!data.paymentIntent || !data.publishableKey) {
      throw new Error(
        "Invalid response from payment service: missing required data"
      );
    }

    return data;
  } catch (error: any) {
    console.error("Exception fetching payment sheet params:", error);
    Alert.alert(
      "Payment Setup Failed",
      error.message || "Could not connect to payment service"
    );
    throw error;
  }
};

export const initializePaymentSheet = async (amount: number) => {
  console.log("Initializing payment sheet with amount:", amount);
  isPaymentSheetInitialized = false;

  try {
    const { paymentIntent, publishableKey } = await fetchPaymentSheetParams(
      amount
    );

    console.log("Initializing payment sheet with intent");
    const { error } = await initPaymentSheet({
      merchantDisplayName: "Foodies",
      paymentIntentClientSecret: paymentIntent,
      defaultBillingDetails: {
        name: "John Doe",
      },
    });

    if (error) {
      console.error("Error initializing payment sheet:", error);
      Alert.alert("Payment Setup Failed", error.message);
      return false;
    }

    console.log("Payment sheet initialized successfully");
    isPaymentSheetInitialized = true;
    return true;
  } catch (error: any) {
    console.error("Exception initializing payment sheet:", error);
    return false;
  }
};

export const openPaymentSheet = async () => {
  console.log("Opening payment sheet");

  if (!isPaymentSheetInitialized) {
    console.error("Payment sheet not initialized");
    Alert.alert(
      "Payment Error",
      "Payment system is not ready. Please try again."
    );
    return false;
  }

  try {
    const { error } = await presentPaymentSheet();
    if (error) {
      console.error("Error presenting payment sheet:", error);
      Alert.alert("Payment Failed", error.message);
      return false;
    }
    Alert.alert("Payment Successful", "Your payment was successful!");
    console.log("Payment successful");
    return true;
  } catch (error: any) {
    console.error("Exception presenting payment sheet:", error);
    Alert.alert("Payment Error", "An unexpected error occurred");
    return false;
  }
};
