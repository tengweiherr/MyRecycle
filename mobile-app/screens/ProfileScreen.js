import React, { useContext, useEffect, useState } from "react";
import { ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeBaseProvider, Button, FormControl, Input, VStack, Center, Image, HStack, Select, CheckIcon, WarningOutlineIcon, TextArea, Text, Icon, ScrollView, Modal, Box, Heading } from "native-base";
import { API_URL } from "@env";
import SelectDropdown from 'react-native-select-dropdown'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from "@react-navigation/native";
import { LoadingContext } from "../context/context";

const Profile = () => {

  const [userData, setUserData] = useState(null);
  const { setIsLoading } = useContext(LoadingContext);

  //formData
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [state, setState] = useState('');
  const [role, setRole] = useState("recycler");
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  const [isChangePassword, setIsChangePassword] = useState(false);

  const [emailValidation, setEmailValidation] = useState('');
  const [passwordValidation, setPasswordValidation] = useState('');

  const Navigation = useNavigation(); 

  const states = ['Johor', 'Kedah', 'Kelantan', 'Malacca', 'N9', 'Pahang', 'Penang', 'Perak', 'Perlis', 'Sabah', 'Sarawak', 'Selangor', 'Terengganu', 'Kuala Lumpur', 'Labuan', 'Putrajaya'];

    //get user data
    const getUserData = async () => {
      try {
        const value = await AsyncStorage.getItem('user');
        if (value !== null) {
          // We have data!!
          setUserData(JSON.parse(value));
          setEmail(JSON.parse(value).email);
          setName(JSON.parse(value).name);
          setState(JSON.parse(value).state);

        }
      } catch (error) {
        // Error retrieving data
        console.log(error);
      }
    }; 
  
    //get user data
    useEffect(() => {
      getUserData();
    }, [])

  //get user data
  const updateUserData = async (newUserData) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(newUserData));
    } catch (error) {
      // Error retrieving data
      console.log(error);
    }
  }; 
    
  const validateEmail = (text) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(text) === false) {
      setEmailValidation("Incorrect email format");
    //   setEmail(text);
      return false;
    }
    else {
      setEmail(text);
      setEmailValidation("");
    }
}

const validatePassword = (text, whichpassword) => {

  if(whichpassword === 1){
    let reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
    if (reg.test(text) === false) {
      setPasswordValidation("Password must contain at least 8 characters, including at least 1 number, 1 lowercase and 1 uppercase character.");
      return false;
    }
    else {
      setPassword(text);
      setPasswordValidation("");
    }
  }
  else setPassword2(text);
}

  const onSubmitHandler = () => {

    const ac = new AbortController();

    setIsLoading(true);

    if((password === password2) && userData){

      const payload = {
          id: userData.id,
          email,
          name,
          password,
          role,
          state,
          mr_points: userData.mr_points
      };

      fetch(API_URL + 'user/' + payload.id, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })
        .then(response => response.json())
        .then(results => {
          setEmail(results.email);
          setName(results.name);
          setState(results.state);
          updateUserData(payload);
          alert("Update success");
          setIsLoading(false);
          Navigation.goBack();
        })
        .catch(err => {
          console.log(err);
          setIsLoading(false);
        });   

      }  

    return () => ac.abort();
};

  return (
      <ImageBackground source={require('../public/assets/bg-1-100.jpg')} style={{width:"100%", height:"100%"}}>
        <VStack w="full" h="full" justifyContent="center" alignItems="center" p="5" space={5}>
          <Heading fontSize={24} bold textAlign="center">Update Account</Heading>
          <VStack w="full" p="5" space={2}>
            <FormControl isRequired isInvalid={emailValidation !== ""}>
              <Input variant="unstyled" style={styles.input} placeholder="Email" autoCapitalize="none" value={email} onChangeText={(text)=>validateEmail(text)} />
              {emailValidation !== "" && 
              <FormControl.ErrorMessage style={{fontSize:12, height:22, alignSelf:"flex-start", marginLeft:10, color:"red"}}>{emailValidation}</FormControl.ErrorMessage>}
            </FormControl>

            <FormControl isRequired>
              <Input variant="unstyled" style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
            </FormControl>

            {isChangePassword && 
            <>
            <FormControl isRequired isInvalid={passwordValidation !== ""}>
              <Input variant="unstyled" secureTextEntry={true} style={styles.input} placeholder="New Password" onChangeText={(text)=>validatePassword(text,1)}></Input>
              {passwordValidation !== "" && 
                <FormControl.ErrorMessage style={{fontSize:12, alignSelf:"flex-start", marginLeft:10, color:"red"}}>{passwordValidation}</FormControl.ErrorMessage>}
            </FormControl>
            <FormControl isRequired isInvalid={password !== password2}>
              <Input variant="unstyled" secureTextEntry={true} style={styles.input} placeholder="Enter New Password Again" onChangeText={(text)=>validatePassword(text,2)}></Input>
              {password !== password2 && 
                <FormControl.ErrorMessage style={{fontSize:12, alignSelf:"flex-start", marginLeft:10, color:"red"}}>Password not matched.</FormControl.ErrorMessage>
              }
            </FormControl>
            </>
            }

                <SelectDropdown
                    data={states}
                    onSelect={(selectedItem, index) => {
                        setState(selectedItem);
                    }}
                    buttonTextAfterSelection={(selectedItem, index) => {
                        return selectedItem
                    }}
                    rowTextForSelection={(item, index) => {
                        return item
                    }}
                    defaultValue={state}
                    buttonStyle={styles.input}
                    buttonTextStyle={{textAlign:"left", height:22}}
                />

            </VStack>

            <VStack w="full" p="5">
              <TouchableOpacity style={styles.button} onPress={onSubmitHandler}>
                <Text fontSize={20} bold color="#fff">Update</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonAlt} onPress={()=>setIsChangePassword(!isChangePassword)}>
                <Text fontSize={20} bold>{isChangePassword ? "Cancel" : "Change Password"}</Text>
              </TouchableOpacity>
            </VStack>
          </VStack>
        </ImageBackground>
  );
};

const styles = StyleSheet.create({
  input: {
      width: '100%',
      borderWidth: 1.5,
      borderColor: '#1FAA8F',
      borderRadius: 30,
      padding: 16,
      fontSize: 16, 
      minHeight: 54,
  },
  button: {
      width: '100%',
      backgroundColor: '#1FAA8F',
      height: 40,
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 5,
  },
  buttonAlt: {
      width: '100%',
      borderWidth: 1.5,
      height: 40,
      borderRadius: 50,
      borderColor: '#E9F4F1',
      backgroundColor: '#E9F4F1',
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 5,
  }
});

export default () => {
  return (
    <NativeBaseProvider>
      <Center flex={1}>
        <Profile />
      </Center>
    </NativeBaseProvider>
  )
};