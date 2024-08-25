import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React, { ReactNode, useEffect, useState } from "react";
import { FIREBASE_AUTH } from "@/FirebaseConfig";
import { useNavigation } from "expo-router";
import getMatchedUserInfo from "@/lib/getMetchedUserInfo";

// type MatchDetails = {
//   users: {
//     [key: string]: {
//       displayName: string;
//       photoURL: string;
//     };
//   };
// };

// type Profile = {
//   id: string;
//   fullName: string;
//   occupation: string;
//   photoURL: string;
//   age: number;
// };

// type ChatRowProps = {
//   matchDetails: MatchDetails;
// };

const ChatRow = ({ matchDetails }) => {
  const user = FIREBASE_AUTH.currentUser;
  const navigation = useNavigation();
  const [matchedUserInfo, setMatchedUserInfo] = useState<Profile | null>(null);

  useEffect(() => {
    if (matchDetails?.users && user?.uid) {
      const userInfo = getMatchedUserInfo(matchDetails.users, user.uid);
      // console.log("Retrieved matched user info:", userInfo); // Debug log
      setMatchedUserInfo(userInfo);
    }
  }, [matchDetails, user]);

  if (!matchedUserInfo) {
    return null; // Avoid rendering if user info is not yet available
  }

  return (
    <TouchableOpacity
      style={styles.chatRow}
      onPress={() =>
        navigation.navigate("Message", {
          matchDetails,
        })
      }
    >
      <Image
        style={styles.profileImage}
        source={{
          uri: matchedUserInfo?.photoURL || "https://via.placeholder.com/70",
        }}
      />
      <View>
        <Text style={styles.userName}>
          {matchedUserInfo?.displayName || "User"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ChatRow;

const styles = StyleSheet.create({
  chatRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    margin: 3,
    padding: 10,
    borderRadius: 20,
  },
  profileImage: {
    height: 60,
    width: 60,
    borderRadius: 35,
    margin: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
