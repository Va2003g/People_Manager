import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { db } from "@/backend/Firebase";
import { onSnapshot, collection, query, where } from "firebase/firestore";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/store";

interface DashboardPropType {
  icon: "medical-bag" | "cash-multiple" | "wallet";
  value: number;
  total: number;
  label: string;
}
interface LeaveType {
  PaidLeft: number;
  PaidTotal: number;
  SickLeft: number;
  SickTotal: number;
  UnpaidLeft: number;
  UnpaidTotal: number;
  EmployeeId: string;
  id:string,
}
const DashboardItem = ({ icon, value, total, label }: DashboardPropType) => (
  <View style={styles.item}>
    <MaterialCommunityIcons name={icon} size={24} color="#999" />
    <Text style={styles.value}>
      {value}
      <Text style={styles.total}>/{total}</Text>
    </Text>
    <Text style={styles.label}>{label}</Text>
  </View>
);
const Leaves = () => {
  const userId = useSelector((state: RootState) => state.userData.id);
  const [leaves, setLeaves] = useState<LeaveType>({
    PaidLeft: 0,
    PaidTotal: 0,
    SickLeft: 0,
    SickTotal: 0,
    UnpaidLeft: 0,
    UnpaidTotal: 0,
    EmployeeId: "",
    id:''
  });
  useEffect(() => {
    if (!userId) return;

    const leaveQuery = query(collection(db, "Leaves Data"), where("EmployeeId", "==", userId));

    const unsubscribe = onSnapshot(leaveQuery, (snapshot) => {
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        const leaveData = { id: doc.id, ...doc.data() } as LeaveType;
        console.log("leaveData: ", leaveData);
        setLeaves(leaveData);
      }
    }, (error) => {
      console.error("Error fetching leave data: ", error);
    });

    // Clean up the subscription on component unmount
    return () => unsubscribe();
  }, [userId]);


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/screens/(leaves)/History")}
        >
          <Text style={styles.buttonText}>Leave History →</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.grid}>
        <DashboardItem
          icon="medical-bag"
          value={leaves.SickLeft}
          total={leaves.SickTotal}
          label="Sick Leave"
        />
        <DashboardItem
          icon="cash-multiple"
          value={leaves.PaidLeft}
          total={leaves.PaidTotal}
          label="Paid Leave"
        />
        <DashboardItem
          icon="wallet"
          value={leaves.UnpaidLeft}
          total={leaves.UnpaidTotal}
          label="Unpaid Leave"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  buttonText: {
    color: "#4a90e2",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  item: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "48%",
    marginBottom: 15,
    alignItems: "center",
  },
  value: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  total: {
    fontSize: 16,
    color: "#999",
  },
  label: {
    marginTop: 5,
    color: "#666",
  },
});

export default Leaves;
