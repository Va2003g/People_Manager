import { View, Text, StyleSheet, Pressable } from "react-native";
import React, { useEffect } from "react";
import {
  AntDesign,
  Entypo,
  FontAwesome,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { router } from "expo-router";
import { Route } from "@/routes";

export const Dashboard = () => {
  useEffect(()=>{
    
  },[])
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <AntDesign name="infocirlceo" style={styles.infoIcon} />
        <FontAwesome
          name="folder"
          style={[styles.mainIcon, { color: "brown" }]}
        />
        <Text style={styles.text}>Projects</Text>
      </View>
      <Pressable style={styles.card} onPress={()=>router.push(Route.PROFILE)}>
        <AntDesign name="infocirlceo" style={styles.infoIcon} />
        <FontAwesome5
          name="user-tie"
          style={[styles.mainIcon, { color: "blue" }]}
        />
        <Text style={styles.text}>Profile</Text>
      </Pressable>
      <Pressable style={styles.card} onPress={()=>router.push(Route.TIME_SHEET)}>
        <AntDesign name="infocirlceo" style={styles.infoIcon} />
        <AntDesign
          name="clockcircle"
          style={[styles.mainIcon, { color: "orange" }]}
        />
        <Text style={styles.text}>Time Sheet</Text>
      </Pressable>
      <View style={styles.card}>
        <AntDesign name="infocirlceo" style={styles.infoIcon} />
        <FontAwesome5
          name="calendar-minus"
          style={[styles.mainIcon, { color: "green" }]}
        />
        <Text style={styles.text}>Leave Tracker</Text>
      </View>
      <View style={styles.card}>
        <AntDesign name="infocirlceo" style={styles.infoIcon} />
        <FontAwesome
          name="calendar-check-o"
          style={[styles.mainIcon, { color: "gold" }]}
        />
        <Text style={styles.text}>Attendance</Text>
      </View>
      <View style={styles.card}>
        <AntDesign name="infocirlceo" style={styles.infoIcon} />
        <MaterialCommunityIcons
          name="receipt"
          style={[styles.mainIcon, { color: "red" }]}
        />
        <Text style={styles.text}>Pay Roll</Text>
      </View>
      <View style={styles.card}>
        <AntDesign name="infocirlceo" style={styles.infoIcon} />
        <Ionicons
          name="receipt-outline"
          style={[styles.mainIcon, { color: "darkred" }]}
        />
        <Text style={styles.text}>Download PaySlip</Text>
      </View>
      <View style={styles.card}>
        <AntDesign name="infocirlceo" style={styles.infoIcon} />
        <Entypo
          name="megaphone"
          style={[styles.mainIcon, { color: "limegreen" }]}
        />
        <Text style={styles.text}>Announcements</Text>
      </View>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent:'space-around',
    alignContent:'space-around'
  },
  card: {
    width: 153,
    height: 150,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  infoIcon: {
    position: "absolute",
    top: 10,
    left: 10,
    opacity: 0.7,
    fontSize: 20,
  },
  mainIcon: {
    fontSize: 40,
    marginVertical: 20,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
