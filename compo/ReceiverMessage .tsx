import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";

const ReceiverMessage = ({ message }) => {
  return (
    <View style={styles.receiverMessage}>
      <Image style={styles.image} source={{ uri: message.photoURL }} />
      <Text style={styles.messageText}>{message.message}</Text>
    </View>
  );
};

export default ReceiverMessage;

const styles = StyleSheet.create({
  receiverMessage: {
    backgroundColor: "#34b7f1", // Blue color for receiver messages
    borderRadius: 8,
    borderTopLeftRadius: 0,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 12,
    paddingBottom: 12,
    marginLeft: 12, // mx-3
    marginRight: "auto",
    marginTop: 8, // my-2
    marginBottom: 8, // my-2
    alignSelf: "flex-start",
    position: "relative",
  },
  image: {
    height: 48, // 12 * 4
    width: 48, // 12 * 4
    borderRadius: 24, // 12 * 2
    position: "absolute",
    top: 0,
    left: -56, // -14 * 4
  },
  messageText: {
    color: "white",
  },
});
