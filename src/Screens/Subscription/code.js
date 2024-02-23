import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { CardField, useStripe } from "@stripe/stripe-react-native";

import CheckoutForm from "./CheckoutForm";
import styles from "./AppStyles";

const stripePublishableKey = "pk_test_51Mx1vCSB4pLjzWKkpz54QGtrbTn9AyVfJWExkJtR0ZggnmbUuPu7kvPjJst3ycukIuSTwjMZZCplSom3jV9cOF6e00Css0rDZp";

export default function App() {
  const [clientSecret, setClientSecret] = useState("");
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  useEffect(() => {
    const fetchClientSecret = async () => {
      // Fetch the client secret from your server
      const response = await fetch("/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: [{ id: "xl-tshirt" }] }),
      });
      const data = await response.json();
      setClientSecret(data.clientSecret);
    };

    fetchClientSecret();
  }, []);

  useEffect(() => {
    const initializePaymentSheet = async () => {
      if (clientSecret) {
        const { error } = await initPaymentSheet({
          paymentIntentClientSecret: clientSecret,
        });

        if (!error) {
        }
      }
    };

    initializePaymentSheet();
  }, [clientSecret]);

  const handlePayment = async () => {
    if (clientSecret) {
      const { error } = await presentPaymentSheet();

      if (error) {
        console.log("Payment failed:", error);
      } else {
        console.log("Payment successful.");
      }
    }
  };

  return (
    <View style={styles.container}>
      {clientSecret ? (
        <>
          <CheckoutForm />
          <Text style={styles.paymentButton} onPress={handlePayment}>
            Pay Now
          </Text>
        </>
      ) : (
        <Text style={styles.loadingText}>Loading...</Text>
      )}
    </View>
  );
}
