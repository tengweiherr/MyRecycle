import React from 'react';
import renderer from 'react-test-renderer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthScreen from '../screens/AuthScreen';
import { AuthContext, LoadingContext, UserContext } from '../context/context';

import { NativeBaseProvider } from "native-base";
import { enableFetchMocks } from 'jest-fetch-mock'

enableFetchMocks();

beforeEach(async () => {
    await AsyncStorage.clear();
  });

  const inset = {
    frame: { x: 0, y: 0, width: 0, height: 0 },
    insets: { top: 0, left: 0, right: 0, bottom: 0 },
  };


  const authContext = {
    signIn: jest.fn(),
    signOut: jest.fn()
  }

  const tree = renderer.create(
    <AuthContext.Provider value={authContext}>
        <NativeBaseProvider initialWindowMetrics={inset}>
            <AuthScreen />
        </NativeBaseProvider>
    </AuthContext.Provider>).toJSON();

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

  describe('Test', () => {
    renderer.act(()=>jest.runAllTimers());
    test('testing',  () => {
        expect(tree).toMatchSnapshot();
    })

    // test("go back", ()=>{
    //   const goback = tree.root.findByProps({testID:"goback"}).props;
    //   expect(goback.children).toEqual('Go Back');
    // })

});