import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
  StatusBar,
} from "react-native";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { FIREBASE_DB, FIREBASE_AUTH, FIREBASE_STORAGE } from "@/FirebaseConfig";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const ModalScreen = () => {
  const user = FIREBASE_AUTH.currentUser;
  const navigation = useNavigation();
  const [image, setImage] = useState<string | null>(null);
  const [job, setJob] = useState<string | null>(null);
  const [age, setAge] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [fullName, setFullName] = useState<string | null>(null);

  const incompleteForm = !job || !age || !fullName;

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
    if (image) {
      uploadMedia(image)
        .then((downloadURL) => {
          setDoc(doc(FIREBASE_DB, "users", user.uid), {
            id: user.uid,
            displayName: fullName,
            photoURL: downloadURL,
            job: job,
            age: age,
            timestamp: serverTimestamp(),
          })
            .then(() => {
              navigation.navigate("Home");
            })
            .catch((error) => {
              alert(error.message);
            });
        })
        .catch((error) => {
          alert(error.message);
        });
    } else {
      alert("Please upload an image");
    }
  };

  const uploadMedia = async (uri: string) => {
    setUploading(true);
    try {
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
          resolve(xhr.response);
        };
        xhr.onerror = () => {
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null);
      });

      const filename = uri.substring(uri.lastIndexOf("/") + 1);
      const storageRef = ref(FIREBASE_STORAGE, `images/${filename}`);
      const uploadTask = uploadBytesResumable(storageRef, blob as Blob);
      return new Promise<string>((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          null,
          (error) => {
            setUploading(false);
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setUploading(false);
              Alert.alert("Photo Uploaded!!!");
              setImage(null);
              resolve(downloadURL);
            });
          }
        );
      });
    } catch (error) {
      setUploading(false);
      throw error;
    }
  };

  const emailUsername = user?.email ? user.email.split("@")[0] : "User";
  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <StatusBar backgroundColor="rgb(240, 240, 240)" barStyle="dark-content" />
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

      <TouchableOpacity
        disabled={incompleteForm}
        style={[
          styles.button,
          { backgroundColor: incompleteForm ? "grey" : "#e33460" },
        ]}
        onPress={updateUserProfile}
      >
        <Text style={styles.buttonText}>Update Profile</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    top: -40,
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
    padding: 14,
    width: 180,
    height: 50,
    borderRadius: 10,
    marginTop: 30,
    justifyContent: "center",
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
});

export default ModalScreen;
