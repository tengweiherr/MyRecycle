import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "../HomeScreen";
import EWaste from "../guide/EWasteScreen";
import GeneralWaste from "../guide/GeneralWasteScreen";
import FoodWaste from "../guide/FoodWasteScreen";
import CookingOil from "../guide/CookingOilScreen";
import BeforeRecycle from "../explore/BeforeRecycle";
import ExploreScreen from "../explore/ExploreScreen";
import ProductListScreen from "../product/ProductListScreen";
import ScanBarcodeScreen from "../product/ScanBarcodeScreen";
import ProductDetailScreen from "../product/ProductDetailScreen";
import ReportScreen from "../report/ReportScreen";
import SubmitReport from "../report/SubmitReport";
import TrackingReport from "../report/TrackingReport";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SubmitProduct from "../product/SubmitProduct";
import MRWallet from "../reward/MRWallet";
import ConversionRates from "../reward/ConversionRates";
import RewardList from "../reward/RewardList";
import Game from "../game/Game";

const GuideStack = createStackNavigator();
const ExploreStack = createStackNavigator();
const ProductStack = createStackNavigator();
const ReportStack = createStackNavigator();
const RewardStack = createStackNavigator();
const GameStack = createStackNavigator();

const screenOptionStyle = {
  headerStyle: {
    backgroundColor: "white",
  },
  headerTintColor: "black",
  headerBackTitle: "Back",
};

const GuideStackNavigator = ({navigation}) => {
  return (
    <GuideStack.Navigator screenOptions={screenOptionStyle} >
      <GuideStack.Screen name="Home" component={HomeScreen} options={{
          headerLeft:() =>(
              <Icon.Button name="menu" size={25} color="black" backgroundColor="transparent" onPress={()=>navigation.openDrawer()}></Icon.Button>
          ),
          cardStyle: { flex: 1 }
      }}/>
      <GuideStack.Screen name="GeneralWaste" options={{ title: 'Sorting Guide' }} component={GeneralWaste} />
      <GuideStack.Screen name="EWaste"  options={{ title: 'Sorting Guide' }} component={EWaste} />
      <GuideStack.Screen name="FoodWaste"  options={{ title: 'Sorting Guide' }} component={FoodWaste} />
      <GuideStack.Screen name="CookingOil"  options={{ title: 'Sorting Guide' }} component={CookingOil} />
      <GuideStack.Screen name="Reward"  options={{ title: 'MR Wallet' }} component={RewardStackNavigator} />
      <GuideStack.Screen name="Game"  options={{ title:"" }} component={GameStackNavigator} />
    </GuideStack.Navigator>
  );
}

const ExploreStackNavigator = ({navigation}) => {
  return (
    <ExploreStack.Navigator screenOptions={screenOptionStyle} >
      <ExploreStack.Screen name="Before Recycle" component={BeforeRecycle}/>
      <ExploreStack.Screen name="Explore" component={ExploreScreen}/>
    </ExploreStack.Navigator>
  );
}

const ProductStackNavigator = ({navigation}) => {
  return (
    <ProductStack.Navigator screenOptions={screenOptionStyle}>
      <ProductStack.Screen name="Search Product" component={ProductListScreen} options={{
          headerLeft:() =>(
              <Icon.Button name="menu" size={25} backgroundColor="transparent" onPress={()=>navigation.openDrawer()}></Icon.Button>
          )
      }}/>
      <ProductStack.Screen name="Scan Barcode" component={ScanBarcodeScreen}/>
      <ProductStack.Screen name="Product Detail" component={ProductDetailScreen}/>
      <ProductStack.Screen name="Submit Product" component={SubmitProduct}/>

    </ProductStack.Navigator>
  );
}

const ReportStackNavigator = ({navigation}) => {
    return (
      <ReportStack.Navigator screenOptions={screenOptionStyle}>
        <ReportStack.Screen name="Report" component={ReportScreen} options={{
          headerLeft:() =>(
              <Icon.Button name="menu" size={25} backgroundColor="transparent" onPress={()=>navigation.openDrawer()}></Icon.Button>
          )
      }}/>
        <ReportStack.Screen name="Submit Report" component={SubmitReport}/>
        <ReportStack.Screen name="Tracking Report" component={TrackingReport}/>
      </ReportStack.Navigator>
    );
  }

  const RewardStackNavigator = ({navigation}) => {
    return (
      <RewardStack.Navigator screenOptions={{headerShown: false}}>
        <RewardStack.Screen name="MR Wallet" component={MRWallet} options={{
          title: 'MR Wallet',
          headerLeft:() =>(
              <Icon.Button name="menu" size={25} backgroundColor="transparent" onPress={()=>navigation.openDrawer()}></Icon.Button>
          )
      }}/>
        <RewardStack.Screen name="Conversion Rates" component={ConversionRates}/>
        <RewardStack.Screen name="Reward List" component={RewardList}/>
      </RewardStack.Navigator>
    );
  }

  const GameStackNavigator = ({navigation}) => {
    return (
      <GameStack.Navigator screenOptions={{headerShown: false}}>
        <GameStack.Screen name="Game1" component={Game} options={{
          headerLeft:() =>(
              <Icon.Button name="menu" size={25} backgroundColor="transparent" onPress={()=>navigation.openDrawer()}></Icon.Button>
          )
      }}/>
      </GameStack.Navigator>
    );
  }

export { GuideStackNavigator, ExploreStackNavigator, ProductStackNavigator, ReportStackNavigator, RewardStackNavigator };