import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "react-native-date-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { RootState } from "@/Redux/store";
import { useSelector } from "react-redux";
import { db } from "@/backend/Firebase";
import { addDoc, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";

interface LeaveFormType {
  leaveType: string;
  date: string;
  reason?: string;
  status: "Pending" | "Approved" | "Rejected";
  employeeId: string;
}

const ApplyLeaves = () => {
  const [formData, setFormData] = useState<LeaveFormType>({
    leaveType: "",
    date: "",
    reason: "",
    status: "Pending",
    employeeId: "",
  });

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const userId = useSelector((state: RootState) => state.userData.id);

  const onDateChange = (selectedDate: Date) => {
    console.log("selectedDate: ", selectedDate.toLocaleDateString());
    console.log("selectedTime: ", selectedDate.toLocaleTimeString());
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };
  const handleInputChange = (name: string, value: any) => {
    setFormData({ ...formData, [name]: value });
  };

  const applyLeave = async () => {
    try {
      // Add leave to the Leaves collection
      await addDoc(collection(db, "Leaves"), {
        ...formData,
        employeeId: userId,
        date: date.toLocaleDateString(), // Ensure the date is correctly formatted
      });
  
      // Query the Leaves Data collection for the current employee
      const leaveQuery = query(collection(db, "Leaves Data"), where("EmployeeId", "==", userId));
      const leaveDataSnap = await getDocs(leaveQuery);
  
      // Check if there is any matching document
      if (!leaveDataSnap.empty) {
        leaveDataSnap.forEach(async (doc) => {
          const leaveData = doc.data();
          const updatedLeaveCount = leaveData[`${formData.leaveType}Left`] - 1;
          
          // Update the leave count for the user
          await updateDoc(doc.ref, {
            [`${formData.leaveType}Left`]: updatedLeaveCount,
          });
        });
      } else {
        console.log("No matching document found");
      }
    } catch (error) {
      console.error("Error applying leave: ", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Leave Application Form</Text>
      <Text style={styles.subtitle}>
        Please provide information about your leave.
      </Text>

      <Text style={styles.label}>Leave Type:</Text>
      <Picker
        selectedValue={formData.leaveType}
        onValueChange={(value) => handleInputChange("leaveType", value)}
        style={styles.picker}
      >
        <Picker.Item label="Choose leave type..." value="" />
        <Picker.Item label="Sick Leave" value="Sick" />
        <Picker.Item label="Paid Leave" value="Paid" />
        <Picker.Item label="Unpaid Leave" value="Unpaid" />
      </Picker>

      <Text style={styles.label}>Select Date:</Text>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowDatePicker(!showDatePicker)}
      >
        <Text style={styles.dateButtonText}>{date.toLocaleDateString()}</Text>
        <MaterialIcons name="date-range" size={24} color="#999" />
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          date={date}
          mode="date"
          onDateChange={onDateChange}
          className="mx-auto"
          minimumDate={new Date()}
        />
      )}

      {formData.leaveType !== "Sick" && formData.leaveType !== "" && (
        <>
          <Text style={styles.label}>Reason:</Text>
          <TextInput
            style={styles.textInput}
            multiline
            numberOfLines={4}
            placeholder="Enter reason..."
            value={formData.reason}
            onChangeText={(text) => handleInputChange("reason", text)}
          />
        </>
      )}

      <TouchableOpacity style={styles.applyButton} onPress={applyLeave}>
        <Text style={styles.applyButtonText}>Apply leave</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ApplyLeaves;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
  },
  picker: {
    //   height: 100,
    //   marginTop:-45,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  dateButtonText: {
    fontSize: 16,
    color: "#333",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    textAlignVertical: "top",
  },
  uploadContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  uploadText: {
    fontSize: 16,
    color: "#666",
  },
  uploadButton: {
    backgroundColor: "#5cb85c",
    padding: 10,
    borderRadius: 5,
  },
  uploadButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  applyButton: {
    backgroundColor: "#5cb85c",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
