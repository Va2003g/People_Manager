import { View, Text, StyleSheet, Pressable, Button } from "react-native";
import React from "react";
import colors from "../colors";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { useFonts } from "expo-font";
// import { Roboto_500Medium, Roboto_700Bold } from "@expo-google-fonts/roboto";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { router } from "expo-router";
import { auth } from "../backend/Firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signOut } from "firebase/auth";
import { Route } from "@/routes";
// import { observer } from "mobx-react";
// import { Store } from "@/MobX/store";
export const CustomDrawer = (props: DrawerContentComponentProps) => {
  // console.log('user',Store.User.displayName);
  // const [fontsLoaded, fontError] = useFonts({
  //   Roboto_700Bold,Roboto_500Medium
  // });

  // if (!fontsLoaded && !fontError) {
  //   return null;
  // }
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <LinearGradient
          colors={[colors.primaryDashboard, colors.primaryDashboard2]}
          style={styles.gradientWindow}
        >
          {/* Typescript error user is of type object */}
          {/* <Image source={Store.User.photoURL} style={styles.image} />
          <Text style={styles.name}>{Store.User.displayName}</Text> */}
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
                    {/* {drawerLabel is string or a function which returns React Node containing two things or props} */}
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
              // console.log('AsyncStorage',AsyncStorage.getAllKeys());
              await signOut(auth);
              router.push('/');
            }}
          />
        </Pressable>
      </View>
    </View>
  );
};
//observer will make this component to render whenever store data changes..
export default CustomDrawer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  content: {
    flex: 6,
    paddingLeft:20,
    gap:23,
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
