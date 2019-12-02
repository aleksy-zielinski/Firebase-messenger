import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createSwitchNavigator } from 'react-navigation';
import { MaterialIcons, FontAwesome, AntDesign } from '@expo/vector-icons';
import Colors from '../constants/Colors';


import MessagesScreen from '../screens/HomeScreen';
import GuestsScreen from '../screens/LinksScreen';
import LogoutScreen from '../screens/SettingsScreen';
import LoginScreen from '../screens/LoginScreen';
import ResetPassScreen from '../screens/ResetPassScreen';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const HomeStack = createStackNavigator(
  {
    Home: MessagesScreen,
  },
  config
);

HomeStack.navigationOptions = {
  tabBarLabel: 'Messages',
  tabBarIcon: ({ focused }) => (
    <MaterialIcons
      name={'message'}
      size={25}
      // style={{ marginBottom: -3 }}
      color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
    />
  ),
};


const LinksStack = createStackNavigator(
  {
    Links: GuestsScreen,
  },
  config
);

LinksStack.navigationOptions = {
  tabBarLabel: 'Guests',
  tabBarIcon: ({ focused }) => (
    <FontAwesome
      name={'user'}
      size={25}
      // style={{ marginBottom: -3 }}
      color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
    />
  ),
};


const SettingsStack = createStackNavigator(
  {
    Settings: LogoutScreen,
  },
  config
);

SettingsStack.navigationOptions = {
  tabBarLabel: 'Logout',
  tabBarIcon: ({ focused }) => (
    <AntDesign
      name={'logout'}
      size={20}
      // style={{ marginBottom: -3 }}
      color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
    />
  ),
};


const tabNavigator = createBottomTabNavigator({
  HomeStack,
  LinksStack,
  SettingsStack,
}, {tabBarOptions:{
  style:{backgroundColor:'#455a69'},
  activeTintColor: 'white',
}});


const loginStack = createStackNavigator({
  Login : {
    screen: LoginScreen,
    navigationOptions: {
      header: null,
    }
  },
  Reset : {
    screen: ResetPassScreen,
    navigationOptions: {
      header: null,
    }
  },
},
  {
    initialRouteName: 'Login',
    headerMode: 'screen',
  }
);

const rootStack = createSwitchNavigator({
  LoginScreen: loginStack,
  MainTabbar: tabNavigator
})


export default rootStack;
