import React from 'react';
import { 
  TouchableOpacity, 
  StyleSheet, 
  View, 
  Text, 
  StatusBar, 
  Keyboard, 
  ActivityIndicator, 
  Alert,
  Image,
  TextInput,
  AsyncStorage,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import FormLabel from '../components/FormLabel';
import Constants from 'expo-constants';
import Constant from '../constants/Constant';
import {  MaterialCommunityIcons } from '@expo/vector-icons';

export default class LoginScreen extends React.Component {

  constructor(props) {
    super(props);

    if (__DEV__){
      this.state = {
        // email: 'nars@ruebarue.com',
        // password: 'P@ssw0rd1!',
        email: 'pathum@ruebarue.com',
        password: 'o1@8P7Az3v',
        isValidEmai: true,
        isValidPass: true,
        isLoading: false,
        isShowPass: false,
      };
    } else {
      this.state = {
        email: '',
        isValidEmai: true,
        password: '',
        isValidPass: true,
        isLoading: false,
        isShowPass: false,
      };
    }

    if ( global.cookies !== null && global.cookies.length !== 0){
      console.log('not null', global.cookies)
      this.props.navigation.navigate('MainTabbar')
    }
   
  }

  _handleEmailTextChange = text => {
    let valid = this.checkValidateEmail(text);
    this.setState({ email: text, isValidEmai: valid })
  }

  _handlePassTextChange = text => {

    let valid = text.length > 3  || text === '';
    this.setState({ password: text, isValidPass: valid })
  }

  checkValidateEmail = (text) => {
    if (text === ''){
      return true;
    }
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
    if(reg.test(text) === false){
      return false;
    } else {
      return true;
    }
  }


  saveCookies = (headers) => {
    let cookieStr = '';
    for (const [name, value] of headers) {
        if (name === "set-cookie") {
            cookieStr = value //+ '; path=/; domain=.mobile-dot-ruebarue-curator.appspot.com;'
            break;
        }
    }
    console.log(cookieStr);
    global.cookies = cookieStr;
    this.saveToken(cookieStr)
    // this.saveToken('token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo1NjczMzA4OTczOTU3MTIwLCJleHAiOjE1ODEwMTU3OTR9.CpYa3vA5-_S09858s7Ow2U4WdRMM6BiO_AHI7Wq27cg; path=/; domain=.mobile-dot-ruebarue-curator.appspot.com; Expires=Thu, 06 Feb 2020 19:03:14 GMT;')
  }

  saveToken(token){
    AsyncStorage.setItem('token', JSON.stringify(token), () => {
      console.log('token saved');
    });
  }
 
  loginRequest = async () => {

    Keyboard.dismiss();
    this.setState({isLoading:true})
    const {email, password} = this.state

    try {

      let formdata = new FormData();

      formdata.append("email", email)
      formdata.append("password", password)
      formdata.append("device_id", Constants.installationId)
      formdata.append("expo_id", global.expoToken ? global.expoToken : '')

      const url = Constant.severUrl + 'auth/login'
      console.log(url)
      let response = await fetch(url, {
        method: 'POST',
        body: formdata,
      });
      this.setState({isLoading:false})
      let responseJson = await response.json();
      // console.log(responseJson);

      if (responseJson.status == 'OK'){
        this.saveCookies(response.headers)
        // global.userToken = responseJson.token;
        this.props.navigation.navigate('MainTabbar')
      } else{
        Alert.alert('Error', responseJson.message)
      }
      
    } catch (error) {
      this.setState({isLoading:false})
      Alert.alert('Error',error.message)
      console.error(error);
    }
  }

  showHiddenPass = () => {
    this.setState({isShowPass: !this.state.isShowPass})
  }

  render() {

    const {email, password} = this.state
    // const enableBtLogin = this.checkValidateEmail(email) && email.length > 0 && password.length > 3;

    return (

      <View style={{backgroundColor: '#3a5161', flex: 1}}>
        <Image source={require('../assets/images/background.png')} style={styles.background} />
        <KeyboardAwareScrollView enableOnAndroid={true}>
        <View style={{
          justifyContent: 'center',
        }}>
          <StatusBar barStyle="light-content" />
          <View style={{marginBottom: 20, marginTop: 20, marginHorizontal: 20, alignItems: 'center'}}>
            <Image source={require('../assets/images/small_logo.png')} style={{width: 200, height: 100, resizeMode: 'contain', marginBottom: 20, marginTop: 100}}  />
            <Text style={styles.loginText}>Login</Text>
          </View>
          <View
            style={{
              margin: 8,
              paddingTop: 24,
              paddingRight: 20,
              paddingBottom: 24,
              paddingLeft: 20,
              backgroundColor: '#ffffff',
              opacity: 0.9,
              borderRadius: 2,
            }}
          >
            <FormLabel>Email</FormLabel>
            <TextInput

              style={{
                ...styles.textInput,
                marginBottom: 12,
              }}
              value={email}
              autoCapitalize = 'none'
              onChangeText={text => {this._handleEmailTextChange(text)}}
            />
            <FormLabel>Password</FormLabel>
            <View>
              <TextInput
                secureTextEntry = {!this.state.isShowPass}
                style={{
                  ...styles.textInput,
                  marginBottom: 20
                }}
                value={password}
                onChangeText={text => {this._handlePassTextChange(text)}}
              />
              <TouchableOpacity
                onPress={() => this.showHiddenPass()}
                style={styles.showPassBt}>
                   <MaterialCommunityIcons
                    style = {styles.eyeIcon}
                    color =  {'darkgray'}
                    name={this.state.isShowPass ? 'eye' : 'eye-off'}
                    size={25}
                  />
                </TouchableOpacity>
            </View>
            
            <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',              
            }}
            >
            <TouchableOpacity
              onPress={() => this.loginRequest()}
              style={{    
                paddingHorizontal: 48,
                height: 48,
                backgroundColor: '#E66656',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 3,
              }}
            >
              <Text
                style={{                 
                  color: '#ffffff',
                  textTransform: 'uppercase',
                }}
              >Log in</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Reset')}
            >
              <Text
              style={{
                color: '#E66656'
              }}
            >Reset password</Text>
            </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
      {this.state.isLoading &&
              <View style={styles.loadingStyle}>
                <ActivityIndicator size='large' />
              </View>
            }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  showPassBt:{
    position: 'absolute',
    right: 0,
    top: 0,
    width: 40,
    height: 48,
    // backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center'
  },
  eyeIcon:{
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
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    resizeMode: 'cover',
    width: null,
    height: null,
  },
  buttonLogin:{
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 15,
    backgroundColor: '#3a5161',
  },
  fillBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 7,
    marginHorizontal: 20,
    marginBottom: 240
  },
  loginButtonContainer:{
    backgroundColor: 'white',
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 10,
  },
  googleIcon:{
    color: '#e66656',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 12,
  },
  loginButtonText:{
    color: 'dimgray',
    fontSize: 14,
    textAlign: 'center',
    margin: 12,
  },
  resetButtonContainer:{
    flex: 2,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  resetButtonText:{
    color: '#637581',
  },
  loginText:{
    color: 'white',
    fontSize: 24,
    textAlign: 'center',
    fontFamily: 'Oswald-Light'
  },
  textInput: {
    paddingTop: 0,
    paddingRight: 12,
    paddingBottom: 0,
    paddingLeft: 16,
    backgroundColor: '#ffffff',
    height: 48,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#cccccc',
    fontSize: 16,
  }  
});
