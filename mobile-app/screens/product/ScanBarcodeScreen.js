import { NativeBaseProvider, Box, Button, ScrollView, Stack, Center, Accordion, Text, Divider, List, Image, PresenceTransition, Pressable } from 'native-base';
import React, { useState, useEffect } from 'react';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useNavigation } from '@react-navigation/native';

export const ScanBarcode = () => {
  
  const navigation = useNavigation({navigation}); 

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    var gtin = data;
    navigation.navigate('Product Detail', {gtin});
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
      <>
        <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={{ height:"100%", width:"100%"}}/>
       {scanned && <Button w="5/6" backgroundColor="#fff" style={{borderRadius:20, borderColor:"#fff", borderWidth:2, position:"absolute", bottom:20}} onPress={() => setScanned(false)}><Text bold color="#1FAA8F">Scan again</Text></Button>}
      </>

  );
};


export default () => {
    return (
      <NativeBaseProvider>
        <Center flex={1} >
          <ScanBarcode />
        </Center>
      </NativeBaseProvider>
    )
};