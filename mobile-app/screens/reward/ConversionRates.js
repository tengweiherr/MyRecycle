import React, { useContext, useEffect, useState } from "react";
import { NativeBaseProvider, Box, Button, ScrollView, Stack, Center, Accordion, Text, Divider, List, Image, PresenceTransition, Pressable, VStack, Spinner, HStack, InfoOutlineIcon } from 'native-base';
import { DataTable } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { ImageBackground } from "react-native";
import { API_URL } from "@env";
import { LoadingContext } from "../../context/context";


export const ConversionRates = () => {
  
  const Navigation = useNavigation(); 

  const { setIsLoading } = useContext(LoadingContext);

  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  //load reward data
  useEffect(() => {

    setIsLoading(true);

    fetch(API_URL + 'material/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(results => {

        let temp = [];
        let count = 0;
        //get only recyclables
        for (let index = 0; index < results.length; index++) {
          if(results[index].category !== "Non-Recyclable"){
            temp[count] = results[index];
            count++;
          }
        }

        setData(temp);
        setIsLoading(false);
      })
      .catch(err => {
        setIsLoading(false);
        setError(err);
      });

  }, []);

  const _renderMaterial = () => {
    return data.map((item, index) => {
      return (
        <DataTable.Row key={index} style={index%2!==0 && {backgroundColor:"#f8f8f8"}}>
          <DataTable.Cell>{index === 0 && <Text>Per kilogram</Text>}</DataTable.Cell>
          <DataTable.Cell>{item.material}</DataTable.Cell>
          <DataTable.Cell numeric>{item.conversion_rate}</DataTable.Cell>
        </DataTable.Row>
      )
    })
  }

  return (
    <ImageBackground source={require("../../public/assets/bg-1-100.jpg")} style={{width:"100%", height:"100%"}}>
      <ScrollView>
      <VStack p="5" space={3}>
        <>
        <DataTable backgroundColor="#fff" borderColor="#f8f8f8" style={{borderWidth:2, borderRadius:12}}>
          <DataTable.Header style={{backgroundColor:"#1FAA8F", borderTopEndRadius:12, borderTopStartRadius:12}}>
            <DataTable.Title>
              <Text color="#fff" bold fontSize="md">Unit</Text>
            </DataTable.Title>
            <DataTable.Title>
              <Text color="#fff" bold fontSize="md">Materials</Text>
            </DataTable.Title>
            <DataTable.Title numeric>
              <Text color="#fff" bold fontSize="md">MR Points</Text>
            </DataTable.Title>
          </DataTable.Header>
          {data && _renderMaterial()}
        </DataTable>
        <HStack py="2" space={3} justifyContent="flex-start" alignItems="flex-start">
          <InfoOutlineIcon size="xs" color="yellow.500"/>
            <VStack>
              <Text fontSize="xs" width="xs">
              Please be informed that the conversion rates will be reviewed and adjusted without prior notification if necessary.
              </Text>
              {/* <Pressable onPress={()=>Navigation.navigate('GeneralWaste')}>
                 <Text fontSize="xs" color="#1FAA8F" italic={true}>See here</Text>
              </Pressable> */}
            </VStack>
        </HStack>
        </>
        <Button rounded="full" background="#FC8B10" borderColor="#FC8B10" borderWidth="1" onPress={()=>Navigation.goBack()}>
          <Text testID="goback" bold color="white">Go Back</Text>
        </Button>
      </VStack>
      </ScrollView>
    </ImageBackground>
  );
};


export default () => {
    return (
      <NativeBaseProvider>
        <Center flex={1}>
          <ConversionRates />
        </Center>
      </NativeBaseProvider>
    )
};
