import React from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  FlatList,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  Text,
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
      seletedIndex: 7,
      reservations: [],
      isLoading: false,
    };
    this.sortTitle = [
      'Checked Out', 
      'Currently Staying',
      'Arriving Today',
      'Arriving Soon (+3 Days)',
      'Arriving This Week (+7 Days)',
      'Arriving Next Week (+14 Days)',
      'This month',
      'Show All',
      'Huỷ'
    ];
    this.sortActionSheet;
    this.timer;
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

      let url = `https://mobile-dot-ruebarue-curator.appspot.com/m/api/reservations/0?f=${selectOption}&q=${this.state.firstQuery}`;
      console.log(url);
      let response = await fetch(url, {
        method: 'GET',
        headers: {
          Cookie: global.cookies,
        },
      });
      let responseJson = await response.json();
      if (responseJson.reservations !== null){
        console.log(responseJson.reservations.length);
        this.setState({isLoading:false, reservations: responseJson.reservations})
      } else{
        console.log('no data');
        this.setState({isLoading:false, reservations: []})
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

    this.props.navigation.navigate('Scheduler',{item: item});

  }

  searchBarTextChange = (text) => {

    this.setState({ firstQuery: text});

    clearTimeout(this.timer);
    this.timer = setTimeout( () => {
      this.getInboxRequest()
    },1000);

  }

  render(){
    const { firstQuery, reservations } = this.state;

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />

        <View style={styles.topContainer}>
        
          <Searchbar
            style={styles.buttonDropDown}
            placeholder="Search"
            onChangeText={query => { this.searchBarTextChange(query)}}
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
              data={reservations}
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
            {!this.state.isLoading && reservations.length == 0 &&
              <View style={styles.loadingStyle} pointerEvents="none" disabled= {true}>
                  <Text> No data </Text>
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
    marginBottom: 10,
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
