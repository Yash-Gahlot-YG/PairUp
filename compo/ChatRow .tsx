import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React, { ReactNode, useEffect, useState } from "react";
import { FIREBASE_AUTH } from "@/FirebaseConfig";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import getMatchedUserInfo from "@/lib/getMetchedUserInfo";
import Feather from "@expo/vector-icons/Feather";
import { Profile } from "@/src/screens/Home";
import { RootStackParamList } from "@/app/index";

const ChatRow = ({ matchDetails }: { matchDetails: any }) => {
  const user = FIREBASE_AUTH.currentUser;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [matchedUserInfo, setMatchedUserInfo] = useState<any>(null);

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
      <View style={styles.textAndIconContainer}>
        <Text style={styles.userName}>
          {matchedUserInfo?.displayName || "User"}
        </Text>
        <Feather name="camera" size={24} color="black" />
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
  textAndIconContainer: {
    flex: 1, // Take up remaining space
    flexDirection: "row",
    justifyContent: "space-between", // Space out Text and Icon
    alignItems: "center", // Align vertically
    marginLeft: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
