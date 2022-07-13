import React, { useState, useEffect, useContext } from "react";
import { NativeBaseProvider, Box, Button, ScrollView, Stack, Center, Accordion, Text, Divider, List, Image, PresenceTransition, Pressable, Spacer, HStack, VStack, CheckCircleIcon, Heading, Icon, InfoOutlineIcon, FlatList, SectionList, Spinner } from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';
import { API_URL } from "@env";
import { ActivityIndicator, ImageBackground } from "react-native";
// import { LoadingContext } from "../../context/context";
import LoadingScreen from "../../components/LoadingScreen";

export const ProductDetail = ({ route, navigation }) => {
  
  const Navigation = useNavigation(); 

  const productgtin = JSON.stringify(useRoute().params.gtin).replace('"','').replace('"','');

  // const { setIsLoading } = useContext(LoadingContext);
  const [isLoading, setIsLoading] = useState(true);

  const [data, setData] = useState([]);
  const [material, setMaterial] = useState({
    time:"",
    guide:""
  });
  const [guide, setGuide] = useState([]);

useEffect(() => {

    setIsLoading(true);

    const ac = new AbortController();

    fetch(`${API_URL}product/${productgtin}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(results => {
        setData(results);
      })
      .catch(err => {
        console.log(err);
      });
      return () => ac.abort();
  }, []);

  useEffect(() => {

    setIsLoading(true);

    const ac = new AbortController();
  
    fetch(`${API_URL}material`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(results => {
        for (let index = 0; index < results.length; index++) {
          if (data.material == results[index].material) {
            setMaterial(results[index]);
          }
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
      return () => ac.abort();
  }, [data]);

  //load recycle guide
  useEffect(() => {
    fetch(API_URL + 'guide', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(results => {
        setGuide(results);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);  

  const _renderGuide = () => {
    return guide.map((item, index) => {
      return (
        <HStack alignItems="center" justifyContent="flex-start" width="full" backgroundColor="white" p="2" rounded="20" space={4} key={`guide-${index}`}>
          <Box backgroundColor="gray.100" borderRadius="100" size="16" justifyContent="center" alignItems="center">
            {item.id === 1 && 
              <Image source={require("../../public/assets/recycle-steps/step_1.png")} alt="action-picture" size="16"/>
            }
            {item.id === 2 && 
              <Image source={require("../../public/assets/recycle-steps/step_2.png")} alt="action-picture" size="16"/>
            }
            {item.id === 3 && 
              <Image source={require("../../public/assets/recycle-steps/step_3.png")} alt="action-picture" size="16"/>
            }
            {item.id === 4 && 
              <Image source={require("../../public/assets/recycle-steps/step_4.png")} alt="action-picture" size="16"/>
            }
            {item.id === 5 && 
              <Image source={require("../../public/assets/recycle-steps/step_5.png")} alt="action-picture" size="16"/>
            }
          </Box>
          <VStack w="4/6" space={1}>
            <Text fontSize="xs">{item.content}</Text>  
          </VStack>
        </HStack>
      )
    })
  }
  
  return (
    <>
    <ImageBackground source={require("../../public/assets/bg-1-100.jpg")} style={{width:"100%", height:"100%"}}>
    <>
    {isLoading ? <LoadingScreen/> : (
    <>
    {data ? (
    <>
            <VStack space={2} alignContent="center" justifyContent="center" style={{width:"100%", height:"100%"}} p="5">
              <ScrollView >
                <VStack pt="5" >
                  <HStack space={1} alignContent="center" justifyContent="center">
                  {data.recyclable == "yes" ? (
                  <>
                    <CheckCircleIcon size="6" mt="1" color="#1FAA8F" mr="2"/>  
                    <Heading fontSize="2xl" color="#1FAA8F" bold>Recyclable</Heading>
                  </>
                  ) : (
                  <>
                    <CheckCircleIcon size="6" mt="1" color="red.500" mr="2"/>  
                    <Text fontSize="2xl" color="red.500">Not Recyclable</Text>
                  </>
                  )}

                  </HStack>  
                  <Text mt="5" textAlign="center" bold fontSize="md">{data.productName}</Text>
                  <Text mb="5" textAlign="center">{data.gtin}</Text>
                  <Text mb="1" textAlign="center" bold>Material: {data.material}</Text>
                  <Text mb="5" textAlign="center" bold>Category: {material.category ? material.category : "-"}</Text>
                  <Box>
                    {data.recyclable == "yes" ?                  
                    <Accordion allowMultiple style={{borderWidth:0}}>                    
                      <Accordion.Item>
                        <Accordion.Summary _expanded={{backgroundColor:"transparent"}}>
                          <Text>How to recycle this?</Text>
                          <Accordion.Icon size="4" color="#1FAA8F"/>
                        </Accordion.Summary>
                        <Accordion.Details>
                        <Box backgroundColor="#F1F1F1" p="2" px="3" rounded="xl"> 
                        <VStack width="100%" space={2}>
                          {guide? _renderGuide() : <></>}
                          {material.guide ? 
                          <VStack justifyContent="flex-start" width="full" backgroundColor="#ffef42" p="3" rounded="20" space={1}>
                            <Text fontSize="xs" bold>Special Guide</Text> 
                            <Text fontSize="xs">{material.guide}</Text> 
                          </VStack>
                          : <></>}
                        </VStack>
                        </Box>
                        </Accordion.Details>
                      </Accordion.Item>
                      <Accordion.Item>
                        <Accordion.Summary _expanded={{
                            backgroundColor:"transparent"
                          }}>
                          <Text>What happens if you failed to recycle this item?</Text>
                          <Accordion.Icon size="4" color="#1FAA8F"/>
                        </Accordion.Summary>
                        <Accordion.Details>
                          <Box backgroundColor="#F1F1F1" p="3" rounded="xl"> 
                          {data.material == "Steel"? <></> : <></>}
                            <Text p="1">
                            {data.material}’s biodegradable duration is <Text bold color="red.600">{material.time}</Text>. It means that it takes this amount of time to decompose. Failing to recycle it will harm the environment.  
                            </Text>
                          </Box>
                        </Accordion.Details>
                      </Accordion.Item>
                    </Accordion>

                    :
 
                    <Accordion allowMultiple defaultIndex={[2]} style={{borderWidth:0}}>       
                      <Accordion.Item>
                        <Accordion.Summary _expanded={{
                          backgroundColor:"transparent"
                        }}>
                          <Text>What happens to non-recyclables?</Text>
                          <Accordion.Icon size="4" color="#1FAA8F"/>
                        </Accordion.Summary>
                        <Accordion.Details>
                        <Box backgroundColor="#F1F1F1" p="3" rounded="xl"> 
                          <Text p="1">
                            All non-recyclables usually end up in landfills. It will take <Text bold color="red.600">hundreds or thousands of years</Text> to decompose. As these materials start to degrade, they leak harmful chemicals back into the environment, making their impact on the planet doubly worse.
                          </Text>
                        </Box>
                        </Accordion.Details>
                      </Accordion.Item>             
                      <Accordion.Item>
                        <Accordion.Summary _expanded={{
                          backgroundColor:"transparent"
                        }}>
                          <Text>What can I do with non-recyclables?</Text>
                          <Accordion.Icon size="4" color="#1FAA8F"/>
                        </Accordion.Summary>
                        <Accordion.Details>
                        <Box backgroundColor="#F1F1F1" p="3" rounded="xl"> 
                          <Text p="1">
                          Clean them up and put them gently into household or public garbage bins. Please be alerted that it’s important to buy carefully, use and <Text bold color="red.600">reuse</Text>, and find ways to <Text bold color="red.600">reduce</Text> waste wherever possible.
                          </Text>
                        </Box>
                        </Accordion.Details>
                      </Accordion.Item>
                    </Accordion>
                    
                    }




                </Box>
                <HStack p="3" mt="5" space={3} justifyContent="flex-start" alignItems="flex-start">
                  <InfoOutlineIcon size="xs" color="yellow.500"/>
                    <VStack>
                      <Text fontSize="xs" width="xs">
                      Please be informed that this information is only applicable to the content of the product. For the packaging of the product, please follow the sorting guide based on the material.
                      </Text>
                      <Pressable onPress={()=>Navigation.navigate('GeneralWaste')}>
                        <Text fontSize="xs" color="#1FAA8F" italic={true}>See here</Text>
                      </Pressable>
                    </VStack>
                </HStack>
                </VStack>
              </ScrollView>
              {data.recyclable == "yes" ? 
                <Button block backgroundColor="#1FAA8F" style={{borderRadius:20, borderColor:"#1FAA8F", borderWidth:2}} onPress={()=>Navigation.navigate('Explore', {category:material.category})}>
                  <Text bold color="white">Search Collector</Text>
                </Button>
               : <></>}
              <Button bordered block style={{borderRadius:20, backgroundColor:"transparent", borderColor:"#1FAA8F", borderWidth:2}} onPress={() => Navigation.pop()}>
                <Text bold>Close</Text>
              </Button>
            </VStack>
    </>):(
    <VStack justifyContent="center" alignItems="center" w="full" h="full" space={5} p="5">
      <Image source={require("../../public/assets/not_found.png")} alt="Image not found" w="200" h="150"/>
      <Heading>Product does not exist.</Heading>
      <Text bold>GTIN: {productgtin}</Text>
      <Text textAlign="center">But you can do us a favor!</Text>
      <Text textAlign="center" mt="-3">Submit the product information to us so the next person searching for this can have the information.</Text>
      <Button w="full" backgroundColor="#1FAA8F" style={{borderRadius:20, borderColor:"#1FAA8F", borderWidth:2}} onPress={()=>Navigation.navigate('Submit Product', {productgtin})}>
        <Text bold color="white">Submit product</Text>
      </Button>
    </VStack>)}
    </>
    )}
    </>
    </ImageBackground>
    </>
  );
};


export default () => {
    return (
      <NativeBaseProvider>
        <Center flex={1}>
          <ProductDetail/>
        </Center>
      </NativeBaseProvider>
    )
};