import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import colors from "../../colors";
import { db } from "@/backend/Firebase";
import { ProjectData, updateNewProject } from "@/Redux/projectSlice";
import {
  getDocs,
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
} from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/Redux/store";
import DatePicker from "react-native-date-picker";

export interface TimeSheetDataType {
  projectName: string;
  description: string;
  time: string;
}
export const TimeSheet = () => {
  const [timeSheetDate, setTimeSheetDate] = useState<Date>(new Date());
  const [isAttendanceMarked, setIsAttendanceMarked] = useState(false);
  const userId = useSelector((state: RootState) => state.userData.id);
  const [timeSheet, setTimeSheet] = useState<TimeSheetDataType[]>([]);
  const project = useSelector(
    (state: RootState) => state.projectData.projectData
  );
  const [timeSheetData, setTimeSheetData] = useState<TimeSheetDataType>({
    projectName: "",
    description: "",
    time: "",
  });
  const dispatch = useDispatch();
  useEffect(() => {
    const projectsQuery = query(
      collection(db, "Projects"),
      where("employeeId", "==", userId)
    );

    const unsubscribe = onSnapshot(
      projectsQuery,
      (snapshot) => {
        const projectsData = snapshot.docs.map((doc) => doc.data());

        dispatch(updateNewProject(projectsData));
      },
      (error) => {
        console.error("Error fetching projects: ", error);
      }
    );

    // Clean up the subscription on unmount
    return () => unsubscribe();
  }, [dispatch, userId]);
  function handleChange(name: string, value: string) {
    setTimeSheetData((prevstate) => ({
      ...prevstate,
      [name]: value,
    }));
  }

  async function saveTimeSheet() {
    console.log("timeSheetData", timeSheetData);
    await addDoc(collection(db, "Timesheet"), {
      employeeId: userId,
      date: timeSheetDate.toLocaleDateString().split("T")[0],
      ...timeSheetData,
    });
    const tempTimeSheetArray = [];
    tempTimeSheetArray.push(timeSheetData);
    setTimeSheet(tempTimeSheetArray);
    setTimeSheetData({
      projectName: "",
      description: "",
      time: "",
    });
  }
  const getPreviousBusinessDay = (date: Date) => {
    const day = date.getDay();
    const prevBusinessDay = new Date(date);

    if (day === 0) {
      // Sunday
      prevBusinessDay.setDate(date.getDate() - 2); // Go back to Friday
    } else if (day === 1) {
      // Monday
      prevBusinessDay.setDate(date.getDate() - 3); // Go back to Friday
    } else {
      // Any other day
      prevBusinessDay.setDate(date.getDate() - 1); // Go back to the previous day
    }

    return prevBusinessDay;
  };
  const today = new Date(); //"2024-07-15" monday
  const yesterday = getPreviousBusinessDay(today);
  async function markAttendance(attendanceType: string) {
    try {
      await addDoc(collection(db, "Attendance"), {
        date: new Date().toLocaleDateString().split("T")[0],
        employeeId: userId,
        attendanceType: attendanceType,
      });
    } catch (err) {
      console.log("err: ", err);
    }
  }
  return (
    <ScrollView className="flex-1 bg-[#f3f4f6]">
      <View style={styles.header}>
        <Text style={styles.headerText}>Log Timesheet</Text>
      </View>
      {timeSheet.length === 0 && (
        <View className="bg-red-200 mx-3 p-4">
          <Text className="text-red-800 text-md">
            To Mark today's Attendance
          </Text>
          <Text className="text-red-800 text-md">
            Kindly Fill TimeSheet for {yesterday.toDateString()}
          </Text>
        </View>
      )}
      {!isAttendanceMarked && timeSheet.length !== 0 && (
        <View className="flex-1 flex-row gap-7 m-2">
          <TouchableOpacity
            className="p-2 px-4 rounded-lg "
            style={{ backgroundColor: colors.buttonSave }}
            onPress={() => {
              setIsAttendanceMarked(true);
              markAttendance("Work from Office");
            }}
          >
            <Text className="text-white">Working From Office</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="p-2 px-4 rounded-lg "
            style={{ backgroundColor: colors.textNoData }}
            onPress={() => {
              setIsAttendanceMarked(true);
              markAttendance("Work from Home");
            }}
          >
            <Text className="text-white">Working From Home</Text>
          </TouchableOpacity>
        </View>
      )}

      {isAttendanceMarked && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>
            Your attendance is marked for today.
          </Text>
        </View>
      )}

      <View style={styles.datePickerContainer}>
        <DatePicker
          mode="date"
          date={timeSheetDate}
          className="h-[100]"
          maximumDate={new Date()}
          onDateChange={setTimeSheetDate}
        />
      </View>

      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText} className="text-center">
          Projects
        </Text>
        <Text style={styles.tableHeaderText} className="text-right">
          Description
        </Text>
        <Text style={[styles.tableHeaderText, styles.textRight]}>Time</Text>
      </View>

      <View style={styles.tableRow}>
        <View style={styles.projectCell}>
          <Picker
            selectedValue={timeSheetData.projectName}
            onValueChange={(value) => handleChange("projectName", value)}
            itemStyle={{ height: 50, width: 150, fontSize: 12 }}
          >
            <Picker.Item label={"Select Project"} value={"Select Project"} />
            {project.map((p, index) => (
              <Picker.Item key={index} label={p.title} value={p.title} />
            ))}
          </Picker>
        </View>
        <TextInput
          value={timeSheetData.description}
          onChangeText={(value) => handleChange("description", value)}
          multiline
          style={styles.descriptionInput}
        />
        <TextInput
          value={timeSheetData.time}
          onChangeText={(value) => handleChange("time", value)}
          keyboardType="numeric"
          style={styles.hoursInput}
        />
      </View>

      <TouchableOpacity
        style={[
          styles.saveButton,
          (timeSheetData.description === "" ||
            timeSheetData.time === "" ||
            timeSheetData.projectName === "Select Project") &&
            styles.saveButtonDisabled,
        ]}
        onPress={saveTimeSheet}
        disabled={
          timeSheetData.description === "" ||
          timeSheetData.time === "" ||
          timeSheetData.projectName === "Select Project"
        }
      >
        <Text
          style={[
            styles.saveButtonText,
            (timeSheetData.description === "" ||
              timeSheetData.time === "" ||
              timeSheetData.projectName === "Select Project") &&
              styles.saveButtonTextDisabled,
          ]}
        >
          Save
        </Text>
      </TouchableOpacity>

      <View style={styles.logSection}>
        <Text style={styles.logTitle}>
          {`Your Log Timesheet for ${new Date().getDate()}-${new Date().getUTCMonth()}-${new Date().getFullYear()}`}
        </Text>
        <View className="flex-row overflow-scroll">
          <View
            className="flex-col p-6 gap-9 border-r"
            style={{
              backgroundColor: colors.backgroundTableHeader,
              borderRightColor: colors.borderPrimary,
            }}
          >
            <Text style={styles.tableHeaderText}>Date</Text>
            <Text style={styles.tableHeaderText}>Project Name</Text>
            <Text style={styles.tableHeaderText}>Description</Text>
            <Text style={[styles.tableHeaderText]}>Total Hours</Text>
          </View>
          <View style={styles.tableRow}>
            {timeSheet.length === 0 ? (
              <Text style={styles.noDataText}>No data found</Text>
            ) : (
              <View className="flex-1 flex-col gap-9">
                <Text>{timeSheetDate.toLocaleDateString().split("T")[0]}</Text>
                {timeSheet.map((element, index) => (
                  <View key={index}>
                    <Text className="flex-1">{element.projectName}</Text>
                    <Text>{element.description}</Text>
                    <Text>{element.time}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
export default TimeSheet;
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
    justifyContent: "center",
    alignItems: "center",
  },
  datePicker: {
    height: 100,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: "center",
    borderRadius: 8,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.backgroundTableHeader,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderPrimary,
    gap: 9,
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
    gap: 9,
  },
  projectCell: {
    flex: 1,
  },
  projectPicker: {
    height: 50,
    // backgroundColor: "red",
    color: "yellow",
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
  saveButtonDisabled: {
    backgroundColor: "#6b7280", // Gray color when disabled
  },
  saveButtonTextDisabled: {
    opacity: 0.5, // Make text opaque when disabled
  },
});
