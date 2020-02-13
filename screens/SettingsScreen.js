import React from 'react';
import { View, StyleSheet, Alert, Clipboard, ToastAndroid, Text, Platform, AsyncStorage } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import Constants from 'expo-constants';
import Constant from '../constants/Constant'

// export default function LogoutScreen() {
  export default class LogoutScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  showAlert =  async () => {
    Alert.alert('Logout', 'Are you sure?', 
      [
        { text: 'OK', onPress: async () => {  
          console.log("logging out")
          try {
            const url = Constant.severUrl + `auth/logout`
            
            console.log(url)
            let formdata = new FormData();
                formdata.append("device_id", Constants.installationId)

            let response = await fetch(url, {
              method: 'POST',
              body: formdata,
              headers: {
                Cookie: global.cookies,
              },
            });
            
            let responseJson = await response.json();
            if (responseJson && responseJson.status === "OK"){
              global.cookies = ''
              AsyncStorage.removeItem('token')
              this.props.navigation.navigate('LoginScreen');
            } else{
              console.log("logout error")
              Alert.alert('Error logging out', responseJson.error)
            }
            
          } catch (error) {
            console.log("err", error)
            Alert.alert('Error logging out')
          }
        }},
        { text: 'Cancel', onPress: () => { this.props.navigation.navigate('LoginScreen') } }
      ]
    )
  }



  render(){
    return(
      <View style = {styles.container}>
        <NavigationEvents
          onDidFocus={payload => this.showAlert()}
        />
        
        {/*}
        {global.expoToken && 
        <Text style={{fontSize:18}} onPress={() => {
          Clipboard.setString(global.expoToken);
          if (Platform.OS === 'android'){
            ToastAndroid.show('Token copied', ToastAndroid.SHORT);
          }
        }}>
          {global.expoToken}
        </Text>}
        <Text>Tap on token to copy</Text>
        <Text style={styles.itemTextVersion} numberOfLines={2}>
                Version {Constants.manifest.version}.{Platform.OS === 'android' ? Constants.manifest.android.versionCode : Constants.manifest.ios.buildNumber} 
          </Text>
        */}
      </View>
    )
  };
  

}

LogoutScreen.navigationOptions = {
  title: 'Setting',
  headerTintColor: 'white',
  headerStyle: {
    backgroundColor: '#455a69',
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  itemTextVersion: {
    fontSize: 17,
    color: 'gray'
  },
});