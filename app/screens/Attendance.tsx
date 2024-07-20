import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import { query, collection, where, onSnapshot } from "firebase/firestore";
import { db } from "@/backend/Firebase"; // Adjust the import according to your project structure
import { RootState } from "@/Redux/store"; // Adjust the import according to your project structure
import { LeaveFormType } from "./(leaves)/ApplyLeaves"; // Adjust the import according to your project structure

interface AttendanceType {
  date: string;
  employeeId: string;
  attendanceType: string;
  id: string;
}
interface LeaveFormTypeWithId extends LeaveFormType {
  id: string;
}

const Attendance = () => {
  const [attendance, setAttendance] = useState<AttendanceType[]>([]);
  const [leaves, setLeaves] = useState<LeaveFormType[]>([]);
  const userId = useSelector((state: RootState) => state.userData.id);

  useEffect(() => {
    if (!userId) return;

    const attendanceQuery = query(
      collection(db, "Attendance"),
      where("employeeId", "==", userId)
    );

    const unsubscribe = onSnapshot(
      attendanceQuery,
      (snapshot) => {
        const attendanceData = snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as AttendanceType)
        );
        setAttendance(attendanceData);
      },
      (error) => {
        console.error("Error fetching attendance: ", error);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    const leavesQuery = query(
      collection(db, "Leaves"),
      where("employeeId", "==", userId)
    );

    const unsubscribe = onSnapshot(
      leavesQuery,
      (snapshot) => {
        const leavesData = snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as LeaveFormTypeWithId)
        );
        setLeaves(leavesData);
      },
      (error) => {
        console.error("Error fetching leaves: ", error);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  const getMarkedDates = () => {
    const markedDates: { [key: string]: any } = {};

    attendance.forEach((record) => {
      const formattedDate = formatDate(record.date);
      if (record.attendanceType.toLowerCase() === "work from home") {
        markedDates[formattedDate] = { selected: true, selectedColor: "blue" };
      } else if (record.attendanceType.toLowerCase() === "work from office") {
        markedDates[formattedDate] = { selected: true, selectedColor: "green" };
      }
    });

    leaves.forEach((record) => {
      const formattedDate = formatDate(record.date);
      if (record.status.toLowerCase() === "approved") {
        markedDates[formattedDate] = { selected: true, selectedColor: "red" };
      }
    });

    console.log("markedDates: ", markedDates);
    return markedDates;
  };
  const formatDate = (date: string) => {
    const [day, month, year] = date.split('/');
    const formattedDay = day.padStart(2, '0');
    const formattedMonth = month.padStart(2, '0');
    return `${year}-${formattedMonth}-${formattedDay}`;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Attendance Record</Text>
      </View>
      <Calendar
        markedDates={getMarkedDates()}
        maxDate={new Date().toISOString().split("T")[0]}
        style={styles.calendar}
      />
      <View className="flex-1 gap-7 px-24 my-9">
        <View className="flex-row items-center gap-5">
            <View className="bg-red-500 w-9 h-9 rounded-full"></View>
            <Text>Shows Your Leaves</Text>

        </View>
        <View className="flex-row items-center gap-5">
            <View className="bg-blue-500 w-9 h-9 rounded-full"></View>
            <Text>Shows Work From Home</Text>

        </View>
        <View className="flex-row items-center gap-5">
            <View className="bg-green-500 w-9 h-9 rounded-full"></View>
            <Text>Work From Office</Text>

        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  calendar: {
    margin: 16,
    borderWidth:1,
  },
});

export default Attendance;
