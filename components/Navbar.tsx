import { View, Text, Pressable, StyleSheet } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { hamburger, Search, Bell } from "../assets/images";
import colors from "../colors";
import { Image } from "expo-image";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import { DrawerHeaderProps } from "@react-navigation/drawer";

export const Navbar = (props:DrawerHeaderProps) => {
  // console.log('props: ', props.options.title) 
  const navigation = useNavigation();
  return (
    <LinearGradient
      colors={[colors.primaryDashboard, colors.primaryDashboard2]}
      style={styles.navbarGradient}
    >
      <View style={styles.textContainer}>
        <Pressable
          onPress={() => {
            navigation.dispatch(DrawerActions.openDrawer());
          }}
        >
          <Image source={hamburger} style={styles.drawerIcon} />
        </Pressable>
      {/* props.options.title contains the drawer title names */}
        <Text style={styles.text}>{props.options.title}</Text>
      </View>
      <View style={styles.images}>
        {/* <Pressable onPress={()=>Store.setShowSearch()}> */}
          <Image source={Search} style={styles.logo}/>
        {/* </Pressable> */}
        <Image source={Bell} style={styles.logo} />
      </View>
    </LinearGradient>
  );
};

export default Navbar;

const styles = StyleSheet.create({
  drawerIcon: {
    width: 29,
    height: 20,
  },
  textContainer: {
    flex: 2,
    justifyContent: "space-evenly",
    flexDirection: "row",
    alignItems: "baseline",
  },
  text: {
    fontFamily: "Roboto_700Bold",
    fontSize: 27,
    color: "white",
  },
  images: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  logo: {
    width: 30,
    height: 30,
  },
  navbarGradient: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    paddingBottom: 16,
    borderBottomRightRadius: 25,
    borderBottomLeftRadius: 25,
    height: 130,
  },
});
