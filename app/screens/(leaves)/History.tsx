import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { LeaveFormType } from "./ApplyLeaves";
import { db } from "@/backend/Firebase";
import { query, collection, where, onSnapshot } from "firebase/firestore";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/store";
import { FlatList } from "react-native-gesture-handler";

interface LeaveFormTypeWithId extends LeaveFormType {
  id: string;
}
const LeaveCard = ({ item }: { item: LeaveFormTypeWithId }) => (
  <View style={styles.card}>
    <Text style={styles.leaveType}>{item.leaveType}</Text>
    <Text style={styles.leaveDate}>{item.date}</Text>
    <View style={[styles.statusBadge, styles[item.status]]}>
      <Text style={styles.statusText}>{item.status}</Text>
    </View>
    <Text style={styles.leaveDescription}>{item.reason}</Text>
  </View>
);
const History = () => {
  const [leaves, setLeaves] = useState<LeaveFormTypeWithId[]>([]);
  const userId = useSelector((state: RootState) => state.userData.id);

  useEffect(() => {
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

  const parseDate = (dateStr: string) => {
    const parts = dateStr.split("/");
    return new Date(
      parseInt(parts[2]),
      parseInt(parts[1]) - 1,
      parseInt(parts[0]) + 1
    );
  };
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>New Application:</Text>
      <FlatList
        data={leaves.filter((leave) => parseDate(leave.date) >= new Date())}
        // data={leaves}
        renderItem={(item) => LeaveCard(item)}
        keyExtractor={(item) => item.id}
      />

      <Text style={styles.sectionTitle}>Past Application:</Text>
      <FlatList
        data={leaves.filter((leave) => parseDate(leave.date) < new Date())}
        renderItem={LeaveCard}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default History;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#555",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  leaveType: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  leaveDate: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  statusBadge: {
    position: "absolute",
    top: 15,
    right: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  Pending: {
    backgroundColor: "#ffa500",
  },
  Approved: {
    backgroundColor: "#4caf50",
  },
  Rejected: {
    backgroundColor: "#f44336",
  },
  statusText: {
    color: "white",
    fontWeight: "bold",
  },
  leaveDescription: {
    fontSize: 14,
    color: "#888",
    marginTop: 5,
  },
});
