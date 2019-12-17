import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  FlatList,
  Platform
} from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import {  FontAwesome } from '@expo/vector-icons';
import TaskCell from '../components/TaskCell';
import { NavigationEvents } from 'react-navigation';

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
    this.data = [
      {
        'user_name':'David Fincher',
        'location':'Beach house',
        'start_time':'12/01/2019',
        'end_time':'12/10/2019',
        'creat_time': '12/02/2019 10:30 pm',
        'is_read' : false,
        'content' : 'Specifies font weight. The values normal and bold are supported for most fonts. Not all fonts have a variant for each of the numeric values, in that case the closest one is chosen.'
      },
      {
        'user_name':'Danny Boyle',
        'location':'Beach house',
        'start_time':'12/01/2019',
        'end_time':'12/10/2019',
        'creat_time': '12/02/2019 10:30 pm',
        'is_read' : true,
        'content' : 'It takes input in the form of values for Red, Green and Blue ranging from 0 to 255 and then converts those values to a hexadecimal string that can be used to specify color in html/css code.'
      },

    ]

  }

  _selectOption = (index) =>{

    const selectCate =  options[index]
    console.log(selectCate)
    this.setState({ selectedIndex: index });  

  }

  _onPressCell = (item) => {

    // console.log(item)
    this.props.navigation.navigate('Chat',{
      item: item
    });

  }

  render(){

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        {/* <NavigationEvents onDidFocus={payload => {
          console.log('reload')
          }}
        /> */}

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
       
        <FlatList
              ref={notiRef => this.listView = notiRef}
              data={this.data}
              // key={keyGrid}
              // numColumns={2}
              keyExtractor={item => item.user_name}
              // refreshing={isRefresh}
              // onRefresh={this.actionRefresh}
              // ListFooterComponent={this.renderFooter}
              renderItem={({ item }) => (
                <TaskCell
                  item={item}
                  onPress={()=> this._onPressCell(item) }
                />
              )}
              // onEndReached={this.actionLoadMore}
              // onEndReachedThreshold={0.01}
              removeClippedSubviews={Platform.OS !== 'ios'} // improve scroll performance for large lists bug will bug disappear on ios
            />
      </View>
    );
  }
  
}

MessagesScreen.navigationOptions = {
  title: 'Messages',
  headerTintColor: 'white',
  headerStyle: {
    backgroundColor: '#455a69',
  }
};

function handleLearnMorePress() {
  WebBrowser.openBrowserAsync(
    'https://docs.expo.io/versions/latest/workflow/development-mode/'
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  contentContainer: {
    paddingTop: 30,
  },
  topContainer: {
    backgroundColor: 'white',
    borderColor: 'lightgray',
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
