import { View, Text, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import Login from './Login'
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser"; //display web browser in app for login
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, db } from '@/backend/Firebase';
import { router } from 'expo-router';
import { Route } from '@/routes';
import {
  query,
  collection,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

import { useDispatch } from "react-redux";
import { update } from "../Redux/UserDataSlice";

WebBrowser.maybeCompleteAuthSession();
const App = () => {
  const dispatch = useDispatch();
  const [userInFo, setUserInfo] = useState<Object>();
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
  }); 

  const checkUserFromLocalStorage = async () => {
    try {
      let user: string | null | object = await AsyncStorage.getItem("userInfo");
      user = user ? JSON.parse(user) : null;
      if (user != null) {
        console.log('user from local storage: ', user)
        router.push(Route.DASHBOARD)
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (response?.type === "success") {
      console.log(`Google sign-in response on ${Platform.OS}: `, response);
      try {
        const { id_token } = response.params;
        const credential = GoogleAuthProvider.credential(id_token);
        signInWithCredential(auth, credential);
      } catch (err) {
        console.log("err: ", err);
      }
    } else {
      console.log(
        `Google sign-in response type on ${Platform.OS}: `,
        response?.type
      );
    }
  }, [response]);
  
  useEffect(() => {
    checkUserFromLocalStorage();
    try {
      const unsub = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const queryForFindingUser = query(
            collection(db, "Employees"),
            where("email", "==", user.email)
          );
          const querySnapshot = await getDocs(queryForFindingUser);
  
          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            const userRef = doc(db, "Employees", userDoc.id);
  
            // Update the photoURL in the backend
            await updateDoc(userRef, { photoURL:user.photoURL });
  
            // Dispatch the updated user data
            const updatedUserData = {
              ...userDoc.data(),
              photoURL:user.photoURL,
            };
            dispatch(update(updatedUserData));
            // dispatch(update(userDoc.data()));
          }
            console.log("user", JSON.stringify(user));
          await AsyncStorage.setItem("userInfo", JSON.stringify(user));
          router.push(Route.DASHBOARD)
        } else {
          setUserInfo("");
          console.log("no one is logged in");
        }
      });
      ()=>unsub();
    } catch (err) {
      console.log("err: ", err);
    }
  }, []);
  return (
      <Login promptAsync={() => promptAsync()}/>
  )
}

export default App