import { View, Text, StatusBar } from "react-native";
import React from "react";
import { Slot } from "expo-router";
import { Provider } from "react-redux";
import { store } from "@/Redux/store";


const main = () => {
  <StatusBar barStyle={"light-content"} />;
  return (
    <Provider store={store}>
      <Slot />
    </Provider>
  );
};

export default main;
