import React from 'react';
import renderer from 'react-test-renderer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TrackingReport from '../screens/report/TrackingReport';
import { NativeBaseProvider } from "native-base";
import { LoadingContext } from '../context/context';
import { enableFetchMocks } from 'jest-fetch-mock'
import {Platform} from 'react-native';

enableFetchMocks();

beforeEach(async () => {
    await AsyncStorage.clear();
  });
  
  const inset = {
    frame: { x: 0, y: 0, width: 0, height: 0 },
    insets: { top: 0, left: 0, right: 0, bottom: 0 },
  };

  const setIsLoading = jest.fn()

  const tree = renderer.create(
    <LoadingContext value={{setIsLoading}}>
        <NativeBaseProvider initialWindowMetrics={inset}>
            <TrackingReport />
        </NativeBaseProvider>
    </LoadingContext>
        ).toJSON();

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
  useIsFocused: jest.fn(),
  useRoute: () => ({
    params: {
      item: {
        id: 1,
        title: "abc",
        description: "abc",
        date: "2022-06-12T123123",
        category: "Environment",
        location: "Jalan Abc",
        status: "Approved",
        verified_comment: "",
        verified_time: "2022-06-12T123123",
        media: "123.jpg,234.jpg",
        reporter_email: ""
      },
    }
  })
}));

  describe('Test', () => {

    test('testing',  () => {
        expect(tree).toMatchSnapshot();
    })

    test("go back", ()=>{
      const goback = tree.root.findByProps({testID:"goback"}).props;
      expect(goback.children).toEqual('Go Back');
    })

});