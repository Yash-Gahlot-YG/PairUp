import { StyleSheet, SafeAreaView } from "react-native";
import React from "react";
import Header from "@/compo/Header";
import ChatList from "@/compo/ChatList";

export default function Chat() {
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Chat" callEnabled={false} />
      <ChatList />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
