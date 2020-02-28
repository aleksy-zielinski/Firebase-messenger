import React from 'react';
import { TouchableOpacity, StyleSheet, View, Text, Keyboard, TouchableWithoutFeedback, ActivityIndicator, Alert, Image } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import Constant from '../constants/Constant';
import FormLabel from '../components/FormLabel';
import * as Sentry from 'sentry-expo';

export default class ResetPassScreen extends React.Component {

  constructor(props) {
    super(props);

    if (__DEV__){
      this.state = {
        email: 'pathum@ruebarue.com',
        isValidEmai: true,
        isLoading: false,
      };
    } else {
      this.state = {
        email: '',
        isValidEmai: true,
        isLoading: false,
      };
    }
  }

  componentDidMount(){
    if (__DEV__){
      // throw new Error("My first Sentry error!");
      // Sentry.nativeCrash();
    }
  }

  _handleTextChange = text => {
    let valid = this.checkValidateEmail(text);
    this.setState({ email: text, isValidEmai: valid })
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

  _resetAction = async () => {

    Keyboard.dismiss();
    this.setState({isLoading:true});

    const {email} = this.state

    try {

      let formdata = new FormData();

      formdata.append("email", email)

      const url = Constant.severUrl + 'auth/password-reset'
      let response = await fetch(url, {
        method: 'POST',
        body: formdata,
      });
      this.setState({isLoading:false})
      let responseJson = await response.json();
      console.log(responseJson);

      if (responseJson.status == 'OK'){
        Alert.alert('Request success', responseJson.message)
        this.setState({email:''})
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

    const {email, isValidEmai} = this.state
    const enableBtLogin = this.checkValidateEmail(email) && email.length > 0

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        
        <View style={styles.container}>
          <Image source={require('../assets/images/background.png')} style={styles.background} />
          <View style={{marginBottom: 20, marginTop: 20, marginHorizontal: 20, alignItems: 'center'}}>
            <Image source={require('../assets/images/small_logo.png')} style={{width: 200, height: 140, resizeMode: 'contain', marginBottom: 20}}  />
            <Text style={styles.loginText}>Reset Password</Text>
          </View>

          <View style={styles.fillBox}>
            <FormLabel>Email</FormLabel>
            <TextInput
              autoCapitalize = 'none'
              error = {!isValidEmai}
              dense = {true}
              style={styles.textInput1}
              value={this.state.email}
              onChangeText={text => this._handleTextChange(text) }
            />
            <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',    
              marginTop: 20,          
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
                  borderRadius: 3
                }}
              >
                <Text
                  style={{                 
                    color: '#ffffff',
                    textTransform: 'uppercase',
                  }}
                >Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <Text style={{color: '#E66656'}}>Login</Text>
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
    borderRadius: 0,
    borderColor: 'white',
    height: 48,
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
    margin: 8,
    paddingTop: 24,
    paddingRight: 20,
    paddingBottom: 24,
    paddingLeft: 20,
    backgroundColor: '#ffffff',
    opacity: 0.9,
    borderRadius: 2,
    marginBottom: 250
  },
  loginButtonContainer:{
    flex: 2,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  loginButtonText:{
    color: 'dimgray',
  },
  loginText:{
    color: 'white',
    fontSize: 24,
    textAlign: 'center',
    fontFamily: 'Oswald-Light',
  },
  textInput1: {
    paddingTop: 0,
    paddingRight: 12,
    paddingBottom: 0,
    paddingLeft: 8,
    backgroundColor: '#ffffff',
    height: 48,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#cccccc',
    fontSize: 16,
  },
});
