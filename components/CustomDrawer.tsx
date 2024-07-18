import { View, Text, StyleSheet, Pressable, Button } from "react-native";
import React, { useEffect } from "react";
import colors from "../colors";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { router } from "expo-router";
import { auth } from "../backend/Firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signOut } from "firebase/auth";
import { Route } from "@/routes";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/store";
export const CustomDrawer = (props: DrawerContentComponentProps) => {
  const User = useSelector((state:RootState)=>state.userData.data)
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <LinearGradient
          colors={[colors.primaryDashboard, colors.primaryDashboard2]}
          style={styles.gradientWindow}
        >
          <Image source={User.photoURL} style={styles.image} />
          <Text style={styles.name}>{User.firstName + ' ' + User.lastName}</Text>
        </LinearGradient>
        <View style={styles.content}>
          {props.state.routes.map((routeName, index) => {
            const focused = props.state.index === index;
            const { drawerLabel } = props.descriptors[routeName.key].options;

            return (
              <Pressable
                key={index}
                onPress={() => router.navigate(`screens/${routeName.name}`)}
              >
                {focused ? (
                  <LinearGradient
                    colors={[colors.primaryDashboard, colors.primaryDashboard2]}
                    style={styles.drawerGradient}
                  >
                    <Text style={styles.name}>{drawerLabel?.toString()}</Text>
                  </LinearGradient>
                ) : (
                  <View style={styles.drawerItemContainer}>
                    <Text style={[styles.name,{ color: "black"}]}>
                      {drawerLabel?.toString()}
                    </Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </View>
      <View>
        <Pressable style={{ marginBottom: 15 }}>
          <Button
            title="Log Out"
            onPress={async () => {
              await AsyncStorage.clear();
              await AsyncStorage.removeItem('TaskData');
              await signOut(auth);
              router.push('/');
            }}
          />
        </Pressable>
      </View>
    </View>
  );
};
export default CustomDrawer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  content: {
    flex: 6,
    paddingLeft:20,
    gap:15,
  },
  contentContainer: {
    flex: 5,
    gap:15,
  },
  drawerGradient: {
    padding: 13,
    width:150,
    borderRadius:13,
    alignItems:'center'
  },
  drawerItemContainer: {
    padding: 13,
  },
  gradientWindow: {
    flex: 1,
    borderBottomRightRadius: 25,
    borderBottomLeftRadius: 25,
    justifyContent: "center",
    paddingLeft: 29,
    paddingTop: 40,
    gap: 10,
  },
  image: {
    width: 46,
    height: 46,
    borderRadius: 50,
  },
  name: {
    fontFamily: "Roboto_500Medium",
    color: "white",
    fontSize: 20,
    fontWeight:'500',
  },
});
