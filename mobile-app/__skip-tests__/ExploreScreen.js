import React from "react";
import renderer from "react-test-renderer";
import ExploreScreen from "../screens/explore/ExploreScreen";
import { enableFetchMocks } from 'jest-fetch-mock'
enableFetchMocks();

const tree = renderer.create(<ExploreScreen/>).toJSON();

jest.mock('@react-navigation/native', () => ({
    useNavigation: jest.fn(),
    useRoute: () => ({
        params: {
          category: 'General Waste',
        }
      }),
  }));

test("snapshot",()=>{
    expect(tree).toMatchSnapshot();
})