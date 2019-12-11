import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import {  FontAwesome } from '@expo/vector-icons';

const options = [
  'All messages',
  'Priority',
  'Unread',
];

export default class MessagesScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
    };
  }

  _selectOption = (index) =>{

    const selectCate =  options[index]
    console.log(selectCate)
    this.setState({ selectedIndex: index });  

  }

  render(){
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />

        <View style={styles.topContainer}>
        
          <ModalDropdown 
            onSelect={(index)=> this._selectOption(index)}
            defaultIndex = {0}
            defaultValue={'All messages'} 
            options={options}
            style={styles.buttonDropDown}
            textStyle={styles.dropDownButtonText}
            dropdownStyle={{left: 0, right: 10, height: 120}}
            dropdownTextStyle={{fontSize:16, textAlign:'center'}}
          />
          <FontAwesome
            style = {styles.arrow}
            name={'angle-down'}
            size={30}
          />

        </View>
       
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}>
         
  
        </ScrollView>
      </View>
    );
  }
  
}

MessagesScreen.navigationOptions = {
  title: 'Message',
  headerTintColor: 'white',
  headerStyle: {
    backgroundColor: '#455a69',
  },
};

function handleLearnMorePress() {
  WebBrowser.openBrowserAsync(
    'https://docs.expo.io/versions/latest/workflow/development-mode/'
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgray',
  },
  contentContainer: {
    paddingTop: 30,
  },
  topContainer: {
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginLeft: 10, 
    marginRight: 10,
    marginTop: 10, 
    marginBottom: 0,
    height: 40,
    flexDirection: 'row',
  },
  arrow: {
    color: 'gray',
    marginRight: 10,
    marginTop: 5
  },
  buttonDropDown:{
    flex: 1,
    
  },
  dropDownButtonText:{
    fontSize:16, 
    marginTop:10, 
    marginLeft: 10,
    marginBottom: 10
  },
});
