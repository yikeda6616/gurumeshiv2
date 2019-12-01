import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Home from './screens/Home';

const AppNavigator = createStackNavigator({
  Home: {
    screen: Home
  }
});

const AppContainer = createAppContainer(AppNavigator);

export default AppContainer;
