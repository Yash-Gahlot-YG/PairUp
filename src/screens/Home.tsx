import React, {
  ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
  StatusBar,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome6";
import { AntDesign } from "@expo/vector-icons";
import {
  doc,
  onSnapshot,
  collection,
  setDoc,
  getDocs,
  getDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "@/FirebaseConfig";
import Swiper from "react-native-deck-swiper";
import generateId from "@/lib/generateld";

const { width, height } = Dimensions.get("window");

type Profile = {
  [x: string]: ReactNode;
  id: string;
  fullName: string;
  occupation: string;
  photoURL: string;
  age: number;
};

type HomeProps = NativeStackScreenProps<any, any>;

const Home = ({ navigation }: HomeProps) => {
  const swiperRef = useRef(null);
  const [profile, setProfile] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfileImage, setUserProfileImage] = useState<string | null>(null);

  const user = FIREBASE_AUTH.currentUser;

  useLayoutEffect(() => {
    const unsubscribe = onSnapshot(
      doc(FIREBASE_DB, "users", user?.uid || ""),
      (snapshot) => {
        if (!snapshot.exists()) {
          navigation.navigate("Modal");
        } else {
          const userData = snapshot.data();
          if (userData && userData.photoURL) {
            setUserProfileImage(userData.photoURL);
          }
        }
      }
    );
    return () => unsubscribe();
  }, [navigation, user?.uid]);

  useEffect(() => {
    const fetchCards = async () => {
      setLoading(true);
      try {
        const passes = await getDocs(
          collection(FIREBASE_DB, "users", user.uid, "passes")
        ).then((snapshot) => snapshot.docs.map((doc) => doc.id));

        const swipes = await getDocs(
          collection(FIREBASE_DB, "users", user.uid, "swipes")
        ).then((snapshot) => snapshot.docs.map((doc) => doc.id));

        const passedUserIds = passes.length > 0 ? passes : ["test"];
        const swipedUserIds = swipes.length > 0 ? swipes : ["test"];

        const unsub = onSnapshot(
          query(
            collection(FIREBASE_DB, "users"),
            where("id", "not-in", [...passedUserIds, ...swipedUserIds])
          ),
          (snapshot) => {
            const allProfiles = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as Profile[];

            const filteredProfiles = allProfiles.filter(
              (profile) => profile.id !== user?.uid
            );

            setProfile(filteredProfiles);
            setLoading(false);
          }
        );
        return () => unsub();
      } catch (error) {
        console.error("Error fetching cards: ", error);
        setLoading(false);
      }
    };

    fetchCards();
  }, [user?.uid]);

  const swipeLeft = async (cardIndex: number) => {
    if (!profile[cardIndex]) return;

    const userSwiped = profile[cardIndex];
    console.log(`You swiped PASS on ${userSwiped.displayName}`);

    try {
      await setDoc(
        doc(FIREBASE_DB, "users", user.uid, "passes", userSwiped.id),
        userSwiped
      );
    } catch (error) {
      console.error("Error saving pass: ", error);
    }
  };

  const swipeRight = async (cardIndex: number) => {
    if (!profile[cardIndex]) return;

    const userSwiped = profile[cardIndex];
    try {
      const loggedInProfile = await getDoc(
        doc(FIREBASE_DB, "users", user.uid)
      ).then((doc) => doc.data());
      const swipedDoc = await getDoc(
        doc(FIREBASE_DB, "users", userSwiped.id, "swipes", user.uid)
      );

      if (swipedDoc.exists()) {
        console.log(`Hooray, You MATCHED with ${userSwiped.displayName}`);

        await setDoc(
          doc(FIREBASE_DB, "users", user.uid, "swipes", userSwiped.id),
          userSwiped
        );

        await setDoc(
          doc(FIREBASE_DB, "matches", generateId(user.uid, userSwiped.id)),
          {
            users: {
              [user.uid]: loggedInProfile,
              [userSwiped.id]: userSwiped,
            },
            usersMatched: [user.uid, userSwiped.id],
            timestamp: serverTimestamp(),
          }
        );

        console.log("Navigating to MatchedScreen"); // Debug line

        // Ensure navigation occurs after the match is set
        navigation.navigate("Matched", {
          loggedInProfile,
          userSwiped,
        });
      } else {
        console.log(
          `You swiped on ${userSwiped.displayName} (${userSwiped.job})`
        );
        await setDoc(
          doc(FIREBASE_DB, "users", user.uid, "swipes", userSwiped.id),
          userSwiped
        );
      }
    } catch (error) {
      console.error("Error handling swipe: ", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <StatusBar barStyle="dark-content" />
        <TouchableOpacity
          style={styles.logoContainer}
          onPress={() => navigation.navigate("Modal")}
        >
          <Image
            style={styles.imageProfile}
            source={
              userProfileImage
                ? { uri: userProfileImage }
                : require("@/assets/PairUp/avtar.jpg")
            }
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => FIREBASE_AUTH.signOut()}>
          <Image
            style={styles.logoImage}
            source={require("@/assets/PairUp/dating-0.6.png")}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.heartMsgicon}
          onPress={() => navigation.navigate("Chat")}
        >
          <FontAwesomeIcon
            name="heart-circle-bolt"
            size={30}
            color={"#e33460"}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.swiperContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#e33460" />
        ) : (
          <Swiper
            ref={swiperRef}
            cards={profile}
            stackSize={3}
            infinite={false}
            cardIndex={0}
            verticalSwipe={false}
            onSwipedLeft={(cardIndex) => {
              console.log("Swipe PASS");
              swipeLeft(cardIndex);
            }}
            onSwipedRight={(cardIndex) => {
              console.log("Swipe MATCH");
              swipeRight(cardIndex);
            }}
            animateCardOpacity
            backgroundColor="transparent"
            overlayLabels={{
              left: {
                title: "Nope",
                style: {
                  label: {
                    backgroundColor: "transparent",
                    color: "red",
                    fontSize: 24,
                  },
                  wrapper: {
                    flexDirection: "column",
                    alignItems: "flex-end",
                    justifyContent: "flex-start",
                    marginTop: 35,
                    marginLeft: -3,
                  },
                },
              },
              right: {
                title: "LIKE",
                style: {
                  label: { fontSize: 28, color: "green", textColor: "bold" },
                  wrapper: {
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    marginTop: 38,
                    marginLeft: 3,
                  },
                },
              },
            }}
            renderCard={(card) =>
              card ? (
                <View key={card.id} style={styles.card}>
                  <Image
                    source={{ uri: card.photoURL }}
                    style={styles.cardImage}
                  />
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardText}>
                      {`${card.displayName}, ${card.age}`}
                    </Text>
                    <Text style={styles.cardOccupation}>{card.job}</Text>
                  </View>
                </View>
              ) : (
                <View style={styles.noMoreProfilesContainer}>
                  <Text style={styles.noMoreProfilesText}>
                    No more profiles
                  </Text>
                  <Image
                    source={{
                      uri: "https://i.pinimg.com/474x/aa/6d/59/aa6d593f511a05f66d5bafb8cf281a2e.jpg",
                    }}
                    style={{ height: 90, width: 80 }}
                  />
                </View>
              )
            }
          />
        )}
      </View>

      <View style={styles.heartCorss}>
        <TouchableOpacity
          style={styles.crossicon}
          onPress={() => swiperRef.current.swipeLeft()}
        >
          <AntDesign name="close" size={24} color={"red"} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.hearticon}
          onPress={() => swiperRef.current.swipeRight()}
        >
          <AntDesign name="heart" size={24} color={"green"} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    paddingTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingStart: 10,
    paddingEnd: 10,
    marginTop: -29,
    zIndex: 2,
  },
  logoContainer: { flexDirection: "row", alignItems: "center" },
  imageProfile: {
    height: 60,
    width: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#e33460",
    marginTop: 5,
  },
  logoImage: { height: 100, width: 100, marginRight: 10, top: 4 },
  heartMsgicon: { zIndex: 3, marginRight: 2 },
  swiperContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    top: -132,
    zIndex: 1,
  },
  card: {
    flex: 1,
    borderRadius: 10,
    shadowRadius: 90,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 9, height: 5 },
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    width: width * 0.9,
    height: height * 0.7,
    marginBottom: 10,
    marginTop: 80,
  },
  cardImage: { width: "100%", height: "85%", borderRadius: 25 },
  cardInfo: {
    padding: 10,
    alignItems: "center",
    borderRadius: 50,
    paddingBottom: 5,
  },
  cardText: { fontSize: 18, fontWeight: "bold", color: "#333" },
  cardOccupation: { fontSize: 16, color: "#777" },
  noMoreProfilesContainer: {
    backgroundColor: "white",
    width: width * 0.9,
    height: height * 0.7,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    shadowRadius: 25,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 0 },
  },
  noMoreProfilesText: { fontWeight: "bold", paddingBottom: 5 },
  heartCorss: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    position: "absolute",
    bottom: 60,
  },
  crossicon: {
    width: 50,
    height: 50,
    backgroundColor: "#fab1a0",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },
  hearticon: {
    width: 50,
    height: 50,
    backgroundColor: "#81ecec",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },
});

export default Home;
