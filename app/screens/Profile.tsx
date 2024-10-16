import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/Redux/store";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { updateUserData } from "@/Redux/UserDataSlice"; // Assuming you have this action creator
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/backend/Firebase";

const Profile = () => {
  const dispatch = useDispatch();
  const User = useSelector((state: RootState) => state.userData.data);
  const userId = useSelector((state: RootState) => state.userData.id);
  const [phoneNumber, setPhoneNumber] = useState(User.contactNo);
  const [photoURL, setPhotoURL] = useState(User.photoURL);
  const [isEditingPhone, setIsEditingPhone] = useState(false);

  const handleUpdatePhoneNumber = async () => {
    setIsEditingPhone(true);
    if (isEditingPhone) {
      try {
        const userDocRef = doc(db, "Employees", userId);
        await updateDoc(userDocRef, { contactNo: phoneNumber });

        // Dispatch the updated contact number to Redux store
        dispatch(updateUserData({ contactNo: phoneNumber }));

        Alert.alert(
          "Phone Number Updated",
          "Your phone number has been successfully updated."
        );
      } catch (error) {
        console.error("Error updating phone number: ", error);
        Alert.alert(
          "Error",
          "There was an issue updating your phone number. Please try again."
        );
      } finally {
        setIsEditingPhone(false);
      }
    } else {
      setIsEditingPhone(true);
    }
  };

  const InfoItem = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.infoItem}>
      <Text style={styles.infoLabel}>{label}:</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Image
            source={photoURL}
            style={styles.profileImage}
            contentFit="cover"
          />
        </TouchableOpacity>
        <Text style={styles.name}>{User.firstName + " " + User.lastName}</Text>
        <Text style={styles.email}>{User.email}</Text>
      </View>

      <View style={styles.infoContainer}>
        <InfoItem label="Role" value={User.role} />
        <InfoItem label="Date of Joining" value={User.dateOfJoining} />
        <InfoItem label="Country" value={User.country} />
        <InfoItem label="State" value={User.state} />
        <InfoItem label="City" value={User.city} />
        <InfoItem label="Postal Code" value={User.postalCode} />
        <InfoItem label="Address" value={User.address} />

        <View style={styles.phoneContainer}>
          <Text style={styles.infoLabel} className="mr-9">
            Phone Number:
          </Text>
          {isEditingPhone ? (
            <TextInput
              style={styles.phoneInput}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
          ) : (
            <Text style={styles.infoValue}>{phoneNumber}</Text>
          )}
          <TouchableOpacity
            style={styles.phoneButton}
            onPress={handleUpdatePhoneNumber}
          >
            <Text style={styles.phoneButtonText}>
              {isEditingPhone ? "Save" : "Edit"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
  changePhotoText: {
    color: "#3498db",
    textAlign: "center",
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: "#666",
  },
  infoContainer: {
    padding: 20,
    gap: 19,
  },
  infoItem: {
    flexDirection: "row",
    marginBottom: 10,
    gap: 41,
  },
  infoLabel: {
    fontWeight: "bold",
    width: 150,
    fontSize: 20,
  },
  infoValue: {
    flex: 1,
    fontSize: 20,
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  phoneInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 5,
    marginRight: 10,
  },
  phoneButton: {
    backgroundColor: "#3498db",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  phoneButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default Profile;
