import React, { useEffect, useState } from "react";
import { NativeBaseProvider, Box, Button, ScrollView, Stack, Center, Accordion, Text, Divider, List, Image, PresenceTransition, Pressable, VStack, Heading, HStack, FlatList, Spinner } from 'native-base';


export const LoadingScreen = () => {
  
  return (
    <Center w="full" h="full">
      <Spinner size="lg" color="#1FAA8F"/>
      {/* <Image marginBottom={8} source={require("../public/assets/loading-animation_text.gif")} alt="Alternate Text" size="full" /> */}
    </Center>
  );
};

export default () => {
    return (
      <NativeBaseProvider>
        <Center flex={1}>
          <LoadingScreen />
        </Center>
      </NativeBaseProvider>
    )
};
