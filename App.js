import React from 'react';
import { Platform, StatusBar, StyleSheet, View, AppState, Text, ActivityIndicator, AsyncStorage, Clipboard } from 'react-native';
import { Notifications, Updates, AppLoading } from 'expo';
import * as Permissions from 'expo-permissions';
import * as Device from 'expo-device';
import * as Font from 'expo-font';
import * as Sentry from 'sentry-expo';

import Constant from './constants/Constant';
import AppNavigator from './navigation/AppNavigator';


export default class App extends React.Component {

  // const [isLoading, setLoadingComplete] = useState(false);

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isFinishCheckToken: false,
      appIsReady: false,
    };

  }

  getToken(){

    AsyncStorage.getItem('token', (err, result) => {
      if (err){
        console.log(err);
      } else{
        global.cookies = JSON.parse(result);
        Clipboard.setString(global.cookies);
        console.log(global.cookies);
        let arr = global.cookies.split(';');
        // console.log(arr)
        arr.forEach(item=>{
          if (item.includes('Expires')){
            let a2 = item.split('=');
            console.log(a2[1])
            var a = new Date(a2[1]);
            var toDay = new Date();
            if (toDay - a > 0){
              console.log('cookie Expires')
              this.refreshToken()
            } else{
              console.log('cookie still valid')
              this.setState({isFinishCheckToken: true})
            }
          }
        })
        
      }
    });
  }


  refreshToken = async () => {

    try {

      const url = Constant.severUrl + 'auth/refresh'
      console.log(url)
      let response = await fetch(url, {
        method: 'POST',
        headers: {
          Cookie: global.cookies
        },
      });

      // let responseJson = await response.json();
      console.log(response);

      // if (responseJson.status == 'OK'){
      //   this.saveCookies(response.headers)
      //   this.setState({isFinishCheckToken: true})
      // } else{
      //   Alert.alert('Error', responseJson.message)
      // }
      
    } catch (error) {
      console.error(error);
    }
  }

  saveCookies = (headers) => {
    let cookieStr = '';
    for (const [name, value] of headers) {
        if (name === "set-cookie") {
            cookieStr = value
            break;
        }
    }
    console.log(cookieStr);
    global.cookies = cookieStr;
   
  }


  componentWillMount(){
    this.getToken()
    this._loadAssetsAsync();
  }

  async _loadAssetsAsync() {
    try {
      await Font.loadAsync({
        'Oswald-Light': require('./assets/fonts/Oswald-Light.ttf'),
      });
    } catch (e) {
      console.warn(
        'There was an error caching assets (see: main.js), perhaps due to a ' +
          'network timeout, so we skipped caching. Reload the app to try again.'
      );
      console.log(e.message);
    } finally {
      this.setState({ appIsReady: true });
    }
  }
    
  componentDidMount() {
    this.registerForPushNotificationsAsync()
    Notifications.addListener(this.handleNotification);
    AppState.addEventListener('change', this.handleAppStateChange);
    if (!__DEV__){
      this.checkForUpdateAsync()
    }   

    Sentry.init({
      dsn: 'https://d3ac2ec37e054097bc493a354c93999d@sentry.io/2476461',
      enableInExpoDevelopment: __DEV__ ? true : false,
      debug: __DEV__ ? true : false
    });

  }

  render() {
    if (this.state.appIsReady && this.state.isFinishCheckToken) {
      return (
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <AppNavigator />
          {this.state.isLoading &&
                <View style={styles.loadingStyle}>
                  <ActivityIndicator size='large' />
                  <Text style={{color:'white', margin: 10}}>Updating app to late version</Text>              
                </View>
              }
        </View>
      );
    } else {
      return <AppLoading />;
    }
   
  }

  handleAppStateChange = ( nextAppState) => {
    if (nextAppState === 'active') {
      if (!__DEV__){
        this.checkForUpdateAsync()
        this.getToken()
      }
    }

  }

  checkForUpdateAsync = async ()=>{
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        this.setState({isLoading:true})
        await Updates.fetchUpdateAsync();
        Updates.reloadFromCache();
        this.setState({isLoading: false})
      }
    } catch (e) {
      // handle or log error
      alert(e)
    }

  }

  handleNotification = (notification) => {
    const data = JSON.stringify(notification.data)
    console.log(data)
  };

  registerForPushNotificationsAsync = async () => {

    if(!Device.isDevice){
      global.expoToken = 'Simuator'
      return;
    }

    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);

    // Stop here if the user did not grant permissions
    if (status !== 'granted') {
      global.expoToken = 'Permissions not grandted'
      return;
    }

    // Get the token that identifies this device
    let token = await Notifications.getExpoPushTokenAsync();
    console.log(token)
    global.expoToken = token

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingStyle: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.8,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center'
  },
});
