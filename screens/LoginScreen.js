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
  TextInput
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import FormLabel from '../components/FormLabel';
import Constants from 'expo-constants';
import Constant from '../constants/Constant';

export default class LoginScreen extends React.Component {

  constructor(props) {
    super(props);

    if (__DEV__){
      this.state = {
        email: 'pathum@ruebarue.com',
        password: 'o1@8P7Az3v',
        isValidEmai: true,
        isValidPass: true,
        isLoading: false,
      };
    } else {
      this.state = {
        email: '',
        isValidEmai: true,
        password: '',
        isValidPass: true,
        isLoading: false,
      };
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

  render() {

    const {isValidEmai, isValidPass, email, password} = this.state
    const enableBtLogin = this.checkValidateEmail(email) && email.length > 0 && password.length > 3;

    return (

      <View style={{backgroundColor: '#3a5161', flex: 1}}>
        <KeyboardAwareScrollView enableOnAndroid={true}>
        <View style={{
          justifyContent: 'center',
          // backgroundColor: 'gray'
        }}>
          <StatusBar barStyle="light-content" />
          <View style={{marginBottom: 20, marginTop: 20, marginHorizontal: 20, alignItems: 'center'}}>
            <Image source={require('../assets/images/logo.png')} style={{width: 200, height: 100, resizeMode: 'contain', marginBottom: 20, marginTop: 100}}  />
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
              placeholder="Enter email"
              value={email}
              onChangeText={text => {this._handleEmailTextChange(text)}}
            />
            <FormLabel>Password</FormLabel>
            <TextInput
              secureTextEntry
              style={{
                ...styles.textInput,
                marginBottom: 20
              }}
              placeholder="Enter password"
              value={password}
              onChangeText={text => {this._handlePassTextChange(text)}}
            />
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
            >
              <Text
                style={{                 
                  backgroundColor: '#E66656',
                  color: '#ffffff',
                  height: 48,
                  lineHeight: 48,
                  paddingHorizontal: 48,
                  textTransform: 'uppercase',
                  textAlign: 'center',
                  borderRadius: 3
                }}
              >Log in</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Reset')}
            >
              <Text
              style={{
                color: '#4D6B85'
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
    fontSize: 30,
    textAlign: 'center',
  },
  textInput: {
    paddingTop: 16,
    paddingRight: 12,
    paddingBottom: 16,
    paddingLeft: 16,
    backgroundColor: '#ffffff',
    height: 48,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#cccccc',
  }  
});
