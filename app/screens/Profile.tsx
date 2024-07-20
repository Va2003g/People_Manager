// import { View, Text } from "react-native";
// import React from "react";
// import { RootState } from "@/Redux/store";
// import { useSelector } from "react-redux";
// import { Image } from "expo-image";

// const Profile = () => {
//   const User = useSelector((state: RootState) => state.userData.data);
//   console.log("User: ", User);
//   return (
//     <View>
//       <Text>Profile</Text>
//       <Image source={User.photoURL} className="h-10 w-10 rounded-full" />
//       <Text>{User.firstName + " " + User.lastName}</Text>
//     </View>
//   );
// };

// export default Profile;
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/Redux/store';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { updateUserData } from '@/Redux/UserDataSlice'; // Assuming you have this action creator

const Profile = () => {
  const dispatch = useDispatch();
  const User = useSelector((state: RootState) => state.userData.data);
  
  const [phoneNumber, setPhoneNumber] = useState(User.contactNo);
  const [photoURL, setPhotoURL] = useState(User.photoURL);

  const handleUpdateProfile = () => {
    // Here you would typically make an API call to update the user's data
    // For this example, we'll just update the Redux state
    dispatch(updateUserData({ contactNo: phoneNumber, photoURL: photoURL }));
    Alert.alert('Profile Updated', 'Your profile has been successfully updated.');
  };

  const handleChoosePhoto = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission required', 'You need to grant camera roll permissions to change your photo.');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setPhotoURL(pickerResult.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleChoosePhoto}>
        <Image 
          source={photoURL} 
          style={styles.profileImage}
          contentFit="cover"
        />
        <Text style={styles.changePhotoText}>Change Photo</Text>
      </TouchableOpacity>

      <Text style={styles.name}>{User.firstName + " " + User.lastName}</Text>
      <Text style={styles.email}>{User.email}</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
        <Text style={styles.buttonText}>Update Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
  changePhotoText: {
    color: '#3498db',
    textAlign: 'center',
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Profile;
