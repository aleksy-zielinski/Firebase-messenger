import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
// import {  AntDesign } from '@expo/vector-icons';
// import Colors from '../constants/Colors';


// export default function LogoutScreen() {
  export default class LogoutScreen extends React.Component {
  
  componentDidMount(){
    // this.props.navigation.navigate('LoginScreen');

    Alert.alert('Logout', 'Are you sure?', 
        [{ text: 'OK', onPress: () => {  this.props.navigation.navigate('LoginScreen');} },
        { text: 'Cancel'}])
  }

  render(){
    return(
      <View style = {styles.container}>
      </View>
    )
  };
  

}

LogoutScreen.navigationOptions = {
  header: null,
  // tabBarIcon: ({ focused }) => (
  //   <AntDesign
  //     name={'logout'}
  //     size={20}
  //     style={{ marginBottom: -10}}
  //     color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
  //   />
  // ),
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});