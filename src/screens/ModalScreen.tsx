import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  StatusBar,
  Platform,
  ActivityIndicator,
} from "react-native";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { FIREBASE_DB, FIREBASE_AUTH } from "@/FirebaseConfig";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { RootStackParamList } from "@/app/index";

// ✅ Free image hosting — get your key at https://imgbb.com/api (takes 30 sec)
const IMGBB_API_KEY = "2263e37d5bbb21e89e5516cb101c8ca9";

const ModalScreen = () => {
  const user = FIREBASE_AUTH.currentUser;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [image, setImage] = useState<string | null>(null);
  const [job, setJob] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [fullName, setFullName] = useState<string>("");
  const [gender, setGender] = useState<"male" | "female" | null>(null);

  const incompleteForm = !job || !age || !fullName || !image || !gender;

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const updateUserProfile = () => {
    if (!user) {
      alert("Error: User is not authenticated.");
      return;
    }
    if (image) {
      uploadMedia(image)
        .then((downloadURL) => {
          setDoc(doc(FIREBASE_DB, "users", user.uid), {
            id: user.uid,
            displayName: fullName,
            photoURL: downloadURL,
            job: job,
            age: age,
            gender: gender,
            timestamp: serverTimestamp(),
          })
            .then(() => {
              navigation.navigate("Home" as any);
            })
            .catch((error: any) => {
              alert(error.message);
            });
        })
        .catch((error: any) => {
          alert(error.message);
        });
    } else {
      alert("Please upload an image");
    }
  };

  const uploadMedia = async (uri: string): Promise<string> => {
    setUploading(true);
    try {
      // Read image as base64
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Upload to ImgBB (free, no Firebase Storage needed)
      const formData = new FormData();
      formData.append("key", IMGBB_API_KEY);
      formData.append("image", base64);

      const response = await fetch("https://api.imgbb.com/1/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error?.message || "Image upload failed");
      }

      return data.data.url as string;
    } catch (error) {
      throw error;
    } finally {
      setUploading(false);
    }
  };
  const handleSignOut = async () => {
    try {
      await FIREBASE_AUTH.signOut();
    } catch (error) {
      const err = error as any;
      Alert.alert("Error", err.message || "Failed to sign out.");
    }
  };
  const emailUsername = user?.email ? user.email.split("@")[0] : "User";
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar backgroundColor="rgb(240, 240, 240)" barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Image
          style={styles.logoImage}
          source={require("@/assets/PairUp/dating-4.1.png")}
        />
        <Text style={{ fontSize: 25, padding: 10, color: "#e33460" }}>
          W E L C O M E
        </Text>
        <Text
          style={{
            fontSize: 20,
            paddingBottom: 15,
            fontWeight: "500",
          }}
        >
          {`${emailUsername}`}
        </Text>

        <Text style={styles.stepText}>Step 1: Full Name</Text>
        <TextInput
          value={fullName}
          onChangeText={setFullName}
          style={styles.textInput}
          placeholder="Enter your full name"
        />

        <Text style={styles.stepText}>Step 2: The Profile Pic</Text>
        <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
          <Text style={styles.imagePickerButtonText}>
            Pick an image from camera roll
          </Text>
        </TouchableOpacity>
        {image && <Image source={{ uri: image }} style={styles.selectedImage} />}

        <Text style={styles.stepText}>Step 3: The Job</Text>
        <TextInput
          value={job}
          onChangeText={setJob}
          style={styles.textInput}
          placeholder="Enter your occupation"
        />

        <Text style={styles.stepText}>Step 4: The Age</Text>
        <TextInput
          value={age}
          onChangeText={setAge}
          style={styles.textInput}
          placeholder="Enter your age"
          keyboardType="numeric"
          maxLength={2}
        />

        <Text style={styles.stepText}>Step 5: Your Gender</Text>
        <View style={styles.genderRow}>
          <TouchableOpacity
            style={[
              styles.genderButton,
              gender === "male" && styles.genderButtonSelected,
            ]}
            onPress={() => setGender("male")}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.genderButtonText,
              gender === "male" && styles.genderButtonTextSelected,
            ]}>♂  Male</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.genderButton,
              gender === "female" && styles.genderButtonSelected,
            ]}
            onPress={() => setGender("female")}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.genderButtonText,
              gender === "female" && styles.genderButtonTextSelected,
            ]}>♀  Female</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          disabled={incompleteForm || uploading}
          style={[
            styles.button,
            incompleteForm && !uploading ? styles.buttonDisabled : styles.buttonActive,
          ]}
          onPress={updateUserProfile}
          activeOpacity={0.85}
        >
          {uploading ? (
            <View style={styles.buttonContent}>
              <ActivityIndicator color="white" size="small" />
              <Text style={[styles.buttonText, { marginLeft: 8 }]}>Uploading...</Text>
            </View>
          ) : (
            <Text style={styles.buttonText}>Update Profile</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(240, 240, 240)",
  },
  scrollContent: {
    alignItems: "center",
    paddingBottom: 40,
  },
  logoImage: {
    height: 100,
    width: 100,
    marginTop: 50,
  },
  selectedImage: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 10,
    borderColor: "#e33460",
    borderWidth: 2,
  },
  button: {
    width: 220,
    height: 52,
    borderRadius: 26,
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonActive: {
    backgroundColor: "#e33460",
  },
  buttonDisabled: {
    backgroundColor: "#c0c0c0",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 15,
    alignSelf: "center",
    fontWeight: "bold",
  },
  stepText: {
    padding: 8,
    fontWeight: "bold",
    color: "#e33460",
  },
  textInput: {
    padding: 8,
    fontSize: 20,
  },
  imagePickerButton: {
    backgroundColor: "#e33460",
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
  },
  imagePickerButtonText: {
    color: "white",
    fontSize: 16,
  },
  genderRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
    marginBottom: 4,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#e33460",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  genderButtonSelected: {
    backgroundColor: "#e33460",
  },
  genderButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#e33460",
  },
  genderButtonTextSelected: {
    color: "white",
  },
});

export default ModalScreen;
