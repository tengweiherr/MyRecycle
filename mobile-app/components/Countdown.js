import React, { useContext, useEffect, useRef, useState } from "react";
import { NativeBaseProvider, Box, Button, ScrollView, Stack, Center, Accordion, Text, Divider, List, Image, PresenceTransition, Pressable, VStack, Heading, HStack, FlatList, Spinner } from 'native-base';
import { LoadingContext,UserContext } from "../context/context";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Countdown = ({focused}) => {

    const Navigation = useNavigation(); 

    const { setIsLoading } = useContext(LoadingContext);
    const { user } = useContext(UserContext);

    const [countdown, setCountdown] = useState({
      hours: 0,
      minutes: 0,
      seconds: 0
    });

    const deadlineRef = useRef(user.last_played
      ? new Date(new Date().setTime(new Date(user.last_played).getTime()+(24*60*60*1000)))
      : 0);
    const diffFromLastPlayed = useRef(new Date());
  
    useEffect(() => {

      setIsLoading(true);

      deadlineRef.current = user.last_played
      ? new Date(new Date().setTime(new Date(user.last_played).getTime()+(24*60*60*1000)))
      : 0;

        const timerId = setInterval(() => {
            
          var Difference_In_Time = deadlineRef.current - new Date();
          var Difference_In_Days = (Difference_In_Time/(1000 * 3600 * 24));
          var Difference_In_Hours = Difference_In_Days*24;
          var Difference_In_Minutes = (Difference_In_Hours-parseInt(Difference_In_Hours.toString().split(".")[0]))*60;
          var Difference_In_Seconds = (Difference_In_Minutes-parseInt(Difference_In_Minutes.toString().split(".")[0]))*60;
    
          diffFromLastPlayed.current = Difference_In_Time / (1000 * 3600 * 24);
    
          setCountdown({
            hours: Difference_In_Hours.toString().split(".")[0],
            minutes: Difference_In_Minutes.toString().split(".")[0],
            seconds: Difference_In_Seconds.toString().split(".")[0]
          });

          setIsLoading(false);

        }, 1000);
        return () => {
          clearInterval(timerId);
        };

    }, [user.last_played])
    
    // useEffect(() => {
    //   const timerId = setInterval(() => {
    //     timerRef.current -= 1;
    //     if (timerRef.current < 0) {
    //       clearInterval(timerId);
    //     } else {
    //       setTime(timerRef.current);
    //     }
    //   }, 1000);
    //   return () => {
    //     clearInterval(timerId);
    //   };
    // }, []);
  
  return (
      <>
      {diffFromLastPlayed.current < 0 ? 
      <VStack justifyContent="flex-end" h="full">
        {/* <Text fontSize={10} textAlign="right">Available</Text> */}
        <TouchableOpacity onPress={()=>Navigation.navigate("Game")}>
          <Center backgroundColor="#FC8B10" px="3" py="1" rounded="2xl" borderWidth="1" borderColor="#FC8B10">
            <Text fontSize="sm" color="white" bold>Play Now</Text>
          </Center>
        </TouchableOpacity> 
      </VStack>
      :
      <VStack justifyContent="space-between" h="full" space={1}>
        <VStack>
          <Text textAlign="right" fontSize={12} bold color="red.500">Next game in</Text>
          <Text textAlign="right" fontSize={12} bold color="red.500">{countdown.hours>9?countdown.hours:"0"+countdown.hours}:{countdown.minutes>10?countdown.minutes:"0"+countdown.minutes}:{countdown.seconds>9?countdown.seconds:"0"+countdown.seconds}</Text>
        </VStack>
        <TouchableOpacity>
          <Center backgroundColor="gray.400" px="3" py="1" rounded="2xl" borderWidth="1" borderColor="gray.400">
            <Text fontSize="sm" color="white" bold>Play Now</Text>
          </Center>
        </TouchableOpacity> 
      </VStack>
      }
      </>
  );
};

export default () => {
    return (
      <NativeBaseProvider>
          <Countdown />
      </NativeBaseProvider>
    )
};
