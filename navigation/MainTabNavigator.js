import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createSwitchNavigator } from 'react-navigation';
import { MaterialIcons, FontAwesome, AntDesign } from '@expo/vector-icons';
import Colors from '../constants/Colors';


import MessagesScreen from '../screens/MessageScreen';
import ChatScreen from '../screens/ChatScreen';
import GuestsScreen from '../screens/GuestScreen';
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
      style={{ marginBottom: -10 }}
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
      style={{ marginBottom: -10 }}
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
      style={{ marginBottom: -10}}
      color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
    />
  ),
};


const tabNavigator = createBottomTabNavigator({
  HomeStack,
  LinksStack,
  SettingsStack,
}, {
  tabBarOptions:{
    activeTintColor: 'white',
    style:{
      backgroundColor:'#455a69'
    }
  }
});

const messageStack = createStackNavigator({
  Home: tabNavigator,
  Chat: ChatScreen
},
{
  headerMode: "none",
})


const loginStack = createStackNavigator({
  Login : LoginScreen,
  Reset : ResetPassScreen,
},
  {
    headerMode: 'none',
  }
);

const rootStack = createSwitchNavigator({
  LoginScreen: loginStack,
  MainTabbar: messageStack
})


export default rootStack;
