import React from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  FlatList,
  Platform
} from 'react-native';
import { Searchbar } from 'react-native-paper';
import {  Ionicons } from '@expo/vector-icons';
import GuestCell from '../components/GuestCell';

const options = [
  'All messages',
  'Priority',
  'Unread',
];

export default class GuestsScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      firstQuery: '',
    };
    this.data = [
      {
        'user_name':'David Fincher',
        'location':'Beach house',
        'start_time':'12/01/2019',
        'end_time':'12/10/2019',
        'creat_time': '12/02/2019 10:30 pm',
        'content' : 'david.fincher@gmail.com / 617-216-9862',
        'code': '1244'
      },
      {
        'user_name':'Danny Boyle',
        'location':'Beach house',
        'start_time':'12/01/2019',
        'end_time':'12/10/2019',
        'creat_time': '12/02/2019 10:30 pm',
        'is_read' : true,
        'content' : 'david.fincher@gmail.com / 617-216-9862',
        'code': '1244'
      },

    ]
  }

  _selectOption = (index) =>{

    const selectCate =  options[index]
    console.log(selectCate)
    this.setState({ selectedIndex: index });  

  }

  render(){
    const { firstQuery } = this.state;

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />

        <View style={styles.topContainer}>
        
          <Searchbar
            style={styles.buttonDropDown}
            placeholder="Search"
            onChangeText={query => { this.setState({ firstQuery: query }); }}
            value={firstQuery}
          />
          <Ionicons
            style = {styles.arrow}
            name={'ios-options'}
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
                <GuestCell
                  item={item}
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

GuestsScreen.navigationOptions = {
  title: 'Guests',
  headerTintColor: 'white',
  headerStyle: {
    backgroundColor: '#455a69',
  }
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  contentContainer: {
    paddingTop: 30,
  },
  topContainer: {
    marginLeft: 10, 
    marginRight: 10,
    marginTop: 10, 
    marginBottom: 0,
    height: 40,
    flexDirection: 'row',
  },
  arrow: {
    color: 'gray',
    marginLeft: 10,
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
