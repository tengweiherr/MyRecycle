import React, { useContext, useEffect, useState } from "react";
import { NativeBaseProvider, Box, Button, ScrollView, Stack, Center, Accordion, Text, Divider, List, Image, PresenceTransition, Pressable, VStack, Heading, HStack, FlatList, AspectRatio, Progress, View, CheckCircleIcon, Spinner } from 'native-base';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { ImageBackground, Modal, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { UserContext,LoadingContext } from "../../context/context";
import { API_URL } from "@env";

export const RewardList = () => {
  
  const Navigation = useNavigation(); 

  const {user, setUser} = useContext(UserContext);
  const {setIsLoading} = useContext(LoadingContext);

  const [category, setCategory] = useState("");
  const [data, setData] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);

  //load reward data
  useEffect(() => {

    setIsLoading(true);

      fetch(API_URL + 'batch/' + category, {
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
          console.log(err);
        });
    
  }, [category]);

  //redeem reward
  const redeem = (item) => {

    //check if user point is enough
    if(user.mr_points >= item.rewards_cost){

      //minus 1 on available amount
      const temp = item.amount_left-1;

      const payload = {
        batch_id: item.batch_id,
        user_id: user.id,
        redeem_time:new Date(),
        mr_points: user.mr_points - item.rewards_cost,
        rewards_cost: item.rewards_cost,
        email: user.email,
        amount_left: parseInt(temp),
      }
  
      const finalpoints = parseInt(user.mr_points - item.rewards_cost);
      //update context
      setUser((prevState)=>({...prevState,mr_points:finalpoints}));
      //show modal
      setModalVisible(true);

      fetch(API_URL + 'rewardredeem/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
  
      })
        .then(response => response.json())
        .then(results => {
          console.log(results);
        })
        .catch(err => {
          console.log(err);
        });
  
    }else{
      //trigger modal to tell
      alert("Not enough points");
    }
  }

  const renderItem = ({ item }) => (
    <Box
    borderBottomWidth="1"
    _dark={{
      borderColor: "gray.600",
    }}
    borderColor="coolGray.200"
    py="2"
  >
   <Pressable>
    <VStack space={2} justifyContent="space-between" backgroundColor="#E8E8E8" rounded="lg">
      <Box w="full" h="120" overflow="hidden">
        <AspectRatio w="100%" ratio={16 / 9} >
          <Image source={{uri:`${API_URL}static/rewards/${item.media}`}} alt="rewards-image" resizeMode="cover"/>
      </AspectRatio>
      </Box>
      <VStack px="3" pb="3" space={3}>
        <Text fontSize="md">{item.rewards_name}</Text>
        <HStack w="full" justifyContent="space-between" alignItems="flex-end">
          <VStack space={1}>
            <Text color="coolGray.500">{item.amount_left} available</Text>
            <Box w="120">
              <Progress colorScheme="emerald" value={(item.amount_left / item.amount_available)*100} />
            </Box>
          </VStack>
          <HStack justifyContent="center" alignItems="center" space={2}>
            <HStack space={1} justifyContent="center" alignItems="center">
              <Image source={require("../../public/assets/mr-point.png")} style={{width:18, height:18}} alt="image"/>
              <Text bold>{item.rewards_cost}</Text>
            </HStack>
            {item.amount_left === 0 ? 
            <TouchableOpacity>
              <Center backgroundColor="#A1A1A1" px="3" py="1" rounded="md" borderWidth="1" borderColor="#A1A1A1">
                <Text fontSize="sm" color="white" bold>Fully Redeemed</Text>
              </Center>
            </TouchableOpacity> 
            :
            <TouchableOpacity onPress={(e)=>redeem(item)}>
              <Center backgroundColor="#FC8B10" px="3" py="1" rounded="md" borderWidth="1" borderColor="#FC8B10">
                <Text fontSize="sm" color="white" bold>Redeem</Text>
              </Center>
            </TouchableOpacity> 
            }
          </HStack>

        </HStack>
      </VStack>
    </VStack>
    </Pressable>
  </Box>
  );

  return (
    <Box w="full" h="full" backgroundColor="#f2f2f2">
      <ImageBackground source={require("../../public/assets/bg-1-100.jpg")} style={{width:"100%", height:"100%"}}>
      <Heading fontSize="md" style={{alignSelf:"flex-start"}} pl="5" mt="5">Redeem your rewards</Heading>
      <Box m="3" w="full">
        <ScrollView
            horizontal
            scrollEventThrottle={1}
            showsHorizontalScrollIndicator={false}
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
          
          <TouchableOpacity style={(category=="")? styles.chipsItemActive : styles.chipsItem} onPress={()=>setCategory("")}>
            <Text>All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={(category=="Vouchers")? styles.chipsItemActive : styles.chipsItem} onPress={()=>setCategory("Vouchers")}>
            <Text>Vouchers</Text>
          </TouchableOpacity>
          <TouchableOpacity style={(category=="Grocery")? styles.chipsItemActive : styles.chipsItem} onPress={()=>setCategory("Grocery")}>
            <Text>Grocery</Text>
          </TouchableOpacity>
        </ScrollView>
              
      </Box>

        <VStack justifyContent="flex-start" alignItems="center" p="5" space={3} mt="-5">
          {data.length > 0 ? 
          <FlatList
          data={data}
          scrollToOverflowEnabled={false}
          width="full"
          h="550"
          initialNumToRender={5}
          maxToRenderPerBatch={10}
          renderItem={renderItem}
          keyExtractor={(item) => parseInt(item.batch_id)}
        />
          :
          <Center style={{height:"90%"}}>
            <Text>No rewards found.</Text>
          </Center>
          }

          <VStack justifyContent="flex-start" alignItems="flex-start">
          </VStack>
        </VStack>      

        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {setModalVisible(!modalVisible)}}
        >
          <Center w="full" h="full">
            <VStack backgroundColor="#F1F1F1" justifyContent="center" alignItems="center" p="5" w="3/4" rounded="xl" space={5}>
              <CheckCircleIcon size="8" mt="1" color="#1FAA8F" mr="2"/>  
              <Heading fontSize="lg">Reward Redeemed!</Heading>
              {/* <Text mt="-3">MR Points balance: {point}</Text> */}
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => {setModalVisible(!modalVisible);Navigation.goBack();}}
              >
                <Text style={styles.textStyle}>Close</Text>
              </Pressable>
            </VStack>
          </Center>
        </Modal>
        </ImageBackground>
      </Box>
  );
};


export default () => {
    return (
      <NativeBaseProvider>
        <Center flex={1}>
          <RewardList />
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius:4,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  buttonClose: {
    backgroundColor: "#1FAA8F",
    padding: 10,
    borderRadius: 4,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});