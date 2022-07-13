import React, { useContext, useState } from 'react';
import { ImageBackground, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { NativeBaseProvider, FormControl, Input, VStack, Center, Image, HStack, Select, CheckIcon, WarningOutlineIcon, TextArea, Text, Icon, ScrollView, Modal, Box, Heading } from "native-base";
import { AuthContext, LoadingContext } from '../context/context';
import { API_URL } from "@env";
import SelectDropdown from 'react-native-select-dropdown';

const AuthScreen = () => {

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState("recycler");
    const [password, setPassword] = useState('');
    const [state, setState] = useState('');

    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');
    const [isLogin, setIsLogin] = useState(true);

    const [emailValidation, setEmailValidation] = useState('');
    const [passwordValidation, setPasswordValidation] = useState('');

    const { signIn } = useContext(AuthContext);
    const { setIsLoading } = useContext(LoadingContext);

    const states = ['Johor', 'Kedah', 'Kelantan', 'Malacca', 'N9', 'Pahang', 'Penang', 'Perak', 'Perlis', 'Sabah', 'Sarawak', 'Selangor', 'Terengganu', 'Kuala Lumpur', 'Labuan', 'Putrajaya'];

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

    const validatePassword = (text) => {
        let reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
        if (reg.test(text) === false) {
          setPasswordValidation("Password must contain at least 8 characters, including at least 1 number, 1 lowercase and 1 uppercase character.");
        //   setEmail(text);
          return false;
        }
        else {
          setPassword(text);
          setPasswordValidation("");
        }
    }

    const onChangeHandler = () => {
        setIsLogin(!isLogin);
        setMessage('');
    };

    const onLoggedIn = (userData) => {
        fetch( API_URL + 'private', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userData.token}`, 
            },
        })
        .then(async res => { 
            try {
                const jsonRes = await res.json();
                if (res.status === 200) {
                    setMessage(jsonRes.message);
                    signIn(userData);
                }
            } catch (err) {
                console.log(err);
            };
        })
        .catch(err => {
            console.log(err);
        });
    }

    const onSubmitHandler = () => {

        const ac = new AbortController();

        setIsLoading(true);

        if(emailValidation === "" && passwordValidation === ""){
            const payload = {
                email,
                name,
                password,
                role,
                state
            };
        
            fetch( API_URL + `${isLogin ? 'login' : 'signup'}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })
            .then(async res => { 
                try {
                    const jsonRes = await res.json();
                    if (res.status !== 200) {
                        setIsError(true);
                        setMessage(jsonRes.message);
                    } else {
                        onLoggedIn(jsonRes);
                        setIsError(false);
                        setMessage(jsonRes.message);                 
                    }
                    setIsLoading(false);
                } catch (err) {
                    console.log(err);
                };
            })
            .catch(err => {
                console.log(err);
            });
        }

        return () => ac.abort();
    };

    const getMessage = () => {
        const status = isError ? `Error: ` : `Success: `;
        return status + message;
    }

    return (
        <ImageBackground source={require('../public/assets/bg-1-100.jpg')} style={{width:"100%", height:"100%"}}>
            <VStack w="full" h="full" justifyContent="center" alignItems="center" p="5" space={5}>
                <Image source={require("../public/assets/logo.png")} alt="logo" style={{width:120, height:120}}/>
                <Heading fontSize={24} bold textAlign="center">{isLogin ? 'Login' : 'Sign Up'}</Heading>

                <VStack w="full" p="5" space={2}>
                    <FormControl isRequired isInvalid={emailValidation !== ""}>
                        <Input variant="unstyled" style={styles.input} placeholder="Email" autoCapitalize="none" onChangeText={(text)=>validateEmail(text)} />
                        {emailValidation !== "" && 
                        <FormControl.ErrorMessage style={{fontSize:12, height:22, alignSelf:"flex-start", marginLeft:10, color:"red"}}>{emailValidation}</FormControl.ErrorMessage>}
                    </FormControl>

                    {!isLogin &&
                    <FormControl isRequired>
                        <Input variant="unstyled" style={styles.input} placeholder="Name" onChangeText={setName} />
                    </FormControl>}

                    <FormControl isRequired isInvalid={passwordValidation !== ""}>
                        <Input variant="unstyled" secureTextEntry={true} style={styles.input} placeholder="Password" onChangeText={(text)=>validatePassword(text)}></Input>
                        {passwordValidation !== "" && 
                        <FormControl.ErrorMessage style={{fontSize:12, height:52, alignSelf:"flex-start", marginLeft:10, color:"red"}}>{passwordValidation}</FormControl.ErrorMessage>}
                    </FormControl>

  
                {!isLogin && 
                    <SelectDropdown
                        data={states}
                        onSelect={(selectedItem, index) => {
                            console.log(selectedItem, index)
                            setState(selectedItem);
                        }}
                        buttonTextAfterSelection={(selectedItem, index) => {
                            // text represented after item is selected
                            // if data array is an array of objects then return selectedItem.property to render after item is selected
                            return selectedItem
                        }}
                        rowTextForSelection={(item, index) => {
                            // text represented for each item in dropdown
                            // if data array is an array of objects then return item.property to represent item in dropdown
                            return item
                        }}
                        defaultValueByIndex={0}
                        buttonStyle={styles.input}
                        buttonTextStyle={{textAlign:"left", height:22}}
                    />}
                <Text style={[{color: isError ? 'red' : 'green'}]}>{message ? getMessage() : null}</Text>
                </VStack>

                <VStack w="full" p="5">
                    <TouchableOpacity style={styles.button} onPress={onSubmitHandler}>
                        <Text fontSize={20} bold color="#fff">Done</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonAlt} onPress={onChangeHandler}>
                        <Text fontSize={20} bold>{isLogin ? 'Sign Up' : 'Login'}</Text>
                    </TouchableOpacity>
                </VStack>

            </VStack>
        </ImageBackground> 
    );
};

const styles = StyleSheet.create({
    image: {
        width: '100%',
        alignItems: 'center',
    },  
    form: {
        flex: 1,
        justifyContent: 'space-between',
        paddingBottom: '5%',
    },
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
          <AuthScreen />
        </Center>
      </NativeBaseProvider>
    )
  };