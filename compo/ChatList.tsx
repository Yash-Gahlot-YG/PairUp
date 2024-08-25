import { StyleSheet, Text, View, FlatList, StatusBar } from "react-native";
import React, { useEffect, useState } from "react";
import { FIREBASE_AUTH, FIREBASE_DB } from "@/FirebaseConfig";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import ChatRow from "@/compo/ChatRow "; // Remove the trailing space

const ChatList = () => {
  const user = FIREBASE_AUTH.currentUser;
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    if (user) {
      const q = query(
        collection(FIREBASE_DB, "matches"),
        where("usersMatched", "array-contains", user.uid)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const matchesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Fetched matches:", matchesData); // Debug log
        setMatches(matchesData);
      });

      return () => unsubscribe();
    }
  }, [user]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="rgb(240, 240, 240)" barStyle="dark-content" />
      {matches.length > 0 ? (
        <FlatList
          style={styles.flatList}
          data={matches}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ChatRow matchDetails={item} />}
        />
      ) : (
        <Text style={styles.noMatchesText}>No matches at the moment 😢</Text>
      )}
    </View>
  );
};

export default ChatList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  flatList: {
    height: "100%",
  },
  noMatchesText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
  },
});
