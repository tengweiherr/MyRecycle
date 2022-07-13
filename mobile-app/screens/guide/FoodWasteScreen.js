import React, { useEffect, useRef, useState } from "react";
import { NativeBaseProvider, Box, Button, ScrollView, Stack, Center, Accordion, Text, Divider, List, Image, PresenceTransition, Pressable, HStack, VStack, Heading, Fab, Icon, Spinner, Skeleton, FlatList } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, TouchableOpacity, Animated, View, Modal, ImageBackground, ActivityIndicator } from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons"
import { Video } from 'expo-av';
import { Linking } from "react-native";
import { API_URL } from "@env";

export const FoodWaste = () => {
  
  const Navigation = useNavigation(); 

  const [data, setData] = useState({id:0, material:"", time:"", guide:null, category:"", recyclable:[], non_recyclable:[], conversion_rate:0, recyclable_media:[], non_recyclable_media:[]});
  const [material, setMaterial] = useState("");
  const [isRecyclable, setIsRecyclable] = useState("Recyclable");
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [targetItem, setTargetItem] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState();
  const [error, setError] = useState();
  const [guide, setGuide] = useState([]);

  const video = useRef(null);
  const [status, setStatus] = useState({});

  //load material content
  useEffect(() => {

    const ac = new AbortController();

    setIsLoading(true);

    fetch(API_URL + 'material/category/Food Waste', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(results => {
        setData(results[0]);
        setIsLoading(false);
      })
      .catch(err => {
        setIsLoading(false);
        setError(err);
      });

      return () => ac.abort();

  }, []);

  //load recycle guide
  useEffect(() => {

    const ac = new AbortController();

    setIsLoading(true);

    fetch(API_URL + 'guide', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(results => {
        setGuide(results);
        setIsLoading(false);
      })
      .catch(err => {
        setIsLoading(false);
        setError(err);
      });

      return () => ac.abort();

  }, []);  


const _renderMaterials = () => {
  return data.map((item, index) => {
    return (
      <TouchableOpacity style={material == item.material ? styles.chipsItemActive : styles.chipsItem} onPress={()=>setMaterial(item.material)} key={`material-${index}`}>
        <Text style={material == item.material ? {color:"white"} : ""}>{item.material}</Text>
      </TouchableOpacity>
    )
  })
}

const _renderRecyclables = () => {
  
  // var target = data.find(el => el.material === material);

  console.log(data);

  var itemArray = [];
  var itemMediaArray = [];

  if(isRecyclable === "Recyclable"){
    itemArray = data.recyclable;
    itemMediaArray = data.recyclable_media;
  }
  else {
    itemArray = data.non_recyclable;
    itemMediaArray = data.non_recyclable_media;
  }

  return itemArray.map((item, index) => {
    return (
      <TouchableOpacity key={`material-${index}`} style={{width:"100%"}} onPress={()=>{setTargetItem({item:item,image:itemMediaArray[index]});setImageModalVisible(true);}}>
        <HStack backgroundColor="white" width="100%" rounded="lg" p="3" px="5" alignItems="center" space={4} style={styles.shadowProp}>
          <Image source={{uri:`${API_URL}static/materials/${itemMediaArray[index]}`}} alt="materials image" style={{height:60, width:60, borderRadius:50}} resizeMode="cover"/>
          <Text width="80%">{item}</Text>  
        </HStack>
      </TouchableOpacity>
    )
  })  
}

const _renderGuide = () => {
  return guide.map((item, index) => {
    return (
      <HStack alignItems="center" justifyContent="flex-start" width="full" backgroundColor="white" p="4" rounded="20" space={4} key={`guide-${index}`}>
        <Box backgroundColor="gray.100" borderRadius="100" size="20" justifyContent="center" alignItems="center">
          {/* <Text bold>{item.id}</Text> */}
          {item.id === 1 && 
            <Image source={require("../../public/assets/recycle-steps/step_1.png")} alt="action-picture" size="20"/>
          }
          {item.id === 2 && 
            <Image source={require("../../public/assets/recycle-steps/step_2.png")} alt="action-picture" size="20"/>
          }
          {item.id === 3 && 
            <Image source={require("../../public/assets/recycle-steps/step_3.png")} alt="action-picture" size="20"/>
          }
          {item.id === 4 && 
            <Image source={require("../../public/assets/recycle-steps/step_4.png")} alt="action-picture" size="20"/>
          }
          {item.id === 5 && 
            <Image source={require("../../public/assets/recycle-steps/step_5.png")} alt="action-picture" size="20"/>
          }
        </Box>
        <VStack w="4/6" space={1}>
          <Text fontSize="sm">{item.content}</Text>  
        </VStack>
      </HStack>
    )
  })
}
  

  return (

    <ImageBackground source={require("../../public/assets/bg-1-100.jpg")} style={{width:"100%", height:"100%"}}>
      {isLoading ? 
      <Center w="full" h="full">
        <Spinner size="lg" color="emerald.500"/>
      </Center> 
      : 
      <>
        {/* <Fab position="absolute" right="2" bottom="120" size="sm" icon={<Icon color="white" as={<AntDesign name="plus" />} size="sm" />} /> */}
      <VStack w="full" h="full" p="3" >
          <Modal
          animated
          animationType="slide"
          visible={modalVisible}
          transparent
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
          >
          <View style={[styles.overlay,{height:660}]}>
          <Animated.View style={[styles.container,{height:660}]}>
            <VStack space={3} style={{width:"100%", height:"100%",paddingHorizontal:32, paddingVertical:20}}>
              <ScrollView>
              {data.guide && 
                <>
                <Heading size="md" textAlign="center">Special Note</Heading>
                <VStack width="80" p="5" my="4" space={3} backgroundColor="#ffef42" rounded="2xl">
                  <Text>{data.guide}</Text>
                </VStack>
                </>}
                <Heading size="md" textAlign="center">Steps to recycle</Heading>
                <VStack width="80" py="5" space={3}>
                  {guide && _renderGuide()}
                </VStack>
                <Text textAlign="center" bold py="2">How to Recycle Correctly <Text fontStyle="italic" fontWeight="400">by WWF UK</Text></Text>
                <Video
                  ref={video}
                  style={{
                    alignSelf: 'center',
                    width: 300,
                    height: 169,
                    marginBottom: 16
                  }}
                  source={require("../../public/assets/WWF_recycle_tips.mp4")}
                  useNativeControls
                  resizeMode="contain"
                  isLooping
                  onPlaybackStatusUpdate={status => setStatus(() => status)}
                />          
              <Text textAlign="center" mb="5" w="xs">To learn more, please visit <Text style={{color:"blue", fontStyle:"italic"}} onPress={() => Linking.openURL('https://jpspn.kpkt.gov.my')}>JPSPN website</Text> for the latest information.</Text>
            <Button bordered block style={{borderRadius:20, backgroundColor:"transparent", borderColor:"#1FAA8F", borderWidth:2}} onPress={() => setModalVisible(false)}>
              <Text bold>Close</Text>
            </Button>
            </ScrollView>
          </VStack>

          </Animated.View>
          </View>
        </Modal>

        <Modal
          animated
          animationType="fade"
          visible={imageModalVisible}
          transparent
          onRequestClose={() => {
            setImageModalVisible(!imageModalVisible);
        }}>
          <Center w="full" h="full" style={{backgroundColor:"rgba(0,0,0,0.4)"}}>
            <VStack backgroundColor="gray.100" w="70%" rounded="2xl" alignItems="center" space={4} style={[{padding:40},styles.shadowProp]}>
              <Text fontSize={20} bold textAlign="center">{targetItem.item}</Text>
              <Image source={{uri:`${API_URL}static/materials/${targetItem.image}`}} alt="materials image" 
                style={[
                  styles.shadowProp,
                  {height:180, width:180, borderRadius:10, borderWidth:8},
                  isRecyclable==="Recyclable"?{borderColor:"#1FAA8F"}:{borderColor:"#dc2626"}
                ]} 
                resizeMode="cover" mb="5"
              />
              <Button w="full" bordered block style={{borderRadius:30, backgroundColor:"transparent", borderColor:"#1FAA8F", borderWidth:2}} onPress={() => setImageModalVisible(false)}>
                <Text bold>Close</Text>
              </Button>
            </VStack>
          </Center>

        </Modal>

  <VStack justifyContent="flex-start" alignItems="center" px="3" space={5} w="full" h="full">
      <Box mb="-1">
        <HStack px="3" py="2" rounded="full" style={isRecyclable === "Recyclable" ? {backgroundColor:"#1FAA8F"} : {backgroundColor:"#dc2626"}} >
          <TouchableOpacity onPress={()=>setIsRecyclable("Recyclable")}>
            <Box style={(isRecyclable=="Recyclable")? styles.active : styles.nonactive} width="32" py="1" >
              <Text textAlign="center" style={isRecyclable === "Recyclable" ? {color:"black"} : {color:"white"}} >Recyclable</Text>
            </Box>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>setIsRecyclable("Non-recyclable")}>
            <Box style={(isRecyclable=="Non-recyclable")? styles.active : styles.nonactive} width="32" py="1">
              <Text textAlign="center" style={isRecyclable === "Non-recyclable" ? {color:"black"} : {color:"white"}}>Non-recyclable</Text>
            </Box>
          </TouchableOpacity>
        </HStack>
      </Box>

      <ScrollView w="full" style={{maxHeight:400}}>
        <VStack backgroundColor="#000" w="full" justifyContent="center" alignItems="center" p="3" space={3} borderRadius="12" style={isRecyclable === "Recyclable" ? {backgroundColor:"#1FAA8F"} : {backgroundColor:"#E1E1E1"}} >
          {data && _renderRecyclables()}
        </VStack>
      </ScrollView>

      <VStack style={styles.buttongroup} w="full" space={2}>
        <Button style={styles.button} background="transparent" borderColor="#1FAA8F" onPress={()=>setModalVisible(true)}>
          <Text bold color="#1FAA8F">How to recycle?</Text>
        </Button>
        <Button style={styles.button} background="#FC8B10" borderColor="#FC8B10" onPress={(e)=>Navigation.navigate('Explore', {category:"General Waste"})}>
          <Text bold color="white">Search Collector</Text>
        </Button>
      </VStack>
  </VStack>
      </VStack>
      </>}
  </ImageBackground>
  );
};


export default () => {
    return (
      <NativeBaseProvider>
        <Center flex={1}>
          <FoodWaste/>
        </Center>
      </NativeBaseProvider>
    )
};

const styles = StyleSheet.create({
  chipsItem: {
    flexDirection:"row",
    backgroundColor:'#e8e8e8', 
    borderRadius:20,
    padding:8,
    paddingHorizontal:20, 
    marginHorizontal:10,
    height:35,
    elevation: 10,
  },
  chipsItemActive: {
    flexDirection:"row",
    backgroundColor:'#1FAA8F', 
    borderRadius:20,
    padding:8,
    paddingHorizontal:20, 
    marginHorizontal:10,
    height:35,
    elevation: 10,
  },
  icon:{
    position: "absolute",
  },
  buttongroup: {
    position: 'absolute',
    bottom:0,
  },
  button:{
    borderRadius:20, 
    borderWidth:2,
  },
  active:{
    backgroundColor:"white",
    borderRadius:50
  },
  overlay: {
    // backgroundColor: 'rgba(0,0,0,0.2)',
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
  }
});
