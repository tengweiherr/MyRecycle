import { NativeBaseProvider, Button, FormControl, Input, VStack, Center, Image, HStack, Select, CheckIcon, WarningOutlineIcon, TextArea, Text, Icon, ScrollView, Modal, AspectRatio } from "native-base";
import React, { useState, useRef, useEffect, useContext } from "react";
import { View, StyleSheet, ImageBackground, TouchableOpacity, Dimensions, Picker } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from "react-datepicker";
import { useNavigation, useRoute } from '@react-navigation/native';
import { AntDesign, Ionicons, Entypo } from "@expo/vector-icons"
import MapView, {PROVIDER_GOOGLE} from "react-native-maps";
import Geocoder from 'react-native-geocoding';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";
import { UserContext,LoadingContext } from "../../context/context";
import LoadingScreen from "../../components/LoadingScreen";

Geocoder.init("AIzaSyCQoDI7E-OJ9RCK4MN7ykJqISCjIO6DwoU");

const SubmitProduct = () => {

  const productgtin = JSON.stringify(useRoute().params.productgtin).replace('"','').replace('"','');

  const Navigation = useNavigation(); 

  // const { setIsLoading } = useContext(LoadingContext);
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useContext(UserContext);

  const [formData, setFormData] = useState({
    gtin:productgtin,
    productName:"",
    material: "",
    recyclable: "",
    status:"Pending",
    submit_email: user.email,
    media: "",
    material_id: 0
  });

  const [errors, setErrors] = useState({});
  const [image, setImage] = useState(null);
  const [selection, setSelection] = useState([]);


useEffect(() => {

  const ac = new AbortController();

  setFormData((prevState)=>({...prevState, submit_email:user.email}));

  setIsLoading(true);

  fetch(API_URL + "material", {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.json())
    .then(results => {
      setSelection(results);
      setIsLoading(false);
    })
    .catch(err => {
      setErrors(err);
    });
    return () => ac.abort();

}, [])

const _renderSelection = () => {
  return selection.map((item, index) => {
    return (
      <Select.Item label={item.material} value={item.id} style={{backgroundColor:"#ffffff"}} key={`selection-${index}`}/>
    )
  })
}

  //validation
  const validate = () => {
    if (formData.productName === "") {
      setErrors({ ...errors,
        name: 'Product name is required'
      });
      return false;
    } 
    if (formData.material === "") {
      setErrors({ ...errors,
        category: 'Material is required'
      });
      return false;
    }
    if (formData.recyclable === "") {
      setErrors({ ...errors,
        location: 'Recyclable is required'
      });
      return false;
    }
    return true;
  };

  const onSubmit = () => {

    const ac = new AbortController();

    if(validate){

      setIsLoading(true);

      let formdata = new FormData();
      formdata.append("gtin", formData.gtin)
      formdata.append("productName", formData.productName)
      formdata.append("material", selection.find(x => x.id === formData.material_id).material)
      formdata.append("recyclable", formData.recyclable)
      formdata.append("location", formData.location)
      formdata.append("status", "Pending")
      formdata.append("submit_email", formData.submit_email)
      formdata.append("media", {uri: image, name: 'image.jpg', type: 'image/jpg'});
      formdata.append("material_id", formData.material_id)      

      fetch( API_URL + 'product', {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formdata,
      })
      .then(response => response.json())
      .then(results => { 
        console.log(results);
          alert("Thank you for submitting the product to us. We will verify it and update it in the product database.");   
          Navigation.pop(3);  
          setIsLoading(false);
      })
      .catch(err => {
          console.log(err);
          setIsLoading(false);
      });
    }else{
      alert('Validation Failed');
    }
    return () => ac.abort();

  };

  const takePhoto = async () => {

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
    });
  
    if (result.cancelled) {
      return;
    }
  
    setImage(result.uri);
  
  };


  return (
    <>
    {isLoading ? <LoadingScreen/> : 
    <ScrollView width="100%">
    <VStack width="100%" p="5" space={5}>
        {image ? 
          <AspectRatio w="100%" ratio={1 / 1}>
            <Image source={{uri: image}} alt="image" />
          </AspectRatio>
        : 
          <Button w="100%" h="140" backgroundColor="#e8e8e8" onPress={takePhoto}>
            <Center backgroundColor="transparent">
              <Text>Take Photo</Text>
            </Center>
          </Button>
        }
      <FormControl isRequired>
        <FormControl.Label _text={{bold: true}}>GTIN</FormControl.Label>
          <Input style={styles.input} backgroundColor="#EAEAEA" p="3" placeholder="GTIN" value={productgtin} isReadOnly={true}/>
      </FormControl>
      <FormControl isRequired isInvalid={'productName' in errors}>
        <FormControl.Label _text={{bold: true}}>Product Name</FormControl.Label>
        <Input style={styles.input} backgroundColor="#EAEAEA" p="3" placeholder="Product Name" onChangeText={value => setFormData({ ...formData,
        productName: value
      })} />
      </FormControl>

      <FormControl isRequired isInvalid={'material' in errors}>
        <FormControl.Label _text={{bold: true}}>Material</FormControl.Label>
        <Select accessibilityLabel="Choose Material" placeholder="Choose Material" 
        onValueChange={value => setFormData({ ...formData,material_id: parseInt(value)})}>
          {_renderSelection()}
        </Select>
        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
          Please make a selection!
        </FormControl.ErrorMessage>
      </FormControl>

      <FormControl isRequired isInvalid={'recyclable' in errors}>
        <FormControl.Label _text={{bold: true}}>Recyclable?</FormControl.Label>
        <Select accessibilityLabel="Choose" placeholder="Choose" _selectedItem={{
        bg: "teal.600",
        endIcon: <CheckIcon size={5} />
        }}
        onValueChange={value => setFormData({ ...formData,recyclable: value})}>
          <Select.Item label="Yes" value="yes" />
          <Select.Item label="No" value="no" />
          <Select.Item label="Partly" value="partly" />
        </Select>
        
      </FormControl>

      <Button block mt="5" backgroundColor="#1FAA8F" style={styles.button} onPress={onSubmit}>
          <Text bold color="white">Submit</Text>
        </Button>

    </VStack>     
    </ScrollView>
    }
    </>
  );
};

export default () => {
  return (
    <NativeBaseProvider>
      <Center flex={1} p="3">
        <SubmitProduct/>
      </Center>
    </NativeBaseProvider>
  )
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
    justifyContent: "center"
  },
  button: {
    borderRadius:20, 
    borderColor:"#1FAA8F", 
    borderWidth:2,
  },
  input: {
    borderRadius:20, 
    fontSize:14,
  },
  datepicker: {
    width:130,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  map: {
    width: 400,
    height: 500,
  },
});
