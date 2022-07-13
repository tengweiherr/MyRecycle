import React, { useState, useEffect } from "react";
import { View, StyleSheet, ImageBackground, Image } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeBaseProvider,Center, Box, ScrollView, VStack, Heading, HStack, Text, FlatList, Divider } from "native-base";
import { API_URL } from "@env";

const TrackingReport = () => {

    const Navigation = useNavigation(); 

    const item = useRoute().params.item;

    const _renderImages = () => {

      const images = item.media.split(",");

      return images.map((image, index) => {
        return (
              <Image key={`report-image-${index}`} source={{uri:`${API_URL}static/reports/${image}`}} alt="reports image" style={{height:100, width:100}} resizeMode="cover"/>
        )
      })      
    }
    
  return (
    <Box w="full" h="full">
        <ImageBackground source={require('../../public/assets/bg-1-100.jpg')} style={styles.image}>
            <ScrollView w="full" p="3">
                <VStack w="full" backgroundColor="#EDF4F2" p="4" rounded="lg" space={2}>
                    <HStack justifyContent="space-between" alignItems="center" mb="1">
                        <Heading fontSize="lg" color="#E8790A">Report ID: {item.id}</Heading>
                        <Box style={(item.status=="Verified")? styles.chipsItemVerified : styles.chipsItem}>
                            <Text>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</Text>
                        </Box>
                    </HStack>
                    <Divider color="#DFEAE7"/>
                    <VStack space={2}>
                      <Text fontSize="md" fontWeight="700">{item.title}</Text>
                      <Text fontSize="xs" color="gray.600">{item.date.split('T')[0]}</Text>
                      <Text fontSize="xs" color="gray.600">{item.location}</Text>
                      <HStack backgroundColor="#DFEAE7" p="3" borderRadius={3}>
                          <Text fontSize="xs">{item.description}</Text>
                      </HStack>
                    </VStack>
                    {item.media !== "" &&
                    <HStack alignItems="center" space={1}>
                        {_renderImages()}
                    </HStack>}
                </VStack>
                <VStack p="1" py="4" space={4} style={{marginTop:16, backgroundColor:"#F9F9F9", borderRadius:8}}>
                <>
                    {item.solved_time && 
                    <HStack space={5} borderBottomWidth="1" borderBottomColor="#E9E9E9" pb="3">
                        <VStack w="1/4">
                          <Text style={item.status == "Solved" ? styles.latestState : styles.state} textAlign="right">{item.date.split('T')[0]}</Text>
                          <Text style={item.status == "Solved" ? styles.latestState : styles.state} textAlign="right">{item.date.split('T')[1].split(':')[0]}:{item.date.split('T')[1].split(':')[1]}</Text>
                        </VStack>
                        <VStack w="2/3" >
                          <Text style={item.status == "Solved" ? styles.latestState : styles.state}>Your report has been solved. Thank you for reporting.</Text>
                          {item.solved_comment?
                          <VStack mt="1">
                            <Text fontSize="12" fontStyle="italic">Comment from JPSPN:</Text>
                            <Text fontSize="12" fontStyle="italic">{item.solved_comment}</Text>
                          </VStack>
                          :<></>}
                        </VStack>                    
                    </HStack>}
                    {item.rejected_time && 
                    <HStack space={5} borderBottomWidth="1" borderBottomColor="#E9E9E9" pb="3">
                        <VStack w="1/4">
                          <Text style={item.status == "Rejected" ? styles.rejectedState : styles.state} textAlign="right">{item.date.split('T')[0]}</Text>
                          <Text style={item.status == "Rejected" ? styles.rejectedState : styles.state} textAlign="right">{item.date.split('T')[1].split(':')[0]}:{item.date.split('T')[1].split(':')[1]}</Text>
                        </VStack>
                        <VStack w="2/3" >
                          <Text style={item.status == "Rejected" ? styles.rejectedState : styles.state}>Your report has been rejected. It is either misreporting or containing incorrect information. Please resubmit it with correct information.</Text>
                          {item.rejected_comment?
                          <VStack mt="1">
                            <Text fontSize="12" fontStyle="italic">Comment from JPSPN:</Text>
                            <Text fontSize="12" fontStyle="italic">{item.rejected_comment}</Text>
                          </VStack>
                          :<></>}
                        </VStack>                    
                    </HStack>}
                    {item.in_progress_time && 
                    <HStack space={5} borderBottomWidth="1" borderBottomColor="#E9E9E9" pb="3">
                        <VStack w="1/4">
                          <Text style={item.status == "In Progress" ? styles.latestState : styles.state} textAlign="right">{item.date.split('T')[0]}</Text>
                          <Text style={item.status == "In Progress" ? styles.latestState : styles.state} textAlign="right">{item.date.split('T')[1].split(':')[0]}:{item.date.split('T')[1].split(':')[1]}</Text>
                        </VStack>
                        <VStack w="2/3" >
                          <Text style={item.status == "In Progress" ? styles.latestState : styles.state}>Your report has been accepted and now being in progress. Please wait for further update.</Text>
                          {item.in_progress_comment &&
                          <VStack mt="1">
                            <Text fontSize="12" fontStyle="italic">Comment from JPSPN:</Text>
                            <Text fontSize="12" fontStyle="italic">{item.in_progress_comment}</Text>
                          </VStack>}
                        </VStack>
                    </HStack>}
                    {item.verified_time && 
                    <HStack space={5} borderBottomWidth="1" borderBottomColor="#E9E9E9" pb="3">
                        <VStack w="1/4">
                          <Text style={item.status == "Verified" ? styles.latestState : styles.state} textAlign="right">{item.date.split('T')[0]}</Text>
                          <Text style={item.status == "Verified" ? styles.latestState : styles.state} textAlign="right">{item.date.split('T')[1].split(':')[0]}:{item.date.split('T')[1].split(':')[1]}</Text>
                        </VStack>
                        <VStack w="2/3" >
                          <Text style={item.status == "Verified" ? styles.latestState : styles.state}>Your report has been verified. It is now being forwarded to Head of JPSPN officer for further action.</Text>
                          {item.verified_comment &&
                          <VStack mt="1">
                            <Text fontSize="12" fontStyle="italic">Comment from JPSPN:</Text>
                            <Text fontSize="12" fontStyle="italic">{item.verified_comment}</Text>
                          </VStack>}
                        </VStack>
                    </HStack>}
                    </>

                    <HStack space={5}>
                        <VStack w="1/4">
                          <Text style={item.status == "Pending" ? styles.latestState : styles.state} textAlign="right">{item.date.split('T')[0]}</Text>
                          <Text style={item.status == "Pending" ? styles.latestState : styles.state} textAlign="right">{item.date.split('T')[1].split(':')[0]}:{item.date.split('T')[1].split(':')[1]}</Text>
                        </VStack>
                        <Text w="2/3" style={item.status == "Pending" ? styles.latestState : styles.state}>You have filed the report.</Text>
                    </HStack>

                </VStack>

            </ScrollView>
        </ImageBackground>
    </Box>
  );
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
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
  chipsItemVerified: {
    flexDirection:"row",
    backgroundColor:'#E8E31F', 
    borderRadius:20,
    padding:8,
    paddingHorizontal:20, 
    marginHorizontal:10,
    height:35,
    elevation: 10,
  },
  chipsItemInProgress: {
    flexDirection:"row",
    backgroundColor:'#6DB6F2', 
    borderRadius:20,
    padding:8,
    paddingHorizontal:20, 
    marginHorizontal:10,
    height:35,
    elevation: 10,
  },
  chipsItemSolved: {
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
  state:{
      color:"#7C7C7C",
      fontSize:12
  },
  latestState:{
    color:"#1FAA8F",
    fontWeight:"700",
    fontSize:12
  },
  rejectedState:{
    color:"#C42E10",
    fontWeight:"700",
    fontSize:12
  },
});

export default () => {
    return (
      <NativeBaseProvider>
        <Center flex={1}>
          <TrackingReport/>
        </Center>
      </NativeBaseProvider>
    )
  };