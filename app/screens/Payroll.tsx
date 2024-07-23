import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  Pressable,
} from "react-native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "@/backend/Firebase";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { PDFDocument, rgb } from "pdf-lib";
import { captureRef } from "react-native-view-shot";
// import { encode as btoa, decode as atob } from 'base-64';
import * as arrayBufferToBase64 from "base64-arraybuffer";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/store";

export interface Payroll {
  id: string;
  month: string;
  year: number;
  employeeSalaries: EmployeeSalary[];
}

export interface EmployeeSalary {
  id: string;
  name: string;
  baseSalary: number;
  deductions: number;
  variableSalary: number;
  netSalary: number;
  processed: boolean;
}

export const Payroll = () => {
  const employeeID = useSelector((state: RootState) => state.userData.id);
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const viewRef = useRef<View>(null);

  useEffect(() => {
    const fetchPayrolls = async () => {
      try {
        const payrollQuery = query(collection(db, "Payroll"));
        const payrollSnapshot = await getDocs(payrollQuery);
        const payrollsData: Payroll[] = payrollSnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Payroll)
        );
        setPayrolls(payrollsData);
        console.log("Payrolls Data: ", payrollsData);
      } catch (error) {
        console.error("Error fetching payrolls: ", error);
      }
    };
    fetchPayrolls();
  }, []);

  const generatePDF = async (payroll: Payroll, salary: EmployeeSalary) => {
    try {
      if (viewRef.current) {
        const uri = await captureRef(viewRef, {
          format: "png",
          quality: 1,
        });
        console.log("uri: ", uri);
        try {
          const fileInfo = await FileSystem.getInfoAsync(uri);
          console.log("File Info:", fileInfo);
          if (fileInfo.exists) {
            console.log("File is accessible");
          } else {
            console.log("File does not exist at path:", uri);
          }
        } catch (error) {
          console.error("Error checking file existence:", error);
        }

        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([600, 800]);

        const pngImageBytes = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        const pngImage = await pdfDoc.embedPng(pngImageBytes);

        page.drawImage(pngImage, {
          x: 0,
          y: 400,
          width: 600,
          height: 400,
        });

        page.drawText(`Name: ${salary.name}`, { x: 50, y: 380 });
        page.drawText(`Month: ${payroll.month}`, { x: 50, y: 360 });
        page.drawText(`Year: ${payroll.year}`, { x: 50, y: 340 });
        page.drawText(`Base Salary: ${salary.baseSalary}`, { x: 50, y: 320 });
        page.drawText(`Deductions: ${salary.deductions}`, { x: 50, y: 300 });
        page.drawText(`Variable Salary: ${salary.variableSalary}`, {
          x: 50,
          y: 280,
        });
        page.drawText(`Net Salary: ${salary.netSalary}`, { x: 50, y: 260 });

        const pdfBytes = await pdfDoc.save();
        const pdfPath = `${FileSystem.documentDirectory}payslip.pdf`;
        await FileSystem.writeAsStringAsync(pdfPath, pdfBytes.toString(), {
          encoding: FileSystem.EncodingType.Base64,
        });

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(pdfPath);
        } else {
          Alert.alert("Error", "Sharing is not available on this device");
        }
      }
    } catch (error) {
      console.error("Error generating PDF: ", error);
    }
  };
  const renderPayroll = ({ item }: { item: Payroll }) => {
    const employeeSalary = item.employeeSalaries.find(
      (salary) => salary.id === employeeID && salary.processed
    );
    if (!employeeSalary) return null;
    return (
      <View>
        <View style={styles.payrollItem} ref={viewRef}>
          <View style={styles.FormattedView}>
            <Text style={styles.payrollText}>Name:</Text>
            <Text style={styles.payrollText}>{employeeSalary.name}</Text>
          </View>
          <View style={styles.FormattedView}>
            <Text style={styles.payrollText}>Month:</Text>
            <Text style={styles.payrollText}>{item.month}</Text>
          </View>
          <View style={styles.FormattedView}>
            <Text style={styles.payrollText}>Year:</Text>
            <Text style={styles.payrollText}>{item.year}</Text>
          </View>
          <View style={styles.FormattedView}>
            <Text style={styles.payrollText}>Base Salary:</Text>
            <Text style={styles.payrollText}>{employeeSalary.baseSalary}</Text>
          </View>
          <View style={styles.FormattedView}>
            <Text style={styles.payrollText}>Deductions:</Text>
            <Text style={styles.payrollText}>{employeeSalary.deductions}</Text>
          </View>
          <View style={styles.FormattedView}>
            <Text style={styles.payrollText}>Variable Salary:</Text>
            <Text style={styles.payrollText}>
              {employeeSalary.variableSalary}
            </Text>
          </View>
          <View style={styles.FormattedView}>
            <Text style={styles.payrollText}>Net Salary:</Text>
            <Text style={styles.payrollText}>{employeeSalary.netSalary}</Text>
          </View>
        </View>
        <Pressable
          onPress={async () => await generatePDF(item, employeeSalary)}
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            Download Payslip {item.month} {item.year}
          </Text>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payrolls</Text>
      <FlatList
        data={payrolls}
        keyExtractor={(item) => item.id}
        renderItem={renderPayroll}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  Logo: {
    height: 20,
    opacity: 0.5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  payrollItem: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
  },
  payrollText: {
    fontSize: 16,
    marginBottom: 8,
    color: "#222C42",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#3B82F6",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  FormattedView: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
});

export default Payroll;
