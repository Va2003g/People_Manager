import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/Redux/store'
import { ProjectData } from '@/Redux/projectSlice'

export const Project = () => {
  const projectData = useSelector((state:RootState)=>state.projectData.projectData)
  const renderItem = ({ item }: { item: ProjectData }) => (
    <View style={styles.item}>
      <Text style={styles.title}>Project Name:- {item.title}</Text>
      <Text>Description:- {item.description}</Text>
      <Text>Start Date:- {item.startDate}</Text>
      <Text>End Date:- {item.endDate}</Text>
    </View>
  );

  return (
    <View className='mt-4 flex-1'>
        <Text className='text-center text-2xl mb-5 font-[Poppins-Regular] uppercase'>Project Assigned to You</Text>
        <FlatList
          data={projectData}
          keyExtractor={(item,index) => index.toString()}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.noDataText}>No data found</Text>}
          showsVerticalScrollIndicator={false}
          className='flex-1'
        />
    </View>
  );
}

export default Project

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
  
