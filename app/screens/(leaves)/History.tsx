import React from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";

const LeaveCard = ({ type, date, period, status, description }) => (
  <View style={styles.card}>
    <Text style={styles.leaveType}>{type}</Text>
    <Text style={styles.leaveDate}>
      {date} ({period})
    </Text>
    <View style={[styles.statusBadge, styles[status.toLowerCase()]]}>
      <Text style={styles.statusText}>{status}</Text>
    </View>
    <Text style={styles.leaveDescription}>{description}</Text>
  </View>
);
const History = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Recent Application:</Text>
      <LeaveCard
        type="Annual Leave"
        date="1 Sep 2023 - 1 Sep 2023"
        period="Full day"
        status="Pending"
        description="Lorem ipsum napptermometer reskade når dekakåling kötos..."
      />

      <Text style={styles.sectionTitle}>Past Application:</Text>
      <LeaveCard
        type="Annual Leave"
        date="1 Sep 2023 - 1 Sep 2023"
        period="Half day"
        status="Approved"
        description="Lorem ipsum neböligt benyda diapågt rösm al. Pepulig vabenat."
      />
      <LeaveCard
        type="Medical Leave"
        date="1 Sep 2023 - 1 Sep 2023"
        period="Full day"
        status="Approved"
        description="Lorem ipsum neböligt benyda diapågt rösm al. Pepulig vabenat."
      />
      <LeaveCard
        type="Annual Leave"
        date="1 Sep 2023 - 1 Sep 2023"
        period="Full day"
        status="Rejected"
        description="Lorem ipsum neböligt benyda diapågt rösm al. Pepulig vabenat."
      />
      <LeaveCard
        type="Annual Leave"
        date="1 Sep 2023 - 1 Sep 2023"
        period="Full day"
        status="Approved"
        description="Lorem ipsum neböligt benyda diapågt rösm al. Pepulig vabenat."
      />
    </ScrollView>
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
  pending: {
    backgroundColor: "#ffa500",
  },
  approved: {
    backgroundColor: "#4caf50",
  },
  rejected: {
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
