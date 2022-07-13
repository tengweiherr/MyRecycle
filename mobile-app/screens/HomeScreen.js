import React, { useContext, useEffect, useState } from "react";
import {
  Stack,
  Center,
  Heading,
  VStack,
  Divider,
  Pressable,
  NativeBaseProvider,
  Text,
  Container,
  Box,
  HStack,
  FlatList,
  Image,
  ScrollView
} from "native-base";
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { ImageBackground, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoadingContext,UserContext } from "../context/context";
import Countdown from "../components/Countdown";
import { API_URL } from "@env";

export const Home = () => {

  const Navigation = useNavigation(); 
  const isFocused = useIsFocused();
  
  const { user,setUser } = useContext(UserContext);
  const { setIsLoading } = useContext(LoadingContext);

  const [data, setData] = useState(null);

    //load latest user mr points
    useEffect(() => {

      const ac = new AbortController();
  
      setIsLoading(true);
  
        fetch(API_URL + 'user/' + user.id, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(response => response.json())
          .then(results => {
            setData(results);
            setUser(results);
            setIsLoading(false);
          })
          .catch(err => {
            console.log(err);
          });
  
        return () => ac.abort();
  
    }, [isFocused]);
    
  return (
    <ImageBackground style={styles.image}>

    <HStack style={styles.box} justifyContent="space-between" alignItems="center" bg="#1FAA8F" p="4">
      <Box>
        <Heading size="sm" color="white">Welcome, {data ? data.name : user.name}!</Heading>
        <Text color="white" mt="1" fontSize="16">{data ? data.mr_points : user.mr_points} pts</Text>
      </Box>
      <TouchableOpacity onPress={()=>Navigation.navigate('Reward')}>
        <Box backgroundColor="#FC8B10" px="3" py="1" rounded="xl" mt="5">
          <Text testID="RedeemText" fontSize="sm" color="white">Redeem rewards</Text>
        </Box>
      </TouchableOpacity> 
    </HStack>

      <ScrollView p="3">
        <VStack space={4} style={{paddingBottom:50}}>
          <VStack>
        <Heading size="md" mt="2" bold>Categories</Heading>
        <Stack direction="row" mb="2" mt="2" space={3}>
          <Pressable onPress={()=>Navigation.navigate('GeneralWaste')}>
            <VStack alignItems="center" space={1}>
            <Center
            size="20"
            bg="#F4F9F8"
            rounded="lg"
            shadow={"3"}>
              <Box size="20" overflow="hidden">
                <Image style={styles.icon} maxHeight="14%" maxWidth="14%" left="30%" top="10%" source={require('../public/assets/recycle.png')} alt="Alternate Text"/>
              </Box>
            </Center>
            <Text fontSize={12}>General Waste</Text>
            </VStack>
          </Pressable>

          <Pressable onPress={()=>Navigation.navigate('EWaste')}>
          <VStack alignItems="center" space={1}>
            <Center
            size="20"
            bg="#F4F9F8"
            rounded="lg"
            shadow={"3"}>
              <Box size="20" overflow="hidden">
                <Image style={styles.icon} maxHeight="16%" maxWidth="16%" left="30%" top="1%" source={require('../public/assets/ewaste.png')} alt="Alternate Text"/>
              </Box>
            </Center>
            <Text fontSize={12}>E-Waste</Text>
            </VStack>
          </Pressable>

          <Pressable onPress={()=>Navigation.navigate('FoodWaste')}>
          <VStack alignItems="center" space={1}>
            <Center
            size="20"
            bg="#F4F9F8"
            rounded="lg"
            shadow={"3"}>
              <Box size="20" overflow="hidden">
                <Image style={styles.icon} maxHeight="13%" maxWidth="13%" left="30%" top="12%" source={require('../public/assets/healthy-food.png')} alt="Alternate Text"/>
              </Box>
            </Center>
            <Text fontSize={12}>Food Waste</Text>
            </VStack>
          </Pressable>

          <Pressable onPress={()=>Navigation.navigate('CookingOil')}>
          <VStack alignItems="center" space={1}>
            <Center
            size="20"
            bg="#F4F9F8"
            rounded="lg"
            shadow={"3"}>
              <Box size="20" overflow="hidden">
                <Image style={styles.icon} maxHeight="13%" maxWidth="13%" left="30%" top="10%" source={require('../public/assets/oil.png')} alt="Alternate Text"/>
              </Box>
            </Center>
            <Text fontSize={12}>Cooking Oil</Text>
            </VStack>
          </Pressable>
        </Stack>
                    
        </VStack>

      <Box shadow="4">
          <Box p="3" w="full" style={styles.container} overflow="hidden">
            <Image source={require('../public/assets/game_bg.png')} style={{position:"absolute", right:-20, top:-80}} alt="Alternate Text" size="56"/>
              <HStack justifyContent="space-between" px="3" py="2">
                <VStack justifyContent="space-between" w="200">
                  <Heading mb="2" fontSize="lg">Play To Earn</Heading>
                  <Text color="gray.600">Play mini games and earn MR Points while learning how to recycle.</Text>
                </VStack>
                <VStack>
                  <Countdown/>
                </VStack>
              </HStack>
          </Box>
      </Box>

      <Box shadow="4">
          <Box p="3" w="full" style={styles.container} overflow="hidden">
            <Image source={require('../public/assets/recycle_bg.png')} style={{position:"absolute", left:10, top:-40}} alt="Alternate Text" size="48"/>
              <HStack justifyContent="space-between" px="3" py="2">
                <VStack justifyContent="flex-end" space={1}>
                  <TouchableOpacity onPress={()=>Navigation.navigate("Explore")}>
                    <Center backgroundColor="#FC8B10" px="3" py="1" rounded="2xl" borderWidth="1" borderColor="#FC8B10">
                      <Text fontSize="sm" color="white" bold>Explore Now</Text>
                    </Center>
                  </TouchableOpacity> 
                </VStack>
                <VStack justifyContent="space-between" w="200">
                  <Heading mb="2" fontSize="lg" textAlign="right">Recycle To Earn</Heading>
                  <Text color="gray.600" textAlign="right">Drop your recyclables at the licensed collecting centres to win MR Points.</Text>
                </VStack>

              </HStack>
          </Box>
      </Box>

      <Box shadow="4">
          <Box p="3" w="full" style={styles.container} overflow="hidden">
            <Image source={require('../public/assets/bottle_bg.png')} style={{position:"absolute", right:-40, top:-10}} alt="Alternate Text" size="48" />
              <HStack justifyContent="space-between" px="3" py="2">
                <VStack justifyContent="space-between" w="200">
                  <Heading mb="2" fontSize="lg">Scan Barcode</Heading>
                  <Text color="gray.600">Scan the product barcode to check whether the item is recyclable.</Text>
                </VStack>
                <VStack justifyContent="flex-end" space={1}>
                  <TouchableOpacity onPress={()=>Navigation.navigate("Scan Barcode")}>
                    <Center backgroundColor="#FC8B10" px="3" py="1" rounded="2xl" borderWidth="1" borderColor="#FC8B10">
                      <Text fontSize="sm" color="white" bold>Scan Now</Text>
                    </Center>
                  </TouchableOpacity> 
                </VStack>
              </HStack>
          </Box>
      </Box>
      </VStack>
      </ScrollView>
      </ImageBackground>
  );
};

export default () => {
  return (
    <NativeBaseProvider>
      <Center flex={1}>
        <Home />
      </Center>
    </NativeBaseProvider>
  )
};

const styles = StyleSheet.create({
  image: {
      flex: 1,
      width: '100%',
      alignItems: 'center',
      backgroundColor: 'white'
  },
  box:{
    width:'100%',
  },
  icon:{
    position: "absolute",
  },
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
