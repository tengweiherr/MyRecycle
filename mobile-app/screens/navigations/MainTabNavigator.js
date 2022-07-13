import React from "react";
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { GuideStackNavigator, ProductStackNavigator, ReportStackNavigator, RewardStackNavigator, ExploreStackNavigator } from "./StackNavigator";
import ExploreScreen from "../explore/ExploreScreen";

const Tab = createMaterialBottomTabNavigator();

const MainTabNavigator = () => {
  return (
        <Tab.Navigator
        initialRouteName="Home"
        activeColor="white"
        barStyle={{ backgroundColor:"#1FAA8F"}}
        >
        <Tab.Screen
          name="Home"
          component={GuideStackNavigator}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="recycle-variant" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="Explore"
          component={ExploreStackNavigator}
          options={{
            tabBarLabel: 'Explore',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="compass" color={color} size={26} />
            ),
          }}
          initialParams={{category:"All"}}
        />
        <Tab.Screen
          name="Product"
          component={ProductStackNavigator}
          options={{
            tabBarLabel: 'Product',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="package-variant-closed" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="Report"
          component={ReportStackNavigator}
          options={{
            tabBarLabel: 'Report',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="file-document-edit-outline" color={color} size={26} />
            ),
          }}
        />
      </Tab.Navigator>

  );
};

export default MainTabNavigator;