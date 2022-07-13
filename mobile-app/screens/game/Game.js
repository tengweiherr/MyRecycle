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
  ScrollView,
  Button,
  CheckCircleIcon,
  CloseIcon,
  Modal
} from "native-base";
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { ImageBackground, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";

import { Linking } from "react-native";
import { UserContext, LoadingContext } from "../../context/context";


export const Game = ({ navigation }) => {

  const Navigation = useNavigation(); 

  const { user,setUser } = useContext(UserContext);
  const { setIsLoading } = useContext(LoadingContext);

  const [data, setData] = useState(null);
  const [start, isStart] = useState(false);
  const [score, setScore] = useState(0);
  const [queue, setQueue] = useState(0);
  const [answered, isAnswered] = useState(false);
  const [correct, isCorrect] = useState(false);
  const [buffing, isBuffing] = useState(false);
  const [gameover, isGameover] = useState(false);
  const [level, setLevel] = useState(1);

  const [showTips, setShowTips] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const ac = new AbortController();

    setIsLoading(true);

    fetch(API_URL + 'game', {
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

      return () => ac.abort();
    
  }, [])
  

  //triggered when gameover
  const gameOverEvent = () => {

    setIsLoading(true);

    const finalpoints = parseInt(score) + parseInt(user.mr_points);

    const payload = {
        user_id: user.id,
        points_given: score,
        new_points: finalpoints,
        time: new Date(),
        event: "game",
        isGame: true
      };
    
      fetch(API_URL + "mrpoint", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body:JSON.stringify(payload)
      })
        .then(response => response.json())
        .then(results => {
          console.log(results);
          setUser((prevState)=>({...prevState,mr_points:finalpoints, last_played: payload.time}));
          setIsLoading(false);
        })
        .catch(err => {
          console.warn(err);
        });

    Navigation.pop();
  }

 const startGame = (level) => {
    isStart("true");
    setLevel(level);
 }

  const _renderQuestions = (number) => {

    let questions = [];
    switch (level) {
      case 1:
        questions = data.filter((val)=>{return val.level === 0});
        break;
      case 2:
        questions = data.filter((val)=>{return val.level === 1});
        break;    
      default:
        break;
    }

      const answerID = questions[number].answer;

      //func to check answer
      const checkAnswer = (index) => {

        // if(buffing) return "";
        isAnswered(true);
        if(index === answerID){
            setScore(parseInt(score) + parseInt(questions[number].point));
            isCorrect(true);
            // isBuffing(true);
        } else {
            isCorrect(false);
        }
        setShowTips(true);
        // setTimeout(() => {
        //   //check game over
        //   if(queue+1 === questions.length ) isGameover(true);                
        //   else setQueue(queue+1);
        //   isAnswered(false);
        //   isBuffing(false);
        // }, 1000);

      }

      const closeTips = () => {
        setShowTips(false);
        if(queue+1 === questions.length ) isGameover(true);                
        else setQueue(queue+1);
        isAnswered(false);
      }

  

      return (
        <>
        <Center justifyContent="center" alignItems="center" w="250" h="250">
            <ImageBackground source={require('../../public/assets/question_container.png')} style={{width:350, height:430}}>
                <VStack p="5" justifyContent="center" alignItems="center">
                {answered && 
                <>
                    {correct ? 
                    <>
                    {/* <Image source={require('../../public/assets/ingame_correct.png')} alt="Correct" position="relative" style={{width:50, height:40, top:27}}/> */}
                    <CheckCircleIcon color="green.600" size="10" position="absolute" style={{top:16}}/>
                    </>
                    :
                    <>
                    {/* <Image source={require('../../public/assets/ingame_incorrect.png')} alt="Incorrect" position="relative" style={{width:50, height:40, top:27}}/> */}
                    <CloseIcon color="danger.600" size="10" position="absolute" style={{top:16}}/>
                    </>
                    }
                </>}
                    <Heading color="white" textAlign="center" position="relative" fontSize="xl" style={{top:100, width:"90%"}}>{questions[number].question}</Heading>
                    <VStack h="full" justifyContent="center" alignItems="center" space={5}>
                        {questions[number].options.map((option, index)=>{
                            return (
                            <TouchableOpacity key={index} onPress={()=>checkAnswer(index)}>
                                <ImageBackground source={require('../../public/assets/answer_container.png')} alt="Play Button" style={{width:160, height:39}}>
                                    <Center>
                                        <Text bold fontSize="lg" mt="1">{option}</Text>
                                    </Center>
                                </ImageBackground>
                            </TouchableOpacity>
                            )
                        })}
                    </VStack>
                </VStack>
            </ImageBackground>
        </Center>
        <Modal isOpen={showTips} onClose={() => setShowTips(false)}>
          <Center position="absolute" h="full">
            <ImageBackground source={require('../../public/assets/game_container.png')} style={{width:360, height:290}}>
                <Center position="relative" p="10" pt="0" style={{width:360, height:290}}>
                  <Text color="white" bold fontSize="2xl" pb="2">Tips</Text>
                  <Text color="white" fontSize="md" textAlign="center">{questions[number].tips}</Text>
                  <Text color="gray.300" fontSize="xs" fontStyle="italic" position="absolute" style={{bottom:38}}>From: {questions[number].origin}</Text>
                </Center>
            </ImageBackground>
            <TouchableOpacity position="relative" style={{bottom:38}} onPress={closeTips}>
              <Image source={require('../../public/assets/close_button_1.png')} alt="Close Button" size="12"/>
            </TouchableOpacity>   
          </Center>
        </Modal>
        </>
      )
      
  }


  return (
    <ImageBackground source={require('../../public/assets/ingame_bg.png')} style={styles.image}>
    {gameover ? 
    <Box w="full" h="full" p="3" justifyContent="center" alignItems="center">
        <VStack h="380" justifyContent="flex-start" alignItems="center" space={5}>
            <Heading fontSize="3xl">Game Over!</Heading>
            <Box>
                <ImageBackground source={require('../../public/assets/ingame_score_container.png')} style={{width:180, height:72}}>
                    <Center position="relative" left="4" top="3">
                        <Text color="white" bold fontSize="3xl">{score}</Text>
                    </Center>
                </ImageBackground>
            </Box>
            <Text bold fontSize="md" textAlign="center">The points will be added to your MR Wallet.</Text>
            <Text textAlign="center" mt="-2" mb="5" w="xs">To learn more, please visit <Text style={{color:"blue", fontStyle:"italic"}} onPress={() => Linking.openURL('https://jpspn.kpkt.gov.my')}>JPSPN website</Text> for the latest information.</Text>
            <TouchableOpacity backgroundColor="transparent" onPress={gameOverEvent}>
                <Image source={require('../../public/assets/quit_button.png')} alt="Quit Button" style={{width:180, height:44}}/>
            </TouchableOpacity>
        </VStack>
    </Box> 
    : 
    <>
        <Box position="absolute" left="4" top="4">
            <ImageBackground source={require('../../public/assets/ingame_score_container.png')} style={{width:120, height:48}}>
                <Center position="relative" left="4" top="3">
                    <Text color="white" bold fontSize="md">{score}</Text>
                </Center>
            </ImageBackground>
        </Box>
        <Box w="full" h="full" p="3" justifyContent="center" alignItems="center">
            {start ? 
                (_renderQuestions(queue))
            :
            <Center justifyContent="center" alignItems="center" w="250" h="250">
                <VStack h="full" justifyContent="center" alignItems="center" space={5}>
                    <TouchableOpacity backgroundColor="transparent" onPress={()=>startGame(1)}>
                        <Image source={require('../../public/assets/level_2.png')} alt="Play Button" style={{width:210, height:51}}/>
                    </TouchableOpacity>
                    <TouchableOpacity backgroundColor="transparent" onPress={()=>startGame(2)}>
                        <Image source={require('../../public/assets/level_1.png')} alt="Quit Button" style={{width:210, height:51}}/>
                    </TouchableOpacity>
                </VStack>
            </Center>
            }
        </Box>
    </>}
            <Modal isOpen={showIntro} onClose={() => setShowIntro(false)}>
              <Center position="absolute" h="full">
                <ImageBackground source={require('../../public/assets/game_container.png')} style={{width:360, height:290}}>
                    <Center position="relative" p="10" style={{width:360, height:290}}>
                      <Text color="white" bold fontSize="xl" pb="5" textAlign="center">MyRecycle's Mini Game</Text>
                      <Text color="white" fontSize="md" textAlign="center">This game is aimed to educate the recyclers about recycling knowledge, beside earning MR Points in order to redeem rewards.</Text>
                    </Center>
                </ImageBackground>
                <TouchableOpacity position="relative" style={{bottom:38}} onPress={() => setShowIntro(false)}>
                  <Image source={require('../../public/assets/close_button_1.png')} alt="Close Button" size="12"/>
                </TouchableOpacity>   
              </Center>
            </Modal>
      </ImageBackground>
  );
};

export default () => {
  return (
    <NativeBaseProvider>
      <Center flex={1}>
        <Game />
      </Center>
    </NativeBaseProvider>
  )
};

const styles = StyleSheet.create({
  image: {
      flex: 1,
      width: '100%',
      alignItems: 'center',
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
