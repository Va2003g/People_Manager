import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  FlatList,
} from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/store";
import { captureRef } from "react-native-view-shot";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/backend/Firebase";
import * as Sharing from "expo-sharing";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import { ToWords } from "to-words";
import { hero, logo } from "@/assets/images";

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

  const generatePDF = async (item: Payroll, employeeSalary: EmployeeSalary) => {
    const toWords = new ToWords({
      localeCode: "en-IN",
      converterOptions: {
        currency: true,
        ignoreDecimal: false,
        ignoreZeroCurrency: false,
      },
    });
    const netSalaryInWords = toWords.convert(employeeSalary.netSalary, {
      currency: true,
    });
    try {
      const htmlContent = `
        <html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
      .container { border: 1px solid #ccc; padding: 20px; }
      .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
      .company-name { font-size: 18px; font-weight: bold; }
      .logo { width: 100px; height: 100px; }
      .title { font-size: 16px; font-weight: bold; margin-bottom: 15px; }
      .employee-details { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
      .detail-item { font-size: 12px; }
      .net-pay { background-color: #f0f0f0; padding: 10px; text-align: right; margin-bottom: 20px; }
      .net-pay-amount { font-size: 24px; font-weight: bold; color: #4CAF50; }
      .earnings-deductions { display: flex; justify-content: space-between; margin-bottom: 20px; }
      .section { width: 48%; }
      .section-title { font-weight: bold; margin-bottom: 10px; font-size: 14px; }
      .item { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 5px; }
      .total { border-top: 1px solid #ccc; padding-top: 5px; font-weight: bold; }
      .net-payable { background-color: #e8f5e9; padding: 10px; font-weight: bold; text-align: center; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <div class="company-name">GeekyAnts India Private Limited</div>
        <img src=${logo} alt="GeekyAnts Logo" class="logo">
      </div>
      <div class="title">Payslip for the month of ${item.month} ${
        item.year
      }</div>
      <div class="employee-details">
        <div class="detail-item">Employee Name: ${employeeSalary.name}</div>
        <div class="detail-item">Employee Net Pay</div>
        <div class="detail-item net-pay-amount">₹${
          employeeSalary.netSalary
        }</div>
        <div class="detail-item">Pay Period: ${item.month} ${item.year}</div>
      </div>
      <div class="earnings-deductions">
        <div class="section">
          <div class="section-title">Earnings</div>
          <div class="item"><span>Basic</span><span>₹${
            employeeSalary.baseSalary
          }</span></div>
          <div class="item"><span>Food Allowance</span><span>₹${
            employeeSalary.deductions || "2,200.00"
          }</span></div>
          <div class="item"><span>Fixed Allowance</span><span>₹${
            employeeSalary.variableSalary || "1,950.00"
          }</span></div>
          <div class="item total"><span>Gross Earnings</span><span>₹${
            employeeSalary.netSalary || "25,000.00"
          }</span></div>
        </div>
      </div>
      <div class="net-payable">Total Net Payable ₹${
        employeeSalary.netSalary
      } (Indian Rupee ${
        netSalaryInWords || "Twenty-Two Thousand Two Hundred Eighty-Three Only"
      })</div>
    </div>
  </body>
</html>
      `;

      const options = {
        html: htmlContent,
        fileName: `Payslip_${item.month}_${item.year}`,
        directory: "Documents",
      };

      const pdf = await RNHTMLtoPDF.convert(options);
      await Sharing.shareAsync(pdf.filePath);
    } catch (error) {
      Alert.alert("Error", "Failed to generate PDF");
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
          onPress={() => generatePDF(item, employeeSalary)}
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
