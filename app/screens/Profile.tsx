import { View, Text } from 'react-native'
import React from 'react'
import { RootState } from '@/Redux/store'
import { useSelector } from 'react-redux'
import { Image } from 'expo-image'

const Profile = () => {
    const User = useSelector((state:RootState)=>state.userData.data)
    console.log('User: ', User)
  return (
    <View>
      <Text>Profile</Text>
      <Image source={User.photoURL} className='h-10 w-10 rounded-full'/>
          <Text>{User.firstName + ' ' + User.lastName}</Text>
    </View>
  )
}

export default Profile