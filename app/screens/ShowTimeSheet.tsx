import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { db } from "@/backend/Firebase";
import { formDataType } from "@/Redux/UserDataSlice";
import { doc, getDoc, onSnapshot, collection, query, where } from "firebase/firestore";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/store";
export interface TimeSheetType {
  projectName: string;
  description: string;
  time: string;
  id: string;
  employeeId: string;
  date: string;
}

const ShowTimeSheet = () => {
    const [timesheets, setTimesheets] = useState<TimeSheetType[]>([]);
    const userId = useSelector((state: RootState) => state.userData.id);
  
    useEffect(() => {
      const timesheetsQuery = query(
        collection(db, 'Timesheet'),
        where('employeeId', '==', userId)
      );
  
      const unsubscribe = onSnapshot(timesheetsQuery, (snapshot) => {
        const timesheetsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as TimeSheetType[];
  
        setTimesheets(timesheetsData);
      });
  
      return () => unsubscribe();
    }, [userId]);
  
    const renderItem = ({ item }: { item: TimeSheetType }) => (
      <View style={styles.item}>
        <Text style={styles.title}>Project Name:- {item.projectName}</Text>
        <Text>Description:- {item.description}</Text>
        <Text>Date:- {item.date}</Text>
        <Text>Total Hours:- {item.time}</Text>
      </View>
    );
  
    return (
      <FlatList
        data={timesheets}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.noDataText}>No data found</Text>}
        showsVerticalScrollIndicator={false}
      />
    );
  };
  
  export default ShowTimeSheet;
  
  const styles = StyleSheet.create({
    item: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    noDataText: {
      textAlign: 'center',
      marginTop: 20,
      color: '#888',
    },
  });
  
