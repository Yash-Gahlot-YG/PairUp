import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";

const Header = ({ title, callEnabled, titleStyle }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back-ios-new" size={30} color="#e33460" />
      </TouchableOpacity>
      <Text style={[styles.titleText, titleStyle]}>{title}</Text>
      {callEnabled && (
        <TouchableOpacity style={styles.telephoneIcon}>
          <Foundation name="telephone" size={24} color="red" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 11,
    // backgroundColor: "grey
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    padding: 2,
  },
  telephoneIcon: {
    backgroundColor: "rgba(227, 52, 96, 0.3)",
    borderRadius: 40,
    width: 40,
    height: 40,
    padding: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
