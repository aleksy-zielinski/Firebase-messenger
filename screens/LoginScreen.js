import React from 'react';
import { 
  TouchableOpacity, 
  StyleSheet, 
  View, 
  Text, 
  StatusBar, 
  TouchableWithoutFeedback, 
  Keyboard, 
  ActivityIndicator, 
  Alert,
  Image
} from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import Constants from 'expo-constants';

export default class LoginScreen extends React.Component {

  constructor(props) {
    super(props);

    if (__DEV__){
      this.state = {
        email: 'pathum@ruebarue.com',
        isValidEmai: true,
        password: 'o1@8P7Az3v',
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
      formdata.append("fcm_id", 'test')

      let response = await fetch('https://mobile-dot-ruebarue-curator.appspot.com/m/auth/login', {
        method: 'POST',
        body: formdata,
      });
      this.setState({isLoading:false})
      let responseJson = await response.json();
      // console.log(responseJson);
      this.saveCookies(response.headers)

      if (responseJson.status == 'OK'){
        global.userToken = responseJson.token;
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

      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <StatusBar barStyle="light-content" />
          <View style={{marginBottom: 20, marginTop: 20, marginHorizontal: 20, alignItems: 'center'}}>
            <Image source={require('../assets/images/logo.png')} style={{width: 200, height: 100, resizeMode: 'contain', marginBottom: 20}}  />
            <Text style={styles.loginText}>Login</Text>
          </View>
          
          <View style={styles.fillBox}>
            <TextInput
              error = {!isValidEmai}
              dense = {true}
              mode = 'outlined'
              style={styles.textInput1}
              label='Email'
              value={email}
              onChangeText={text => this._handleEmailTextChange(text) }
              
            />
            <TextInput
              error = {!isValidPass}
              dense = {true}
              secureTextEntry = {true}
              mode = 'outlined'
              style={styles.textInput2}
              label='Password'
              value={password}
              onChangeText={text => {this._handlePassTextChange(text)}}
            />
            <View style={styles.buttonContainer}>
              <Button 
                mode="contained" 
                color = '#e66656'
                labelStyle = {{color: 'white', fontSize: 16}}
                style = {styles.buttonLogin}
                disabled = {!enableBtLogin}
                onPress={() => this.loginRequest()}>
                LOG IN
              </Button>
              <TouchableOpacity
                  style={styles.resetButtonContainer}
                  onPress={() => this.props.navigation.navigate('Reset')}
                  underlayColor='#fff'>
                  <Text style={styles.resetButtonText}>Reset Password</Text>
              </TouchableOpacity>
            </View>
          </View>
           {this.state.isLoading &&
              <View style={styles.loadingStyle}>
                <ActivityIndicator size='large' />
              </View>
            }
        </View>
      </TouchableWithoutFeedback>
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
    fontSize: 20,
    textAlign: 'center',
    marginTop: 12,
  },
  loginButtonText:{
    color: 'dimgray',
    fontSize: 16,
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
  textInput1: {
    height: 48,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    marginBottom: 10,
    borderColor: 'black'
  },
  textInput2: {
    height: 48,
    marginLeft: 20,
    marginRight: 20,
    // marginTop: 10,
    marginBottom: 20,
    borderColor: 'black'
  }
});
