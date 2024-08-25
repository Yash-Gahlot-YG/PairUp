import { StyleSheet, SafeAreaView } from "react-native";
import React from "react";
import Header from "@/compo/Header";
import ChatList from "@/compo/ChatList";
import ChatRow from "@/compo/ChatRow ";

export default function Chat() {
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Chat" callEnabled={false} />
      <ChatList />
      <ChatRow matchDetails={undefined} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
