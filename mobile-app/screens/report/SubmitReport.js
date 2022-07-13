import { NativeBaseProvider, Button, FormControl, Input, VStack, Center, Image, HStack, Select, CheckIcon, WarningOutlineIcon, TextArea, Text, Icon, ScrollView, Modal } from "native-base";
import React, { useState, useRef, useEffect, useContext } from "react";
import { View, StyleSheet, ImageBackground, TouchableOpacity, Dimensions } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from "react-datepicker";
import { useNavigation, useRoute } from '@react-navigation/native';
import { AntDesign, Ionicons, Entypo } from "@expo/vector-icons"
import MapView, {PROVIDER_GOOGLE} from "react-native-maps";
import Geocoder from 'react-native-geocoding';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL,GOOGLE_API_KEY } from "@env";
import * as Location from 'expo-location';
import * as Permissions from "expo-permissions";
import { LoadingContext } from "../../context/context";

Geocoder.init(GOOGLE_API_KEY);

const SubmitReport = () => {

  // var addressPicked = JSON.stringify(useRoute().params.address).replace('"','').replace('"','');

  const Navigation = useNavigation(); 

  const [formData, setData] = useState({
    title:"",
    category:"",
    date: new Date(),
    location: "",
    description:"",
    reporter_email: "",
    status: "Pending"
  });

  const [userData, setUserData] = useState();
  const [errors, setErrors] = useState({});
  const [date, setDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [image, setImage] = useState([]);

  const mapRef = useRef(null);
  const { setIsLoading } = useContext(LoadingContext);

  //get user data
  const getUserData = async () => {
    setIsLoading(true);
    try {
      const value = await AsyncStorage.getItem('user');
      if (value !== null) {
        // We have data!!
        setUserData(JSON.parse(value));
      }
      setIsLoading(false);
    } catch (error) {
      // Error retrieving data
      console.log(error);
      setIsLoading(false);
    }
  }; 

  //get user data
  useEffect(() => {
    getUserData();
  }, [])

  const [region, setRegion] = useState(null);

  //get current location
  const [currentLocation, setCurrentLocation] = useState(null);

  //search text
  const [search, setSearch] = useState("");

  //address to pass
  const [address, setAddress] = useState("");

  useEffect(() => {

    setIsLoading(true);

    //get current location
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.warn('Permission to access location was denied');
          return;
        }
        let location = await Location.getCurrentPositionAsync({});
        setRegion(location);
        setCurrentLocation(location);
        setIsLoading(false);

      })();
      
  }, [])

  //search address
  const searchAddress = () => {

      //converting text to coordinate
      Geocoder.from(search)
  .then(json => {
    var location = json.results[0].geometry.location;
          var target = {
              latitude: location.lat,
              longitude: location.lng,
              latitudeDelta: 0.001,
              longitudeDelta: 0.001,
            };
          setAddress(search);
          //animate the mapview
          mapRef.current.animateToRegion(target, 3 * 1000);
  })
  .catch(error => {
          console.warn(error);
          alert("Address not found.");
      });
  }

  //on Drag mapview
  const onRegionChange = (region) => {

      //converting coordinate to text
      Geocoder.from(region.latitude, region.longitude)
  .then(json => {
        var addressComponent = json.results[0].formatted_address;
          setAddress(addressComponent);
  })
  .catch(error => console.warn(error));
  }

  const handleAddress = () => {
    setData({ ...formData,location: address});
    setShowModal(false);
  }

  //validation
  const validate = () => {
    if (formData.title === "") {
      setErrors({ ...errors,
        name: 'Title is required'
      });
      return false;
    } 
    else {
      setErrors(prevState =>{ 
        const state = {...prevState};
        state.name = undefined;
        return state;
      });      
    };
    if (formData.category === "") {
      setErrors({ ...errors,
        category: 'Category is required'
      });
      return false;
    }
    if (formData.location === "") {
      setErrors({ ...errors,
        location: 'Location is required'
      });
      return false;
    }
    if (formData.description === "") {
      setErrors({ ...errors,
        description: 'Description is required'
      });
      return false;
    }
    // else if (formData.name.length < 3) {
    //   setErrors({ ...errors,
    //     name: 'Name is too short'
    //   });
    //   return false;
    // }
    return true;
    // if(formData.title !== "" && formData.category !== "" && formData.location !== "" && formData.description !== "") return true;
    // else return false;
  };

  const onSubmit = () => {

    const ac = new AbortController();

    setIsLoading(true);

    setData({ ...formData,date: date});

    let formdata = new FormData();
    formdata.append("title", formData.title)
    formdata.append("description", formData.description)
    formdata.append("date", formData.date.toUTCString())
    formdata.append("category", formData.category)
    formdata.append("location", formData.location)
    formdata.append("status", "Pending")
    formdata.append("userId", userData.id)

    for (let index = 0 ; index < image.length ; index++) {
      formdata.append("media", {uri: image[index], name: 'image.jpg', type: 'image/jpg'});
    }
  
    if(validate()){
  
      fetch( API_URL + 'report', {
          method: 'POST',
          headers: {
              'Content-Type': 'multipart/form-data',
          },
          body: formdata,
      })
      .then(response => response.json())
      .then(results => { 
          console.log(results);
          alert("Thank you for reporting to us. We will update the progress as soon as we can.");     
          setIsLoading(false);
          Navigation.pop();          
      })
      .catch(err => {
          console.log(err);
          setIsLoading(false);
      });
      console.log(formData);
    }else{
      alert('Validation Failed');
      setIsLoading(false);
    }

    return () => ac.abort();

  };


