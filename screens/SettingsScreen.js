import React from 'react';
import { View, StyleSheet } from 'react-native';


// export default function LogoutScreen() {
  export default class LogoutScreen extends React.Component {
  
  componentDidMount(){
    this.props.navigation.navigate('LoginScreen');
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});