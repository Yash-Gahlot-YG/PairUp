import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "@/src/screens/Login";
import { User, onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "@/FirebaseConfig";
import Home from "@/src/screens/Home";
import Chat from "@/src/screens/Chat";
import ModalScreen from "@/src/screens/ModalScreen";
import MatchedScreen from "@/src/screens/MatchedScreen";
import MessageScreen from "@/src/screens/MessageScreen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type RootStackParamList = {
  Login: undefined;
  Inside: undefined;
  Modal: undefined;
  Chat: undefined;
  Matched: {
    loggedInProfile: Profile;
    userSwiped: Profile;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const InsideStack = createNativeStackNavigator();

function InsideLayout() {
  return (
    <InsideStack.Navigator screenOptions={{ headerShown: false }}>
      <InsideStack.Screen name="Home" component={Home} />
      <InsideStack.Screen name="Matched" component={MatchedScreen} />
    </InsideStack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedInBefore, setIsLoggedInBefore] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const value = await AsyncStorage.getItem("hasLoggedInBefore");
        if (value === "true") {
          setIsLoggedInBefore(true);
        }
      } catch (error) {
        console.error("Failed to fetch the login status", error);
      }
    };

    checkLoginStatus();

    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user && !isLoggedInBefore) {
      const setLoginStatus = async () => {
        try {
          await AsyncStorage.setItem("hasLoggedInBefore", "true");
          setIsLoggedInBefore(true);
        } catch (error) {
          console.error("Failed to set the login status", error);
        }
      };

      setLoginStatus();
    }
  }, [user]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer independent={true}>
        <Stack.Navigator initialRouteName={user ? "Inside" : "Login"}>
          {user ? (
            <Stack.Screen
              name="Inside"
              component={InsideLayout}
              options={{ headerShown: false }}
            />
          ) : (
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
          )}
          <Stack.Group>
            <Stack.Screen
              name="Chat"
              component={Chat}
              options={{ headerShown: false }}
            />
          </Stack.Group>
          <Stack.Group
            screenOptions={{
              presentation: "modal",
              animation: "slide_from_bottom",
            }}
          >
            <Stack.Screen
              name="Modal"
              component={ModalScreen}
              options={{ headerShown: false }}
            />
          </Stack.Group>
          <Stack.Group
            screenOptions={{
              presentation: "transparentModal",
            }}
          >
            <Stack.Screen
              name="Matched"
              component={MatchedScreen}
              options={{ headerShown: false }}
            />
          </Stack.Group>
          <Stack.Group>
            <Stack.Screen
              name="Message"
              component={MessageScreen}
              options={{ headerShown: false }}
            />
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
