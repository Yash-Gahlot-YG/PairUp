import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";

const MatchedScreen = () => {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { loggedInProfile, userSwiped } = params;
  return (
    <View style={styles.container}>
      <View style={styles.matchImage}>
        <Image
          style={{
            height: 50,
            width: 200,
          }}
          source={{ uri: "https://links.papareact.com/mg9" }}
        />
      </View>
      <Text style={styles.textStyle}>
        You and {userSwiped.displayName} have liked each other.
      </Text>
      <View style={styles.profileImage}>
        <Image
          style={{ height: 90, width: 90, borderRadius: 50 }}
          source={{ uri: loggedInProfile.photoURL }}
        />
        <Image
          style={{ height: 90, width: 90, borderRadius: 50 }}
          source={{ uri: userSwiped.photoURL }}
        />
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate("Chat");
        }}
      >
        <Text style={{ textAlign: "center", fontWeight: "bold" }}>
          Send a Message
        </Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(227, 52, 96, 0.7)",
  },
  matchImage: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 90,
  },
  textStyle: {
    color: "white",
    textAlign: "center",
    margin: 30,
    paddingBottom: 10,
    fontWeight: "bold",
  },
  profileImage: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    margin: 5,
  },
  button: {
    backgroundColor: "white",
    top: 90,
    paddingTop: 14,
    borderRadius: 20,
    height: 50,
    width: 200,
    alignSelf: "center",
  },
});
export default MatchedScreen;
