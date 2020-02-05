import React from 'react';
import { Platform, StatusBar, StyleSheet, View, AppState, Text, ActivityIndicator } from 'react-native';
import { Notifications, Updates } from 'expo';
import * as Permissions from 'expo-permissions';
// import { NavigationActions } from 'react-navigation';

import AppNavigator from './navigation/AppNavigator';


export default class App extends React.Component {

  // const [isLoading, setLoadingComplete] = useState(false);

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    };
  }
    
  componentDidMount() {
      this.registerForPushNotificationsAsync()
      Notifications.addListener(this.handleNotification);
      AppState.addEventListener('change', this.handleAppStateChange);
  }

  render() {
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
  }

  handleAppStateChange = ( nextAppState) => {

    console.log(nextAppState)
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
    // this.setState({notification: notification});
    // console.log(JSON.stringify(notification.data))
    const data =  JSON.stringify(notification.data)
      // console.log(notification.data.thread_id)
      console.log(data)
    // this.props.navigation.nextAppState('Noti')
    // dispatch( navigate('Noti') )
    // NavigationActions.navigate({ routeName: 'MainTabbar' })
  };

  registerForPushNotificationsAsync = async () => {

    if(__DEV__){
      global.expoToken = 'test'
      return;
    }

    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);

    // Stop here if the user did not grant permissions
    if (status !== 'granted') {
      global.expoToken = 'test'
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
