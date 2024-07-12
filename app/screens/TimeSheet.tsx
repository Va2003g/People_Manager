import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import colors from '../../colors'

const TimeSheet = () => {
  const [selectedDate, setSelectedDate] = useState("Today");
  const [projects, setProjects] = useState([
    { id: 1, name: "", description: "", hours: "", notWorked: false },
    { id: 2, name: "", description: "", hours: "", notWorked: false },
    { id: 3, name: "", description: "", hours: "", notWorked: false },
    { id: 4, name: "", description: "", hours: "", notWorked: false },
    { id: 5, name: "", description: "", hours: "", notWorked: false },
  ]);

//   const updateProject = (id, field, value) => {
//     setProjects(
//       projects.map((project) =>
//         project.id === id ? { ...project, [field]: value } : project
//       )
//     );
//   };
  return (
    <ScrollView className="flex-1 bg-[#f3f4f6]">
      <View style={styles.header}>
        <Text style={styles.headerText}>Log Timesheet</Text>
      </View>

      <View style={styles.banner}>
        <Text style={styles.bannerText}>
          Your attendance is marked for today as Working From Office.
        </Text>
      </View>

      <View style={styles.datePickerContainer}>
        <Picker
          selectedValue={selectedDate}
          onValueChange={(itemValue) => setSelectedDate(itemValue)}
          style={styles.datePicker}
        >
          <Picker.Item label="Today" value="Today" />
          <Picker.Item label="yesterday" value="yesterday" />
          <Picker.Item label="yesterday" value="yesterday" />
          {/* Add more date options here */}
        </Picker>
      </View>

      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText}>Projects</Text>
        <Text style={styles.tableHeaderText}>Description/Reason</Text>
        <Text style={[styles.tableHeaderText, styles.textRight]}>
          Total hours
        </Text>
      </View>

      {projects.map((project) => (
        <View key={project.id} style={styles.tableRow}>
          <View style={styles.projectCell}>
            <Picker
              selectedValue={project.name}
            //   onValueChange={(value) =>
            //     // updateProject(project.id, "name", value)
            //   }
              style={styles.projectPicker}
            >
              <Picker.Item label="Select Project" value="" />
              {/* Add project options here */}
            </Picker>
            <View style={styles.checkboxContainer}>
              <Text style={styles.checkboxText}>
                Check if not worked on project.
              </Text>
              {/* Implement checkbox here */}
            </View>
          </View>
          <TextInput
            value={project.description}
            // onChangeText={(value) =>
            // //   updateProject(project.id, "description", value)
            // }
            multiline
            style={styles.descriptionInput}
          />
          <TextInput
            value={project.hours}
            // onChangeText={(value) => updateProject(project.id, "hours", value)}
            keyboardType="numeric"
            style={styles.hoursInput}
          />
        </View>
      ))}

      <TouchableOpacity
        style={styles.saveButton}
        onPress={() => console.log("Save pressed")}
      >
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>

      <View style={styles.logSection}>
        <Text style={styles.logTitle}>
          Your Log Timesheet for 12th Jul 2024
        </Text>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Date</Text>
          <Text style={styles.tableHeaderText}>Project Name</Text>
          <Text style={styles.tableHeaderText}>Description</Text>
          <Text style={[styles.tableHeaderText, styles.textRight]}>
            Total Hours
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.noDataText}>No data found</Text>
        </View>
      </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundPrimary,
    },
    header: {
      backgroundColor: colors.backgroundSecondary,
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderPrimary,
    },
    headerText: {
      fontSize: 20,
      fontWeight: "bold",
    },
    banner: {
      backgroundColor: colors.backgroundBanner,
      padding: 16,
      margin: 16,
      borderRadius: 8,
    },
    bannerText: {
      color: colors.textBanner,
    },
    datePickerContainer: {
      margin: 16,
    },
    datePicker: {
      height: 100,
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 8,
    },
    tableHeader: {
      flexDirection: "row",
      backgroundColor: colors.backgroundTableHeader,
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderPrimary,
    },
    tableHeaderText: {
      flex: 1,
      fontWeight: "bold",
    },
    tableRow: {
      flexDirection: "row",
      backgroundColor: colors.backgroundSecondary,
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderPrimary,
    },
    projectCell: {
      flex: 1,
    },
    projectPicker: {
      height: 40,
    },
    checkboxContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 8,
    },
    checkboxText: {
      fontSize: 12,
    },
    descriptionInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: colors.borderPrimary,
      borderRadius: 4,
      padding: 8,
    },
    hoursInput: {
      width: 50,
      borderWidth: 1,
      borderColor: colors.borderPrimary,
      borderRadius: 4,
      padding: 8,
      textAlign: "center",
    },
    saveButton: {
      backgroundColor: colors.buttonSave,
      padding: 16,
      margin: 16,
      borderRadius: 8,
      alignItems: "center",
    },
    saveButtonText: {
      color: colors.backgroundSecondary,
      fontWeight: "bold",
    },
    logSection: {
      margin: 16,
    },
    logTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 16,
    },
    textRight: {
      textAlign: "right",
    },
    noDataText: {
      flex: 1,
      textAlign: "center",
      color: colors.textNoData,
    },
  });
export default TimeSheet;
