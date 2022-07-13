import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Stack,
  Center,
  Heading,
  ScrollView,
  VStack,
  HStack,
  Divider,
  Pressable,
  NativeBaseProvider,
  Fab,
  Icon,
  Box,
  Text,
  FlatList,
  Input,
  ActivityIndicator,
  CheckCircleIcon,
  Button,
  Spinner
} from "native-base";
import { StyleSheet, View, Animated, Modal, Image, Dimensions } from 'react-native';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { AntDesign, Ionicons } from "@expo/vector-icons"
import { API_URL } from "@env";
import LoadingScreen from "../../components/LoadingScreen";

// import { LoadingContext } from "../../context/context";

export const Product = () => {

  const Navigation = useNavigation(); 
  const isFocused = useIsFocused();
  // const { setIsLoading } = useContext(LoadingContext);
  const [isLoading, setIsLoading] = useState(true);

  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [target, setTarget] = useState("");

  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  useEffect(() => {
    setIsLoading(true);

    fetch(API_URL + 'product/status/approved', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(results => {
        setData(results);
        setFilteredData(results);
        setIsLoading(false);
      })
      .catch(err => {
        setIsLoading(false);
        setError(err);
      });
  }, []);

  // const [masterDataSource, setMasterDataSource] = useState([]);

  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update FilteredData
      const newData = data.filter(
        function (item) {
          const itemData = item.productName
            ? item.productName.toUpperCase()
            : ''.toUpperCase();
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
      });
      setFilteredData(newData);
      // setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredData with masterDataSource
      setFilteredData(data);
      // setSearch(text);
    }
  };

function handleProductNavigation (gtin){
  Navigation.navigate('Product Detail', {gtin});
};

const renderItem = ({ item }) => (
  <Box
  key={item.gtin}
  borderBottomWidth="1"
  _dark={{
    borderColor: "gray.600",
  }}
  borderColor="coolGray.200"
  pl="4"
  py="3"
  w="full"
>
 <Pressable onPress={(e)=>handleProductNavigation(item.gtin)}>
    <VStack space={1}>
      <Text _dark={{color: "warmGray.50"}} color="coolGray.800" bold>
      {item.productName}
      </Text>
      <HStack justifyContent="space-between" w="full" pr="2">
        <Text color="coolGray.400" _dark={{color: "warmGray.100"}} fontSize="xs">
          {item.gtin}
        </Text>
        <Text color="coolGray.400" _dark={{color: "warmGray.100"}} fontSize="xs">
          {item.material}
        </Text>
      </HStack>
    </VStack>
  </Pressable>
</Box>
)

  return (
    <>
    {isLoading ? <LoadingScreen /> :
    <Box w="full" h="full" p="3">

    <HStack width="100%" space={5} alignItems="center" mb="1">
      <Input
        placeholder="Search"
        variant="filled"
        width="85%"
        bg="muted.200"
        borderRadius="10"
        py="3"
        px="2"
        mr="-3"
        placeholderTextColor="gray.400"
        _hover={{ bg: 'gray.200', borderWidth: 0 }}
        borderWidth="0"
        _web={{
          _focus: { style: { boxShadow: 'none' } },
        }}
        onChangeText={(text) => searchFilterFunction(text)}
        // value={search}
        InputLeftElement={
          <Icon
            ml="2"
            size="5"
            color="gray.500"
            as={<Ionicons name="ios-search" />}
          />
        }
      />
      <Button onPress={(e)=>Navigation.navigate('Scan Barcode')} style={{borderRadius:10}} leftIcon={<Icon as={AntDesign} name="barcode" size="sm"/>}></Button>
    </HStack>

    <FlatList
    data={filteredData}
    initialNumToRender={10}
    maxToRenderPerBatch={10}
    renderItem={renderItem}
    keyExtractor={(item) => parseInt(item.gtin)}
    />
    </Box>   
    }
    </>
  );
};

export default () => {
  return (
    <NativeBaseProvider>
      <Center flex={1}>
        <Product/>
      </Center>
    </NativeBaseProvider>
  )
};
