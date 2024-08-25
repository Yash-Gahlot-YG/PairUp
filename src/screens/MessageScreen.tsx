import Header from "@/compo/Header";
import { FIREBASE_AUTH, FIREBASE_DB } from "@/FirebaseConfig";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Button,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import getMatchedUserInfo from "@/lib/getMetchedUserInfo";
import { useRoute } from "@react-navigation/native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import SendrMessage from "@/compo/SendrMessage";
import ReceiverMessage from "@/compo/ReceiverMessage ";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

const MessageScreen = () => {
  const user = FIREBASE_AUTH.currentUser;
  const { params } = useRoute();
  const [input, setInput] = useState("");
  const { matchDetails } = params;
  const titleStyle = styles.displayName;
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const messageQuery = query(
      collection(FIREBASE_DB, "matches", matchDetails.id, "messages"),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(messageQuery, (snapshot) =>
      setMessages(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      )
    );

    return unsubscribe;
  }, [matchDetails]);

  const sendMessage = () => {
    addDoc(collection(FIREBASE_DB, "matches", matchDetails.id, "messages"), {
      timestamp: serverTimestamp(),
      userId: user.uid,
      displayName: user.displayName,
      message: input,
    });
    setInput("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={getMatchedUserInfo(matchDetails.users, user.uid).displayName}
        callEnabled={true}
        titleStyle={titleStyle}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={90}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item: message }) =>
              message.userId === user.uid ? (
                <SendrMessage key={message.id} message={message} />
              ) : (
                <ReceiverMessage key={message.id} message={message} />
              )
            }
            inverted
          />
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <View style={styles.messageContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Send Message..."
          onChangeText={setInput}
          onSubmitEditing={sendMessage}
          value={input}
        />
        <Button onPress={sendMessage} title="Send" color="#e33460" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 10,
  },
  displayName: {
    fontSize: 18,
    fontWeight: "500",
    marginLeft: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  messageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // borderTopWidth: 1,
    borderTopColor: "grey",
    padding: 5,
    paddingBottom: 10,
  },
  textInput: {
    flex: 1,
    height: 40,
    borderColor: "grey",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginRight: 10,
    borderRadius: 5,
    padding: 5,
  },
});

export default MessageScreen;
