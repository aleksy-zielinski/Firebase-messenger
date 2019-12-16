import React from 'react';
import { TouchableOpacity, StyleSheet, View, Text, StatusBar, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';

export default class LoginScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
  }

  _handleTextChange = text => {
    // this.setState({zip: event.nativeEvent.text});
    this.setState({ 'email': text })
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.loginText}>Login</Text>
        <View style={styles.fillBox}>
          <TextInput
            dense = {true}
            mode = 'outlined'
            style={styles.textInput1}
            label='Email'
            value={this.state.email}
            onChangeText={text => this._handleTextChange(text) }
            
          />
          <TextInput
            dense = {true}
            secureTextEntry = {true}
            mode = 'outlined'
            style={styles.textInput2}
            label='Password'
            value={this.state.password}
            onChangeText={text => {
              this.setState({ 'password': text })
            }}
          />
          <View style={styles.buttonContainer}>
            <Button 
              mode="contained" 
              color = '#e66656'
              labelStyle = {{color: 'white', fontSize: 16}}
              style = {styles.buttonLogin}
              onPress={() => this.props.navigation.navigate('MainTabbar')}>
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
        <TouchableOpacity
              style={styles.loginButtonContainer}
              onPress={() => this.props.navigation.navigate('MainTabbar')}
              underlayColor='#fff'>
              <FontAwesome
                style= {styles.googleIcon}
                name= {"google"}
              />
              <Text style={styles.loginButtonText}>Sign up with Google</Text>
            </TouchableOpacity>
      </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
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
    margin: 20
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
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    marginBottom: 10,
    borderColor: 'black'
  },
  textInput2: {
    marginLeft: 20,
    marginRight: 20,
    // marginTop: 10,
    marginBottom: 20,
    borderColor: 'black'
  }
});
