import React, { useCallback, useEffect, useRef, useState } from "react";
import { NativeBaseProvider, Box, Button, ScrollView, Stack, Center, Accordion, Text, Divider, List, Image, PresenceTransition, Pressable, VStack, Heading, HStack, FlatList, Spinner } from 'native-base';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { ImageBackground, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import QRCode from 'react-native-qrcode-svg';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import ViewShot from "react-native-view-shot";
import { API_URL } from "@env";


export const BeforeRecycle = ({ navigation }) => {
  
  const Navigation = useNavigation(); 

  const [userData, setUserData] = useState(null);

  const [svg, setSvg] = useState();
  const [url, setUrl] = useState("https://myrecycle.netlify.app/mrpointskeyin/");

  let logoFromFile = require("../../public/assets/oil.png");
  
  //get user data
  const getUserData = async () => {
    try {
      const value = await AsyncStorage.getItem('user');
      if (value !== null) {
        // We have data!!
        setUserData(JSON.parse(value));
        setUrl(`https://myrecycle.netlify.app/mrpointskeyin/${JSON.parse(value).id}`);
      }
    } catch (error) {
      // Error retrieving data
      console.log(error);
    }
  }; 

  //get name and email
  useEffect(() => {
    getUserData();
  }, [])

  // useEffect(() => {
    // const unsubscribe = Navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
    // });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    // return unsubscribe;
  // }, [navigation]);

  let base64Logo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAA..';

  const _mediaLibraryAsync = async () => {

    try {
      let { status } = await MediaLibrary.requestPermissionsAsync();
      if(status === "granted"){
        // let answer = await MediaLibrary.saveToLibraryAsync();
      }
    } catch (error) {
      // Error retrieving data
      console.log(error);
    }

  };

  const viewShot = useRef();
  const [savedImagePath, setSavedImagePath] = useState('');

  const takeScreenShot = () => {
    viewShot.current.capture().then((uri) => {
      setSavedImagePath(uri);
      Sharing.shareAsync("file://" + uri);

    }),
    (error) => console.error("Oops, snapshot failed", error);
  };


  return (
    <Box w="full" h="full" backgroundColor="#f2f2f2">
      <ImageBackground source={require('../../public/assets/bg-1-100.jpg')} style={{width:"100%", height:"100%"}}>
        <VStack justifyContent="center" alignItems="center" p="5" space={3} w="full" h="full">
        <Heading fontSize="xl" textAlign="center" mb="3">Print the QR Code To Earn MR Points By Recycling</Heading>
        {userData ? 
        <ViewShot ref={viewShot} options={{ format: "jpg", quality: 0.9 }}>
        <QRCode
          value={url}
          quietZone="1"
          getRef={(c) => (setSvg(c))}
          // logo={logoFromFile}
          // logoSize={30}
          // logoBackgroundColor='white'
        />
      </ViewShot>
        : 
        <Center w="full" h="20">
          <Spinner size="lg" color="emerald.500"/>
        </Center> 
      }
        <VStack justifyContent="center" alignItems="center" p="3" space={2}>
          <Text textAlign="center" fontSize="sm">To earn MR Points, please download the barcode and <Text bold color="#1FAA8F">paste it on the bags or containers</Text> before proceeding to collector.</Text>
          <Text textAlign="center" fontSize="sm">The collector will then collect the items you have dropped and process your MR points within 3 working days.</Text>
        </VStack>
        {/* {savedImagePath ? <Image source={{ uri: savedImagePath }} alt="Alternate Text" size="xl" />: <></>} */}
        <Button w="full" backgroundColor="#FF981D" style={{borderRadius:20, borderColor:"#FF981D", borderWidth:2}} onPress={takeScreenShot}>
          <Text bold color="white">Download QR Code</Text>
        </Button>
          <Button w="full" backgroundColor="#1FAA8F" style={{borderRadius:20, borderColor:"#1FAA8F", borderWidth:2}} onPress={()=>Navigation.navigate("Explore", {category:"All"})}>
            <Text bold color="white">Proceed To Search Collector</Text>
          </Button>
        </VStack>
      </ImageBackground>
    </Box>
  );
};


export default () => {
    return (
      <NativeBaseProvider>
        <Center flex={1}>
          <BeforeRecycle />
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