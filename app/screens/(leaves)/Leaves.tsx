import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface DashboardPropType {
  icon:any,
  value:string,
  total:string,
  label:string
}
const DashboardItem = ({ icon, value, total, label }:DashboardPropType) => (
  <View style={styles.item}>
    <MaterialCommunityIcons name={icon} size={24} color="#999" />
    <Text style={styles.value}>{value}<Text style={styles.total}>/{total}</Text></Text>
    <Text style={styles.label}>{label}</Text>
  </View>
);
const Leaves = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <TouchableOpacity style={styles.button} onPress={()=>router.push('/screens/(leaves)/History')}>
          <Text style={styles.buttonText}>Leave History →</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.grid}>
        <DashboardItem
          icon="medical-bag"
          value="12"
          total="12"
          label="Sick Leave"
        />
        <DashboardItem
          icon="cash-multiple"
          value="12"
          total="12"
          label="Paid Leave"
        />
        <DashboardItem
          icon="wallet"
          value="12"
          total="12"
          label="Unpaid Leave"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  buttonText: {
    color: '#4a90e2',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  item: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '48%',
    marginBottom: 15,
    alignItems: 'center',
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  total: {
    fontSize: 16,
    color: '#999',
  },
  label: {
    marginTop: 5,
    color: '#666',
  },
});

export default Leaves
