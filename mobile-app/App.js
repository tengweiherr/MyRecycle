import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useReducer, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import MainTabNavigator from "./screens/navigations/MainTabNavigator";
import { createDrawerNavigator } from '@react-navigation/drawer';
import { AuthScreen } from './screens';
import { AuthContext, LoadingContext, UserContext } from './context/context';
import AsyncStorage from '@react-native-async-storage/async-storage'
import DrawerContent from './screens/navigations/DrawerContent';
import Notification from './screens/NotificationScreen';
import Profile from './screens/ProfileScreen';
import Settings from './screens/SettingsScreen';
import { LogBox } from 'react-native';
import LoadingScreen from './components/LoadingScreen';
import { API_URL } from "@env";

const Drawer = createDrawerNavigator();

export default function App() {

  //disable nativebase contrast warning
  LogBox.ignoreLogs(["NativeBase:"])
  LogBox.ignoreLogs(["Found screens"])
  LogBox.ignoreLogs(["Encountered two children with the same key"])
  LogBox.ignoreAllLogs();//Ignore all log notifications
  
  const initialLoginState = {
    isLoading: true,
    userToken: null,
  };

  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState({
    id:null,
    name:null,
    email:null
  });

  //reducer function
  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case "RETRIEVE_TOKEN":

        if(action.userData){

        fetch(API_URL + 'user/' + action.userData.id, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(response => response.json())
          .then(results => {
            setUser(results);
            setIsLoading(false);
          })
          .catch(err => {
            console.log(err);
          });

        } else {
          setIsLoading(false);
        }
        
        return {
          ...prevState,
          userToken: action.userData ? action.userData.token : null,
          isLoading: false,
        };
      case "LOGIN":
        setIsLoading(false);
        return {
          ...prevState,
          userToken: action.userData ? action.userData.token : null,
          isLoading: false,
        };
      case "LOGOUT":
        setIsLoading(false);
        return {
          ...prevState,
          userToken: null,
          isLoading: false,
        };

      default:
        break;
    }
  }

  const [loginState, dispatch] = useReducer(loginReducer, initialLoginState);

  //setup context
  const authContext = React.useMemo(() => ({
    signIn: async (userData) => {
      try {
        await AsyncStorage.setItem('user', JSON.stringify(userData));
      } catch (e) {
        console.log(e);
      }
      setUser(userData);
      dispatch({ type: "LOGIN", userData: userData });
    },
    signOut: async () => {
      try {
        await AsyncStorage.removeItem('user');
      } catch (e) {
        console.log(e);
      }
      dispatch({ type: "LOGOUT" });
    },

  }), []);

  useEffect(() => {
    setTimeout(async () => {
      let userData = null;
      try {
        userData = await AsyncStorage.getItem('user');
      } catch (e) {
        console.log(e);
      }
      userData = JSON.parse(userData);
      userData ? setUser(userData) : setUser(null);
      dispatch({ type: "RETRIEVE_TOKEN", userData: userData });
    }, 1000);
  }, [])

  return (
    <AuthContext.Provider value={authContext}>
      <UserContext.Provider value={{user,setUser}}>
        <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
          <NavigationContainer>
            {loginState.userToken !== null ? (
              <Drawer.Navigator initialRouteName="HomeDrawer" drawerContent={props => <DrawerContent {...props} />}>
                <Drawer.Screen name="Home" component={MainTabNavigator} options={{ headerShown: false }} />
                <Drawer.Screen name="Notification" component={Notification} />
                <Drawer.Screen name="Profile" component={Profile} />
                <Drawer.Screen name="Settings" component={Settings} />
              </Drawer.Navigator>
            ) :
              <View style={styles.container}>
                <AuthScreen />
                <StatusBar style="auto" />
              </View>
            }

            {isLoading &&
              <View style={{ width: "100%", height: "100%", position: "absolute", backgroundColor: "rgba(0,0,0,0.6)" }}>
                <LoadingScreen />
              </View>
            }

          </NavigationContainer>
        </LoadingContext.Provider>
      </UserContext.Provider>
    </AuthContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: "center",
    width: "100%"
  },
});

