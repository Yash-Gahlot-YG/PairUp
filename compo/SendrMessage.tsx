import React from "react";
import { StyleSheet, Text, View } from "react-native";

const SendrMessage = ({ message }) => {
  return (
    <View style={styles.sendrMessage}>
      <Text style={styles.messageText}>{message.message}</Text>
    </View>
  );
};

export default SendrMessage;

const styles = StyleSheet.create({
  sendrMessage: {
    backgroundColor: "#6b46c1", // Purple color for sender messages
    borderRadius: 8,
    borderTopRightRadius: 0,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 12,
    paddingBottom: 12,
    marginLeft: "auto",
    marginRight: 12, // mx-3
    marginTop: 8, // my-2
    marginBottom: 8, // my-2
    alignSelf: "flex-start",
  },
  messageText: {
    color: "white",
  },
});
