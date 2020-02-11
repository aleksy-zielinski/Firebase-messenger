import React from 'react';
import { Platform, StatusBar, StyleSheet, View, AppState, Text, ActivityIndicator } from 'react-native';
import { Notifications, Updates, AppLoading } from 'expo';
import * as Permissions from 'expo-permissions';
import * as Device from 'expo-device';
import * as Font from 'expo-font';

import AppNavigator from './navigation/AppNavigator';


export default class App extends React.Component {

  // const [isLoading, setLoadingComplete] = useState(false);

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      appIsReady: false,
    };

  }

  componentWillMount(){
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
  }

  render() {
    if (this.state.appIsReady) {
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

    // if(Device.isDevice){
    //   global.expoToken = 'test'
    //   return;
    // }

    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);

    // Stop here if the user did not grant permissions
    if (status !== 'granted') {
      global.expoToken = 'Simulator'
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
