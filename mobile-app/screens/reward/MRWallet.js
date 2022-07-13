import React, { useCallback, useContext, useEffect, useState } from "react";
import { NativeBaseProvider, Box, Button, ScrollView, Stack, Center, Accordion, Text, Divider, List, Image, PresenceTransition, Pressable, VStack, Heading, HStack, FlatList, Spinner } from 'native-base';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { ImageBackground, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext, LoadingContext } from "../../context/context";
import { API_URL } from "@env";

export const MyPoints = () => {
  
  const Navigation = useNavigation(); 

  const {user} = useContext(UserContext);
  const {setIsLoading} = useContext(LoadingContext);

  const [data, setData] = useState();
  const [error, setError] = useState("");

  //load recycle's history
  useEffect(() => {

    const ac = new AbortController();

    setIsLoading(true);

      fetch(API_URL + 'mrpoint/' + user.id, {
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
          setError(err);
        });

      return () => ac.abort();

  }, []);

  const renderItem = ({item}) => (
    
    <Box
    borderBottomWidth="1"
    _dark={{
      borderColor: "gray.600",
    }}
    borderColor="coolGray.200"
    py="2"
  >
   <Pressable backgroundColor="#F9F9F9" rounded="lg" p="4" overflow="hidden">
     {item.event === "recycle" && 
     <Image source={require('../../public/assets/recycle_bg.png')} style={{position:"absolute", right:12, top:-20}} alt="Alternate Text" size="40"/>}
     {item.event === "game" &&  
     <Image source={require('../../public/assets/game_bg.png')} style={{position:"absolute", right:10, top:-70}} alt="Alternate Text" size="40"/>}
      {item.event === "redeem" &&  
     <Image source={require('../../public/assets/reward_bg.png')} style={{position:"absolute", right:10, top:-30}} alt="Alternate Text" size="40"/>}
        <HStack space={3} justifyContent="space-between" >
          <VStack>
            {item.event === "recycle" &&  
              <Text color="coolGray.800" bold fontSize="sm" width="64">{item.collector_name}</Text>}
            {item.event === "game" &&  
              <Text color="coolGray.800" bold fontSize="md">Game Reward</Text>}
            {item.event === "redeem" &&  
              <Text color="coolGray.800" bold fontSize="md">Voucher Redeemed</Text>}
            <Text color="coolGray.600">{item.time.split('T')[0]}</Text>
          </VStack>
          <VStack justifyContent="center">
            {item.event === "redeem" ? 
            <Text color="danger.600" fontSize="lg" bold>-{item.points_given !== 0 ? item.points_given : "0"} pts</Text>
            : 
            <Text color="#1FAA8F" fontSize="lg" bold>+{item.points_given !== 0 ? item.points_given : "0"} pts</Text>
            }
          </VStack>
        </HStack>
    </Pressable>
  </Box>

  )

  return (
    <>
    <Box w="full" h="full" backgroundColor="#f2f2f2">
        <VStack justifyContent="center" alignItems="center" p="5" space={3}>
          <Box p="3" w="full" style={styles.container} overflow="hidden">
            <Image source={require('../../public/assets/mr-bg.png')} style={{position:"absolute", right:-20, top:-40}} alt="Alternate Text" size="56"/>
              <HStack justifyContent="space-between" px="3" py="2">
                <VStack justifyContent="space-between">
                  <Heading mb="4">{user.name}</Heading>
                  <Text>Available Balance:</Text>
                  <Text fontSize="3xl" bold mt="-1" color="#1FAA8F">{user.mr_points} pts</Text>
                </VStack>
                <VStack justifyContent="flex-end" py="1" space={1}>
                  <TouchableOpacity onPress={()=>Navigation.navigate("Conversion Rates")}>
                    <Center borderColor="#1FAA8F" borderWidth="2" px="3" py="1" rounded="2xl" mt="5">
                      <Text fontSize="sm" color="#1FAA8F" bold>Conversion Rates</Text>
                    </Center>
                  </TouchableOpacity> 
                  <TouchableOpacity onPress={()=>Navigation.navigate("Reward List")}>
                    <Center backgroundColor="#FC8B10" px="3" py="1" rounded="2xl" borderWidth="1" borderColor="#FC8B10">
                      <Text fontSize="sm" color="white" bold>Redeem Rewards</Text>
                    </Center>
                  </TouchableOpacity> 
                </VStack>
              </HStack>
          </Box>
          
          <Heading fontSize="md" pl="4" mt="5">History</Heading>
          {!data ? 
          <Text>Loading...</Text>
          :
          <FlatList
            data={data}
            scrollToOverflowEnabled={false}
            width="full"
            height="440"
            initialNumToRender={5}
            maxToRenderPerBatch={10}
            renderItem={renderItem}
            keyExtractor={(item) => parseInt(item.mrpoint_id)}
          />          
          }
          <VStack justifyContent="flex-start" alignItems="flex-start">
          </VStack>
        </VStack>
      </Box>
      </>
  );
};


export default () => {
    return (
      <NativeBaseProvider>
        <Center flex={1}>
          <MyPoints />
        </Center>
      </NativeBaseProvider>
    )
};

const styles = StyleSheet.create({
  container:{
    shadowColor: '#171717',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 20,
    backgroundColor: 'white',
    borderRadius:14
  }
});