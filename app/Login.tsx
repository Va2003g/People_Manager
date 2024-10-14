import { View, Text, Pressable } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";

import { hero, logo, Google } from "../assets/images";
import { AuthSessionResult } from "expo-auth-session";
import colors from "@/colors";

type promptAsyncProp = {
  promptAsync: () => Promise<AuthSessionResult>;
};
const Login = ({ promptAsync }: promptAsyncProp) => {
  return (
    <LinearGradient
      className="flex-1"
      colors={[colors.gradientLogin, colors.gradient2Login]}
      locations={[0.999, 1]}
    >
      <View className="flex-1">
        <View className="flex-1 justify-end items-center">
          <Image
            source={hero}
            style={{ height: 210, width: 560 }}
            contentFit="contain"
          />
        </View>
        <View className="flex-1 pl-[30] pr-[30]">
          <Image
            // source={logo}
            style={{ height: 100, width: 200 }}
            contentFit="contain"
          />
          <Text className="message text-[#232324] text-[25.2px] flex-2 font-[600] leading-[37.8px] tracking-[0.10499993711709976px] text-left top-[-22]">
            Log In to Your Account
          </Text>
          <Pressable
            className="flex-row bg-[#FC5A5A] w-[338] h-[50] justify-center flex-3 items-center rounded-xl gap-2 cursor-pointer hover:bg-red-500 pt-[-10]"
            onPress={promptAsync}
          >
            <Image
              source={Google}
              style={{ height: 40, width: 15 }}
              contentFit="contain"
            />
            <Text className="text-white text-lg font-[600] -mt-6">
              Continue with Google
            </Text>
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
};

export default Login;
