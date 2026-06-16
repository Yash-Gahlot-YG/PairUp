import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
  ScrollView,
} from "react-native";
import React, { ReactNode, useLayoutEffect, useState } from "react";
import { FIREBASE_AUTH } from "@/FirebaseConfig";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FIREBASE_DB } from "@/FirebaseConfig";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { StatusBar } from "expo-status-bar";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { RootStackParamList } from "@/app/index";

const Setting = () => {
  const [fullName, setFullName] = useState<string>("User"); // Initialize fullName state
  const [job, setJob] = useState<String>("user");
  const [userProfileImage, setUserProfileImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const user = FIREBASE_AUTH.currentUser;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  useLayoutEffect(() => {
    if (!user?.uid) return;
    const unsubscribe = onSnapshot(
      doc(FIREBASE_DB, "users", user.uid),
      (snapshot) => {
        if (!snapshot.exists()) {
          console.error("User document does not exist.");
          return;
        }

        const userData = snapshot.data();
        if (userData) {
          if (userData.displayName) {
            console.log("Display Name Retrieved:", userData.displayName);
            setFullName(userData.displayName);
          }
          if (userData.photoURL) {
            setUserProfileImage(userData.photoURL);
          }
          if (userData.job) {
            setJob(userData.job);
          }
        }
      },
      (error) => {
        if (error.code !== "permission-denied") {
          console.error("Error fetching user data:", error);
        }
      }
    );

    return () => unsubscribe();
  }, [navigation, user?.uid]);
  const handleSignOut = async () => {
    try {
      await FIREBASE_AUTH.signOut();
    } catch (error) {
      const err = error as any;
      Alert.alert("Error", err.message || "Failed to sign out.");
    }
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      <StatusBar style="light" backgroundColor={"#e33460"} />
      <View
        style={{
          backgroundColor: "#e33460",
          height: 300,
          width: "100%",
          alignItems: "center",
          // borderRadius: 25,
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
          top: -10,
          elevation: 10, // Creates a shadow-like effect
        }}
      >
        <Text
          style={{
            padding: 20,
            fontSize: 20,
            fontWeight: "800",
            top: 8,
            color: "white",
          }}
        >
          Profile
        </Text>
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 20,
            left: 10,
            padding: 5,
          }}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={30} color="white" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Image
            style={styles.imageProfile}
            source={
              userProfileImage
                ? { uri: userProfileImage }
                : require("@/assets/PairUp/user-profile.jpg")
            }
          />
        </TouchableOpacity>

        {/* Full Name */}
        <Text
          style={{
            fontSize: 24,
            color: "white",
            fontWeight: "400",
            paddingTop: 5,
          }}
        >
          {fullName}
        </Text>
        {/* JOB */}
        <Text
          style={{
            fontSize: 20,
            // padding: 20,
            fontWeight: "300",
            color: "white",
            paddingTop: 5,
          }}
        >
          {/* {user?.email || "User"} */}
          {job}
        </Text>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <AntDesign name="close" size={30} color="white" />
          </TouchableOpacity>
          <Image
            style={styles.modalImage}
            source={
              userProfileImage
                ? { uri: userProfileImage }
                : require("@/assets/PairUp/avtar.jpg")
            }
          />
        </View>
      </Modal>
      {/* ........................ */}
      <View
        style={{
          height: 400, // Set the desired height for the ScrollView
          width: "90%",
          top: -30,
          backgroundColor: "white",
          borderRadius: 20,
          elevation: 10, // Creates a shadow-like effect
        }}
      >
        <ScrollView
          contentContainerStyle={{
            padding: 20, // Ensure padding inside the ScrollView
          }}
        >
          <TouchableOpacity
            style={{
              padding: 20,
              backgroundColor: "#f9cbd4",
              marginBottom: 10,
              borderRadius: 20,
              elevation: 7,
              flexDirection: "row",
              alignItems: "center",
            }}
            onPress={() => navigation.navigate("Modal")}
          >
            <MaterialCommunityIcons
              name="account-edit-outline"
              size={25}
              color="#e33460"
            />
            <Text
              style={{ fontWeight: "900", color: "black", paddingLeft: 20 }}
            >
              Edit Profile
            </Text>
            <Ionicons
              name="chevron-forward-outline"
              size={24}
              color="grey"
              style={{ marginLeft: "auto" }}
            />
          </TouchableOpacity>
          {/* Add more items here if needed */}
          <TouchableOpacity
            style={{
              padding: 20,
              backgroundColor: "#f9cbd4",
              marginBottom: 10,
              borderRadius: 20,
              elevation: 7,
              flexDirection: "row",
              alignItems: "center",
            }}
            onPress={() => {
              Alert.alert(
                "Logout Confirmation",
                "Are you sure you want to log out?",
                [
                  {
                    text: "Cancel",
                    onPress: () => console.log("Logout Cancelled"),
                    style: "cancel",
                  },
                  {
                    text: "OK",
                    onPress: () => handleSignOut(),
                  },
                ],
                { cancelable: true }
              );
            }}
          >
            <AntDesign name="logout" size={24} color="#e33460" />
            <Text
              style={{ fontWeight: "900", color: "black", paddingLeft: 20 }}
            >
              Logout
            </Text>
            <Ionicons
              name="chevron-forward-outline"
              size={24}
              color="grey"
              style={{ marginLeft: "auto" }}
            />
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
};

export default Setting;

const styles = StyleSheet.create({
  imageProfile: {
    height: 110,
    width: 110,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: "white",
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
  },
  modalImage: {
    width: "90%",
    height: "60%",
    resizeMode: "contain",
    borderRadius: 20,
  },
});
