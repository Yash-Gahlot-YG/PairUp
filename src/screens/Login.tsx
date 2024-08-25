import {
  Text,
  StyleSheet,
  View,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
  ImageBackground,
  Alert,
  Platform,
  SafeAreaView,
  StatusBar,
} from "react-native";
import React, { useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/app/index";
import { FIREBASE_AUTH } from "@/FirebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
// import { StatusBar } from "expo-status-bar";

type LoginProps = NativeStackScreenProps<RootStackParamList, "Login">;

const Login = ({ navigation }: LoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
    } catch (error: any) {
      console.log("Full Error Object:", error);

      if (error.code === "auth/wrong-password") {
        Alert.alert("Error", "Enter Wrong Password. Please try again.");
      } else if (error.code === "auth/user-not-found") {
        Alert.alert("Error", "No user found with this email.");
      } else {
        Alert.alert("Error", "Sign in failed: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const signUp = async () => {
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(response);
    } catch (error: any) {
      console.log("Full Error Object:", error);

      if (error.code === "auth/email-already-in-use") {
        Alert.alert("Error", "This email is already in use.");
      } else if (error.code === "auth/invalid-email") {
        Alert.alert("Error", "The email address is invalid.");
      } else {
        Alert.alert("Error", "Sign up failed: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Set StatusBar to transparent */}
      <StatusBar backgroundColor="#e33460" barStyle={"light-content"} />

      {/* ImageBackground will now be behind the StatusBar */}
      <ImageBackground
        source={require("@/assets/PairUp/login1.jpeg")}
        resizeMode="cover"
        style={styles.imageBackground}
      >
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.select({ ios: 0, android: 500 })}
        >
          <TextInput
            value={email}
            placeholder="Email"
            autoCapitalize="none"
            placeholderTextColor="white"
            onChangeText={(text) => setEmail(text)}
            style={styles.input}
          />
          <TextInput
            value={password}
            placeholder="Password"
            autoCapitalize="none"
            placeholderTextColor="white"
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={true}
            style={styles.input}
          />
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.loginButton} onPress={signIn}>
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.createButton} onPress={signUp}>
                <Text style={styles.buttonText}>Create account</Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.sloganContainer}>
            <Text style={styles.sloganText1}>Find Your Pairup</Text>
            <Text style={styles.sloganText2}>Person</Text>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  input: {
    height: 40,
    width: "70%",
    margin: 2,
    borderRadius: 8,
    borderColor: "white",
    borderWidth: 2,
    paddingHorizontal: 8,
    backgroundColor: "rgba(0,0,0,0.5)",
    color: "white",
    top: 20,
  },
  buttonContainer: {
    width: "70%", // Adjusted width for better layout on larger screens
    alignItems: "center",
    top: 10,
  },
  loginButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    marginVertical: 5,
    backgroundColor: "rgba(0, 0, 0, 0.0)", // Transparent background
    borderRadius: 8,
    top: 45,
  },
  createButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    marginVertical: 5,
    backgroundColor: "rgba(0, 0, 0, 0.0)", // Transparent background
    borderRadius: 8,
    top: 30,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 17,
  },
  imageBackground: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  sloganContainer: {
    alignItems: "center",
    top: 190, // Adjusted top value for better layout on different screens
  },
  sloganText1: {
    fontStyle: "italic",
    fontWeight: "500",
    fontSize: 20,
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginBottom: 5,
  },
  sloganText2: {
    fontStyle: "italic",
    fontWeight: "400",
    fontSize: 22,
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
