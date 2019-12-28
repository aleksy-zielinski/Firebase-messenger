import React from 'react';
import { TouchableOpacity, StyleSheet, View, Text, Keyboard, TouchableWithoutFeedback, ActivityIndicator, Alert, Image } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

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

  _resetAction = () => {

    Keyboard.dismiss();
    this.setState({isLoading:true});
    setTimeout( () => {
      this.setState({isLoading:false});
      Alert.alert('Done', 'Please check your mail');
    },1000);

  }

  

  render() {

    const {email, isValidEmai} = this.state
    const enableBtLogin = this.checkValidateEmail(email) && email.length > 0

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>

          <View style={{marginBottom: 20, marginTop: 20, marginHorizontal: 20, alignItems: 'center'}}>
            <Image source={require('../assets/images/logo.png')} style={{width: 200, height: 140, resizeMode: 'contain', marginBottom: 20}}  />
            <Text style={styles.loginText}>Reset Password</Text>
          </View>

          <View style={styles.fillBox}>
            <TextInput
              error = {!isValidEmai}
              dense = {true}
              mode = 'outlined'
              style={styles.textInput1}
              label='Email'
              value={this.state.email}
              onChangeText={text => this._handleTextChange(text) }
              
            />
            <View style={styles.buttonContainer}>
              <Button 
                mode="contained" 
                color = '#e66656'
                labelStyle = {{color: 'white', fontSize: 16}}
                style = {styles.buttonLogin}
                disabled = {!enableBtLogin}
                onPress={() => this._resetAction()}>
                RESET
              </Button>
              <TouchableOpacity
                  style={styles.loginButtonContainer}
                  onPress={() => this.props.navigation.goBack()}
                  underlayColor='#fff'>
                  <Text style={styles.loginButtonText}>Login</Text>
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
    fontSize: 30,
    textAlign: 'center',
  },
  textInput1: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    marginBottom: 20,
    borderColor: 'black'
  },
});
