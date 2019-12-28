import React from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  FlatList,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
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
      firstQuery: '',
      seletedIndex: 1,
      recipients: [],
      isLoading: false,
    };
    this.sortTitle = [
      'Checked Out', 
      'Currently Staying',
      'Arriving Today',
      'Arriving Soon (+3 Days)',
      'Arriving This Week (+7 Days)',
      'Arriving Next Week (+14 Days)',
      'Show All',
      'Huỷ'
    ];
    this.sortActionSheet;
    this.chatData = [];
  }

  componentDidMount(){
    
    this.getInboxRequest()

  }

  getInboxRequest = async () => {

    const realOption = [
      "checked-out",
      "current",
      "today",
      "soon",
      "this-week",
      "next-week",
      "month",
      "",
    ]
    const selectOption = realOption[this.state.seletedIndex];

    this.setState({isLoading:true})
    
    try {

      let response = await fetch('https://mobile-dot-ruebarue-curator.appspot.com/m/api/messaging/inbox/current', {
        method: 'POST',
        headers: {
          Cookie: global.cookies,
        },
        body: JSON.stringify({
          filter: selectOption
        }),
      });
      let responseJson = await response.json();

      if (responseJson){
        console.log(responseJson.recipients.length);
        this.setState({isLoading:false, recipients: responseJson.recipients})
        this.chatData = responseJson.page;
      } else{
        console.log('no data');
        this.setState({isLoading:false})
      }
      
    } catch (error) {
      console.error(error);
      this.setState({isLoading:false})
    }
  }

  _selectOption = (index) =>{

    const selectCate =  options[index]
    console.log(selectCate)
    this.setState({ selectedIndex: index });  

  }

  _onbtFilterPress = () => {

    this.sortActionSheet.show()
    
  }

  _sortActionSheetDidSelect = (index) =>{

    if (index != this.sortTitle.length - 1){
      this.setState({seletedIndex: index});
    }
    this.getInboxRequest();
    
  }

  _onPressCell = (item) => {

    this.props.navigation.navigate('Scheduler',{item: item, chatData: this.chatData});

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
          <TouchableOpacity onPress={this._onbtFilterPress}>
            <Ionicons
              style = {styles.arrow}
              name={'ios-options'}
              size={30}
            />
          </TouchableOpacity>
         
        </View>

        <ActionSheet 
            ref={sort => this.sortActionSheet = sort}
            options={this.sortTitle}
            destructiveButtonIndex={this.state.seletedIndex}
            cancelButtonIndex={this.sortTitle.length - 1}
            onPress={(index) => { 
              // console.log(index)
              this._sortActionSheetDidSelect(index)

            }}
          />
       
        <FlatList
              ref={notiRef => this.listView = notiRef}
              data={this.state.recipients}
              // key={keyGrid}
              // numColumns={2}
              keyExtractor={item =>`${item.id}`}
              // refreshing={isRefresh}
              // onRefresh={this.actionRefresh}
              // ListFooterComponent={this.renderFooter}
              renderItem={({ item }) => (
                <GuestCell
                  item={item}
                  onPress={()=> this._onPressCell(item) }
                />
              )}
              // onEndReached={this.actionLoadMore}
              // onEndReachedThreshold={0.01}
              removeClippedSubviews={Platform.OS !== 'ios'} // improve scroll performance for large lists bug will bug disappear on ios
            />
           {this.state.isLoading &&
              <View style={styles.loadingStyle}>
                <ActivityIndicator size='small' />
              </View>
            }
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
  loadingStyle: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
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
