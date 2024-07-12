import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import {Navbar,CustomDrawer} from '../../components'
import { DrawerContentComponentProps, DrawerHeaderProps } from "@react-navigation/drawer";
import { StatusBar } from "react-native";
const DrawerLayout = () => {
  <StatusBar barStyle={'light-content'}/>
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        initialRouteName="screens/Dashboard"
        drawerContent={(props: DrawerContentComponentProps)=>{
          return <CustomDrawer {...props}/>
        }}
        screenOptions={{
          header: (props: DrawerHeaderProps) => {
            return <Navbar {...props}/>
          },
        }}
      >
        <Drawer.Screen
          name="Dashboard" options={{
            drawerLabel: "Dashboard",
            title: "Dashboard",
          }}
        />
        <Drawer.Screen
          name="TimeSheet"
          options={{
            drawerLabel: "TimeSheet",
            title: "TimeSheet",
          }}
        />
        <Drawer.Screen
          name="Profile"
          options={{
            drawerLabel: "Profile",
            title: "Profile",
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
};

export default DrawerLayout;

