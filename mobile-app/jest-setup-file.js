import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
// jest.useFakeTimers();
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);





// setup-tests.js
// import MockAsyncStorage from "mock-async-storage";

// const mockImpl = new MockAsyncStorage();
// jest.mock('@react-native-community/async-storage', () => mockImpl);