const onChangeDate = (event, selectedDate) => {
  const currentDate = selectedDate || date;
  setDate(currentDate);
  setData({ ...formData,date: currentDate});
  console.log(formData);
};


const uploadPhoto = async () => {
  // No permissions request is necessary for launching the image library
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });

  if (!result.cancelled) {
    setImage(oldArray => [...oldArray, result.uri]);
  }

};

const takePhoto = async () => {

  let result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [1, 1],
  });

  if (result.cancelled) {
    return;
  }

  setImage(oldArray => [...oldArray, result.uri]);

};

  return (
    <>
    {region && 
    <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
    <Modal.Content w="5/6" h="5/6">
      <Modal.Header>Pick Location</Modal.Header>
      <Modal.CloseButton/>
      <Modal.Body>
      <Center>
        <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        showsPointsOfInterest={true}
        showsMyLocationButton={true}
        followsUserLocation={true}
        initialRegion={{
          latitude: region.coords.latitude,
          longitude: region.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        onRegionChangeComplete={onRegionChange}
        />
        <HStack width="100%" space={5} alignItems="center" px="1" py="1" style={{position:"absolute", top:-6}}>
            <Input
            placeholder="Search"
            variant="filled"
            width="85%"
            bg="white"
            borderRadius="10"
            py="2"
            px="2"
            mr="-3"
            placeholderTextColor="gray.400"
            _hover={{ bg: 'gray.200', borderWidth: 0 }}
            borderWidth="0"
            _web={{
                _focus: { style: { boxShadow: 'none' } },
            }}
            style={{
                shadowColor: '#ccc',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.8,
                shadowRadius: 5,
            }}                
            InputLeftElement={
                <Icon
                ml="2"
                size="4"
                color="gray.500"
                as={<Ionicons name="ios-search" />}
                />
                
            }
            onChangeText={value => setSearch(value)}
            />
            <Button onPress={() => searchAddress()} style={{borderRadius:10, backgroundColor:"#1FAA8F"}} leftIcon={<Icon as={AntDesign} name="search1" size="xs"/>}></Button>

        </HStack>
        <VStack 
        style={{
            borderRadius:15, 
            position:"absolute", 
            bottom:28, 
            backgroundColor:"white",
            shadowColor: '#ccc',
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.8,
            shadowRadius: 5,}} 
        width="100%" alignItems="center" size="lg" p="3">
            <Text color="black" p="1" mb="2" fontSize="xs">{address}</Text>
            <Button onPress={handleAddress} style={{borderRadius:25, backgroundColor:"#1FAA8F"}} width="100%" alignItems="center">
              <Text fontSize="xs" color="#fff" bold>Set Location</Text>
            </Button>
        </VStack>
        <Center style={{position:"absolute"}}>
            <Image style={{height:28, width:28}} source={require('../../public/assets/map_marker.png')} alt="marker"/>
        </Center>
      </Center>
      </Modal.Body>
    </Modal.Content>
  </Modal>}

    <ScrollView>
    <VStack width="100%" p="5" space={3}>
      <FormControl isRequired isInvalid={'name' in errors}>
        <FormControl.Label _text={{bold: true}}>Title</FormControl.Label>
        <Input style={styles.input} backgroundColor="#EAEAEA" p="3" placeholder="Title" onChangeText={value => setData({ ...formData,
        title: value
      })} />
        {errors.name === undefined && <FormControl.ErrorMessage>{errors.name}</FormControl.ErrorMessage>}
      </FormControl>
      <HStack>
        {/* <FormControl w="50%" isRequired isInvalid={'date' in errors}>
          <FormControl.Label _text={{bold: true}}>Date</FormControl.Label>
            <DateTimePicker
            // testID="dateTimePicker"
            value={date}
            mode="datetime"
            is24Hour={true}
            display="default"
            onChange={onChangeDate}
            style={styles.datepicker}
            />

        </FormControl> */}

        <FormControl w="100%" isRequired isInvalid={'category' in errors}>
        <FormControl.Label _text={{bold: true}}>Category</FormControl.Label>
        <Select accessibilityLabel="Choose Service" placeholder="Choose Category" _selectedItem={{
        bg: "teal.600",
        endIcon: <CheckIcon size={5} />
        }} mt="1"
        onValueChange={value => setData({ ...formData,category: value})}>
          <Select.Item label="Environment" value="environment" />
          <Select.Item label="Facility" value="facility" />
          <Select.Item label="Others" value="others" />
        </Select>
        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
          Please make a selection!
        </FormControl.ErrorMessage>
      </FormControl>
      </HStack>

      <FormControl isRequired isInvalid={'location' in errors}>
        <FormControl.Label _text={{bold: true}}>Location</FormControl.Label>
        <Button onPress={()=>setShowModal(true)} style={styles.input} backgroundColor="#EAEAEA" p="3">
          <Text>{formData.location}</Text>
        </Button>
        {errors.location === undefined ? <FormControl.ErrorMessage>{errors.location}</FormControl.ErrorMessage> : <></>}
      </FormControl>

      <FormControl isRequired isInvalid={'description' in errors}>
        <FormControl.Label _text={{bold: true}}>Description</FormControl.Label>
        <TextArea h="40" style={styles.input} backgroundColor="#EAEAEA" p="3" placeholder="Description" onChangeText={value => setData({ ...formData,
        description: value
      })} />
        {errors.description === undefined ?  <FormControl.ErrorMessage>{errors.description}</FormControl.ErrorMessage> : <></>}
      </FormControl>

        <HStack space={2} mt="3" alignItems="center" justifyContent="center">
        <Button w="48%" style={styles.button} backgroundColor="transparent" onPress={uploadPhoto}>
          <HStack space={2} alignItems="center" justifyContent="center">
            <Text bold>Upload Photo</Text>
          </HStack>
        </Button>
        <Button w="48%" style={styles.button} backgroundColor="transparent" onPress={takePhoto}>
          <HStack space={2} alignItems="center" justifyContent="center">
            <Text bold>Take Photo</Text>
          </HStack>
        </Button>
        </HStack>

        <HStack space={1}>
          {image.map( e =>
          <Image source={{uri: e}} alt="Alternate Image" size="md"/>
          )}
        </HStack>

      <Button block mt="5" backgroundColor="#1FAA8F" style={styles.button} onPress={onSubmit}>
        <Text bold color="white">Submit</Text>
      </Button>

    </VStack>
    </ScrollView>
    </>
  );
};

export default () => {
  return (
    <NativeBaseProvider>
      <Center flex={0} p="3">
        <SubmitReport/>
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
    width: 330,
    height: 490,
  },
});
