import React, { useEffect, useState, useRef, useContext } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  Animated,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  SafeAreaView,
  Linking,
  ActivityIndicator,
  Modal,
  Pressable
} from "react-native";
import MapView, {PROVIDER_GOOGLE, AnimatedRegion, Marker} from "react-native-maps";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';
import { mapStyle } from './mapStyle';
import { API_URL,GOOGLE_API_KEY } from "@env";

import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {decode} from "@mapbox/polyline"; 
import { LoadingContext } from '../../context/context';

//to demostrate
//latitude: 2.052833
//longtitude: 102.580917

//stuff for sliding cards
const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = 200;
const CARD_WIDTH = width * 0.8;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;

const ExploreScreen = () => {

  const Navigation = useNavigation(); 
  const targetCategory = JSON.stringify(useRoute().params.category).replace('"','').replace('"','');

  const [userData, setUserData] = useState(null);
  const { setIsLoading } = useContext(LoadingContext);

  const [category, setCategory] = useState("General Waste");
  const [data, setData] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [photo, setPhoto] = useState([]);
  const [region, setRegion] = useState(null);
  const [currentLocation, setCurrentLocation] = useState("");
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  //for live tracking
  const [showPath, setShowPath] = useState(false);
  const [starting, setStarting] = useState("");
  const [ending, setEnding] = useState("");

  const [coords, setCoords] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [modal2Visible, setModal2Visible] = useState(false);


  const openModal = () => {
    setModalVisible(true);
  }

  const _map = useRef(null);
  const _scrollView = useRef(null);
  const markerT = useRef(null);

    //get user data
    const getUserData = async () => {
      try {
        const value = await AsyncStorage.getItem('user');
        if (value !== null) {
          // We have data!!
          setUserData(JSON.parse(value));
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
  

  const trackCurrentLocation = () => {

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


    })();
}

//load locations
  useEffect(() => {

    const ac = new AbortController();

    setIsLoading(true);

    trackCurrentLocation();

    //load collectors by category 
    var targetURL = API_URL + 'collector/Approved/';
  
    fetch(targetURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(results => {

        setData(results);
        // setMarkers(results);
      })
      .catch(err => {
        console.warn(err);
        // setIsLoading(false);
        // setError(err);
      });

      return () => ac.abort();


    }, []);

//based on category
  useEffect(() => {

    const ac = new AbortController();

    if(data.length !== 0){

      let temp = [];
      let count = 0;
      
      for (let index = 0; index < data.length; index++) {
        
        if(data[index].category === category){
          temp[count] = data[index];
          count++;
        }
        
      }

      if (region) {
        //sorting by distance ascending
        temp.sort(function(a, b) {

          var disA = getDistance(
            {latitude: region.coords.latitude, longitude: region.coords.longitude},
            {latitude: a.lat, longitude: a.long},
          );

          var disB = getDistance(
            {latitude: region.coords.latitude, longitude: region.coords.longitude},
            {latitude: b.lat, longitude: b.long},
          );

          return disA - disB;
        });
      }
  
      setMarkers(temp);
      setFilteredData(temp);
      setIsLoading(false);

    }

    return () => ac.abort();

  
  }, [category,data])

//map animation---------------------------------------------------------------------------------------------------------
//map animation---------------------------------------------------------------------------------------------------------
//map animation---------------------------------------------------------------------------------------------------------
  let mapIndex = 0;
  let mapAnimation = new Animated.Value(0);

  useEffect(() => {

    const ac = new AbortController();

    // someFunc();
    mapAnimation.addListener(({ value }) => {
      let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
      if (index >= filteredData.length) {
        index = filteredData.length - 1;
      }
      if (index <= 0) {
        index = 0;
      }

      clearTimeout(regionTimeout);

      const regionTimeout = setTimeout(() => {
        if( mapIndex !== index ) {
          mapIndex = index;

          _map.current.animateToRegion({
              latitude: filteredData[index].lat,
              longitude: filteredData[index].long,
              latitudeDelta: 0.008,
              longitudeDelta: 0.008,
          }, 350);

        }
      }, 10);

    });

    return () => ac.abort();

  });

  const interpolations = filteredData.map((marker, index) => {
    const inputRange = [
      (index - 1) * CARD_WIDTH,
      index * CARD_WIDTH,
      ((index + 1) * CARD_WIDTH),
    ];

    const scale = mapAnimation.interpolate({
      inputRange,
      outputRange: [1, 1.5, 1],
      extrapolate: "clamp"
    });

    return { scale };
  });

//map animation---------------------------------------------------------------------------------------------------------
//map animation---------------------------------------------------------------------------------------------------------
//map animation---------------------------------------------------------------------------------------------------------

  const onMarkerPress = (mapEventData) => {
    
    const markerID = mapEventData._targetInst.return.key;

    let x = (markerID * CARD_WIDTH) + (markerID * 20); 
    if (Platform.OS === 'ios') {
      x = x - SPACING_FOR_CARD_INSET;
    }

    _scrollView.current.scrollTo({x: x, y: 0, animated: true});

  }


const in_app_navigate = (marker) => {

  // setStarting(currentLocation.coords.latitude.toString() + "," + currentLocation.coords.longitude.toString());
  setEnding(marker.lat.toString() + "," + marker.long.toString());
  setShowPath(true);
  // setRegion(currentLocation);

}

const third_party_navigate = (marker) => {

  const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
  const latLng = `${marker.lat},${marker.long}`;
  const label = 'Custom Label';
  const url = Platform.select({
    ios: `${scheme}${label}@${latLng}`,
    android: `${scheme}${latLng}(${label})`
  });
  
  Linking.openURL(url);   

}

const distanceFromPosition = (marker) => {
  var dis = getDistance(
    {latitude: region.coords.latitude, longitude: region.coords.longitude},
    {latitude: marker.lat, longitude: marker.long},
  );
  return((dis / 1000).toFixed(2));
}


const searchFilterFunction = (text) => {
  // Check if searched text is not blank
  if (text) {
    // Inserted text is not blank
    // Filter the masterDataSource
    // Update FilteredData
    const newData = markers.filter(
      function (item) {
        const itemData = item.name
          ? item.name.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
    });
    setFilteredData(newData);
    setSearch(text);
  } else {
    // Inserted text is blank
    // Update FilteredData with masterDataSource
    setFilteredData(markers);
    setSearch(text);
  }
};

const getDirections = async (startLoc, destinationLoc) => {
  try {
    let resp = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}&key=${GOOGLE_API_KEY}`
    );
    let respJson = await resp.json();
    let points = decode(respJson.routes[0].overview_polyline.points);
    let coords = points.map((point, index) => {
      return {
        latitude: point[0],
        longitude: point[1]
      };
    });
    return coords;
  } catch (error) {
    return error;
  }
};

useEffect(() => {

  const interval = setInterval(() => {

    if(showPath){
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
      // console.log(location);

      //start drawing path
      // setStarting(location.coords.latitude.toString() + "," + location.coords.longitude.toString());
      console.log(location.coords.latitude.toString() + "," + location.coords.longitude.toString());
      // console.log(ending);
      getDirections(location.coords.latitude.toString() + "," + location.coords.longitude.toString(), ending)
      .then(coords => setCoords(coords))
      .catch(err => console.log("Something went wrong"));

      //get current position
      const { latitude, longitude } = location.coords;
      const newCoordinate = {
        latitude,
        longitude
      };
      console.log(newCoordinate);

    })();
  }

  }, 1000);

  return () => clearInterval(interval);
}, [showPath]);


const arrive = (marker) => {
  setShowPath(false);
  openModal();
}

const renderItem = ({item}) => (

    <View style={styles.card}>
      {(item.type !== null && item.type !== "") &&
          <Text style={styles.type}>{item.type}</Text>
      }
      <Text style={{position:"absolute", top:0, right:0, margin:16, textAlign:"right", backgroundColor:"rgba(255,255,255,0.6)"}}>{distanceFromPosition(item)} km away</Text>
      <View style={styles.textContent}>
        <Text numberOfLines={1} style={styles.cardtitle}>{item.name}</Text>

        <Text style={styles.cardDescription}>{item.alamat}</Text>

        {(item.telefon !== (null || "(N/A)" || "N/A" || "")) &&
          <Text style={{marginVertical:4}}>
            <Text style={styles.cardDescription}>{item.telefon}</Text>
            {(item.pic !== (null || "(N/A)" || "N/A" || "")) &&
              <Text style={styles.cardDescription}>  {item.pic}</Text>
            }
          </Text>
        }
        <View style={[styles.button, {flexDirection:"row", justifyContent:"space-between"}]}>
          {showPath ? 
            <>
              {parseFloat(distanceFromPosition(item)) < 0.3 ? 
              <TouchableOpacity
              style={[styles.signIn, {
                backgroundColor:"#FC8B10",
                marginTop:6,
              }]}
              onPress={()=>arrive(item)}
            >
              <Text style={[styles.textSign, {
                color: '#fff'
              }]}>Arrived</Text>
            </TouchableOpacity>                  
              :
              <TouchableOpacity
              style={[styles.signIn, {
                borderColor: '#1FAA8F',
                borderWidth:2,
                backgroundColor:"transparent",
                marginTop:6,
              }]}
              onPress={()=>setShowPath(false)}
            >
              <Text style={[styles.textSign, {
                color: '#1FAA8F'
              }]}>Stop</Text>
            </TouchableOpacity>
            }
          </>
          : 
          <>
          <TouchableOpacity
            style={[styles.signIn, {
              backgroundColor: '#1FAA8F',
              marginTop:6,
              width:"49%"
            }]}
            onPress={()=>in_app_navigate(item)}
          >
            <Text style={[styles.textSign, {
              color: 'white'
            }]}>In App Navigate</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.signIn, {
              backgroundColor: '#FC8B10',
              marginTop:6,
              width:"49%"
            }]}
            onPress={()=>third_party_navigate(item)}
          >
            <Text style={[styles.textSign, {
              color: 'white'
            }]}>Third Party App</Text>
          </TouchableOpacity>
          </>
          }

        </View>
      </View>
    </View>
  
)

  return (
      <>
      {region && (
      <>
      <SafeAreaView style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Thank you for recycling!</Text>
            <Text style={styles.modalText2}>The collector will collect the items you have dropped and process your MR points within 3 days.</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <MapView
        ref={_map}
        initialRegion={{
          latitude: region.coords.latitude,
          longitude: region.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        region={{
          latitude: region.coords.latitude,
          longitude: region.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        style={styles.container}
        provider={PROVIDER_GOOGLE}
        customMapStyle={mapStyle}
        showsUserLocation
        followsUserLocation
        loadingEnabled
      >
        {coords.length > 0 && <MapView.Polyline coordinates={coords} strokeWidth={5} strokeColor="#fff"/>}
        <MapView.Marker
        coordinate={{ latitude: region.coords.latitude, longitude: region.coords.longitude }}>
        <View style={styles.youBox}>
          <Text style={styles.youText}>You</Text>
        </View>
        </MapView.Marker>
        {filteredData.map((marker, index) => {
          const scaleStyle = {
            transform: [
              {
                scale: interpolations[index].scale,
              },
            ],
          };

          return (
            <MapView.Marker key={index} coordinate={{latitude: marker.lat,  longitude: marker.long}} onPress={(e)=>onMarkerPress(e)}>
              <Animated.View style={[styles.markerWrap]}>
                <Animated.Image
                  source={require('../../public/assets/map_marker.png')}
                  style={[styles.marker, scaleStyle]}
                  resizeMode="cover"
                />
              </Animated.View>
            </MapView.Marker>
          );
        })}
      </MapView>
      <View style={styles.header}>
        <View style={styles.searchBox}>
          <TextInput 
            placeholder="Search here"
            placeholderTextColor="#000"
            autoCapitalize="none"
            style={{flex:1,padding:0}}
            onChangeText={(text) => searchFilterFunction(text)}
          />
          <Ionicons name="ios-search" size={20} />
        </View>
        <View style={styles.backToPositionBox}>
          <TouchableOpacity onPress={trackCurrentLocation}>
            <Ionicons name="body" size={20} />
          </TouchableOpacity>
        </View>
      </View>


      <ScrollView
        horizontal
        scrollEventThrottle={1}
        showsHorizontalScrollIndicator={false}
        height={50}
        style={styles.chipsScrollView}
        contentInset={{ // iOS only
          top:0,
          left:0,
          bottom:0,
          right:20
        }}
        contentContainerStyle={{
          paddingRight: Platform.OS === 'android' ? 20 : 0
        }}
      >
      <TouchableOpacity style={(category=="General Waste")? styles.chipsItemActive : styles.chipsItem} onPress={() => setCategory("General Waste")}>
        <MaterialCommunityIcons style={styles.chipsIcon} name="alpha-g-box-outline" size={18} />
        <Text>General Waste</Text>
      </TouchableOpacity>
      <TouchableOpacity style={(category=="E-Waste")? styles.chipsItemActive : styles.chipsItem} onPress={() => setCategory("E-Waste")}>
        <MaterialCommunityIcons name="cellphone" style={styles.chipsIcon} size={18} />
        <Text>E-Waste</Text>
      </TouchableOpacity>
      <TouchableOpacity style={(category=="Food Waste")? styles.chipsItemActive : styles.chipsItem} onPress={() => setCategory("Food Waste")}>
        <MaterialCommunityIcons name="food" style={styles.chipsIcon} size={18} />
        <Text>Food Waste</Text>
      </TouchableOpacity>
      <TouchableOpacity style={(category=="Used Cooking Oil")? styles.chipsItemActive : styles.chipsItem} onPress={() => setCategory("Used Cooking Oil")}>
        <Ionicons name="water" style={styles.chipsIcon} size={18} />
        <Text>Used Cooking Oil</Text>
      </TouchableOpacity>

      </ScrollView>
      
      <Animated.FlatList
        data={filteredData}
        ref={_scrollView}
        initialNumToRender={4}
        maxToRenderPerBatch={8}
        updateCellsBatchingPeriod={4}
        renderItem={renderItem}
        horizontal
        directionalLockEnabled={true}
        showsVerticalScrollIndicator={false}
        pagingEnabled
        scrollEventThrottle={1}
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + 20}
        snapToAlignment="center"
        style={styles.scrollView}
        contentInset={{
          top: 0,
          left: SPACING_FOR_CARD_INSET,
          bottom: 0,
          right: SPACING_FOR_CARD_INSET
        }}
        contentContainerStyle={{
          paddingHorizontal: Platform.OS === 'android' ? SPACING_FOR_CARD_INSET : 0
        }}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  x: mapAnimation,
                }
              },
            },
          ],
          {useNativeDriver: true}
        )}
        keyExtractor={(item) => parseInt(item.id)}
      >

      </Animated.FlatList>
    </SafeAreaView>
      </>
      )}
      </>

  );
};

export default ExploreScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    position:'absolute', 
    marginTop: Platform.OS === 'ios' ? 10 : 8,
    flexDirection:"row",
    width: '90%',
    justifyContent:'space-between',
    alignSelf:'center',
  },
  searchBox: {
    flexDirection:"row",
    backgroundColor: '#fff',
    width: '85%',
    borderRadius: 5,
    padding: 10,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
  backToPositionBox:{
    flexDirection:"row",
    justifyContent:'center',
    alignItems:'center',
    alignSelf:'flex-end',
    backgroundColor: '#FC8B10',
    height:'100%',
    borderRadius: 5,
    padding: 10,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
  chipsScrollView: {
    position:'absolute', 
    top:Platform.OS === 'ios' ? 60 : 65, 
    paddingHorizontal:10
  },
  chipsIcon: {
    marginRight: 5,
  },
  chipsItem: {
    flexDirection:"row",
    backgroundColor:'#fff', 
    borderRadius:20,
    padding:8,
    paddingHorizontal:20, 
    marginHorizontal:10,
    height:35,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
  chipsItemActive: {
    flexDirection:"row",
    backgroundColor:'#1FAA8F', 
    borderRadius:20,
    padding:8,
    paddingHorizontal:20, 
    marginHorizontal:10,
    height:35,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
  scrollView: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  endPadding: {
    paddingRight: width - CARD_WIDTH,
  },
  card: {
    elevation: 2,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: "hidden",
  },
  cardImage: {
    flex: 3,
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
  textContent: {
    flex: 2,
    padding: 16,
  },
  cardtitle: {
    fontSize: 16,
    marginBottom: 6,
    marginTop:30,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 12,
    color: "#444",
    marginVertical:2
  },
  type: {
    backgroundColor:"#e2e2e2",
    padding:3,
    fontSize:10,
    position:"absolute", top:0, left:0, 
    margin:16
  },
  markerWrap: {
    alignItems: "center",
    justifyContent: "center",
    width:50,
    height:50,
  },
  marker: {
    width: 30,
    height: 30,
  },
  button: {
    alignItems: 'center',
    marginTop: 5,
    margin:16,
    position:"absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  signIn: {
      width: '100%',
      padding:5,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 3
  },
  textSign: {
      fontSize: 14,
      fontWeight: 'bold'
  },
  youBox:{
    width:40,
    height:40,
    backgroundColor: "#1FAA8F",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  youText:{
    color: "#fff",
    fontWeight: "600"   
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:"rgba(0,0,0,0.3)"
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius:8,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  buttonClose: {
    backgroundColor: "#1FAA8F",
    padding: 10,
    borderRadius: 4,
    width:"100%"
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize:16,
    fontWeight:"700"
  },
  modalText2: {
    marginBottom: 15,
    textAlign: "center",
    fontSize:14,
  }
});