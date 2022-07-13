import React, { useState, useEffect, useRef, useContext } from "react";
import {Center,VStack,HStack,Pressable,NativeBaseProvider,Fab,Icon,Box,Text,FlatList,Spinner} from "native-base";

import { StyleSheet, View, Animated, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { AntDesign, Ionicons, Entypo } from "@expo/vector-icons"
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoadingContext } from "../../context/context";

export const Report = () => {

  const Navigation = useNavigation(); 
  const isFocused = useIsFocused();

  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [payload, setPayload] = useState({
    status:"Pending",
    id: null
  });

  const { setIsLoading } = useContext(LoadingContext);

  //get user data
  const getUserData = async () => {
    setIsLoading(true);
    try {
      const value = await AsyncStorage.getItem('user');
      if (value !== null) {
        // We have data!!
        setUserData(JSON.parse(value));
        setPayload((prevState)=>({...prevState, id:JSON.parse(value).id}));
      }
      setIsLoading(false);
    } catch (error) {
      // Error retrieving data
      console.log(error);
    }
  }; 

  //get name and email
  useEffect(() => {
    getUserData();
  }, [])

  useEffect(() => {

    setIsLoading(true);

    fetch(API_URL + 'report/' + payload.id + "/" + payload.status, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(results => {
        setData(results);
        setIsLoading(false);
      })
      .catch(err => {
        setIsLoading(false);
        setError(err);
      });
  }, [payload,isFocused]);

  const renderItem = ({item}) => (
    <Box
    borderBottomWidth="1"
    _dark={{
      borderColor: "gray.600",
    }}
    borderColor="coolGray.200"
    pl="4"
    pr="5"
    py="2"
  >
   {/* <Pressable onPress={()=>handleProductNavigation(item.gtin)}> */}
   <Pressable onPress={()=> Navigation.navigate('Tracking Report', {item:item})}>

    <HStack space={3} justifyContent="space-between">
      <VStack space={1}>
        <Text
          _dark={{
            color: "warmGray.50",
          }}
          color="coolGray.800"
          bold
          fontSize="md"
        >
          {item.title}
        </Text>
        <HStack w="xs" justifyContent="space-between" alignItems="center">
        <Text
          color="coolGray.600"
          _dark={{
            color: "warmGray.200",
          }}
        >
          Report ID: {item.id}
        </Text>
        <Text
          color="coolGray.600"
          _dark={{
            color: "warmGray.200",
          }}
          mr="-4"
        >
          {item.date.split('T')[0]}
        </Text>
        </HStack>
      </VStack>
    </HStack>
    </Pressable>
  </Box>
  )

  return (
      <>
        {error? (
        <Text>
          Error fetching data... Check your network connection!
        </Text>
        ) : (
        <>
        <Fab position="absolute" size="sm" backgroundColor="#1FAA8F" icon={<Icon color="white" as={<AntDesign name="plus" />} size="sm" onPress={()=>Navigation.navigate('Submit Report')}/>} />

        <Box w="full">
        <ScrollView
          horizontal
          scrollEventThrottle={1}
          showsHorizontalScrollIndicator={false}
          height={50}
          contentInset={{ // iOS only
            top:0,
            left:0,
            bottom:0,
            right:20
          }}
          contentContainerStyle={{
            paddingRight: Platform.OS === 'android' ? 20 : 0
          }}
        >
        
        <TouchableOpacity style={(payload.status=="Pending")? styles.chipsItemActive : styles.chipsItem} onPress={()=>setPayload((prevState)=>({...prevState, status:"Pending"}))}>
          <Text>Pending</Text>
        </TouchableOpacity>
        <TouchableOpacity style={(payload.status=="Verified")? styles.chipsItemActive : styles.chipsItem} onPress={()=>setPayload((prevState)=>({...prevState, status:"Verified"}))}>
          <Text>Verified</Text>
        </TouchableOpacity>
        <TouchableOpacity style={(payload.status=="In Progress")? styles.chipsItemActive : styles.chipsItem} onPress={()=>setPayload((prevState)=>({...prevState, status:"In Progress"}))}>
          <Text>In Progress</Text>
        </TouchableOpacity>
        <TouchableOpacity style={(payload.status=="Solved")? styles.chipsItemActive : styles.chipsItem} onPress={()=>setPayload((prevState)=>({...prevState, status:"Solved"}))}>
          <Text>Solved</Text>
        </TouchableOpacity>
        <TouchableOpacity style={(payload.status=="Rejected")? styles.chipsItemRejected : styles.chipsItem} onPress={()=>setPayload((prevState)=>({...prevState, status:"Rejected"}))}>
          <Text>Rejected</Text>
        </TouchableOpacity>

        </ScrollView>
        <>
          {data.length === 0 ? (
            <Text p="4">No report found.</Text>
          ) : (
            <FlatList
            data={data}
            inverted={true}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            renderItem={renderItem}
            keyExtractor={(item) => parseInt(item.id)}
          />
          )}        
        </>


        </Box>   
        </>
        )}
      </>
  );
};

export default () => {
  return (
    <NativeBaseProvider>
      <Center flex={0} p="3">
        <Report/>
      </Center>
    </NativeBaseProvider>
  )
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    shadowColor: '#171717',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 20,
    backgroundColor: '#E9F4F1',
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 28,
  },
  chipsIcon: {
    marginRight: 5,
  },
  chipsItem: {
    flexDirection:"row",
    backgroundColor:'white', 
    borderRadius:20,
    padding:8,
    paddingHorizontal:20, 
    marginHorizontal:10,
    height:35,
    elevation: 10,
  },
  chipsItemActive: {
    flexDirection:"row",
    backgroundColor:'#4AD1B7', 
    borderRadius:20,
    padding:8,
    paddingHorizontal:20, 
    marginHorizontal:10,
    height:35,
    elevation: 10,
  },
  chipsItemRejected: {
    flexDirection:"row",
    backgroundColor:'#FF7B52', 
    borderRadius:20,
    padding:8,
    paddingHorizontal:20, 
    marginHorizontal:10,
    height:35,
    elevation: 10,
  },

});