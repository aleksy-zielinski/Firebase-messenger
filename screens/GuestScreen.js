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
import Constant from '../constants/Constant';

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
      isRefresh: false,
      isFull: false,
      isLoading: false,
      isLoadingMore: false,
      page: 0,
      account: {}
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
      'Cancel'
    ];
    this.sortActionSheet;
    this.timer;
  }

  componentDidMount(){
    
    this.getInboxRequest()

  }

  isRealValue = (obj) =>
  {
    return obj && obj !== 'null' && obj !== 'undefined';
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
      const url = Constant.severUrl + `api/reservations/${this.state.page}?f=${selectOption}&q=${this.state.firstQuery}`
      console.log(url)
      let response = await fetch(url, {
        method: 'GET',
        headers: {
          Cookie: global.cookies,
        },
      });
      let responseJson = await response.json();

      if (responseJson && Object.keys(responseJson).length > 0){

        const pageFull = !this.isRealValue(responseJson.reservations)
        const newData = pageFull ? [] : responseJson.reservations

        this.setState(({ isRefresh, reservations }) => ({
          isLoading: false, 
          isLoadingMore: false,
          reservations: isRefresh ? newData : [...reservations, ...newData], 
          isFull: pageFull,
          isRefresh: false,
        }));
      } else{
        console.log('no data');
        this.setState({
          isLoadingMore: false, 
          isLoading: false,
          isRefresh: false,
          isFull: true 
        })
      }
      
    } catch (error) {
      console.error(error);
      this.setState({
        isLoadingMore: false, 
        isLoading: false,
        isRefresh: false,
        isFull: true 
      })
    }
  }

  _onbtFilterPress = () => {

    this.sortActionSheet.show()
    
  }

  _sortActionSheetDidSelect = (index) =>{

    if (index != this.sortTitle.length - 1){
      this.setState({
        page: 0,
        isRefresh: true,
        seletedIndex: index
      });
    }

    setTimeout( () => {
      this.getInboxRequest();
    },300);

    
    
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


  renderFooter = () => {
    if (this.state.isFull) {
      console.log('hidden indicator')
      return null;
    }
    return (
      <View style={styles.loadingMore}>
        <ActivityIndicator animating size="small" />
      </View>
    );
  };

  actionRefresh = () => {
    this.setState(
      {
        isFull: false,
        isRefresh: true,
        page: 0,
      },
      () => {
        this.getInboxRequest();
      },
    );
  };

  actionLoadMore = () => {
    const { isLoading, isLoadingMore, isFull } = this.state;
    if (isLoading || isLoadingMore || isFull) {
      return;
    }

    console.log('load more');

    this.setState(
      {
        isLoadingMore: true,
        page: this.state.page + 1,
      },
      () => {
        this.getInboxRequest();
      },
    );
  };


  render(){
    const { firstQuery, reservations, isRefresh } = this.state;

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
              size={36}
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
              refreshing={isRefresh}
              onRefresh={this.actionRefresh}
              ListFooterComponent={this.renderFooter}
              renderItem={({ item }) => (
                <GuestCell
                  item={item}
                  onPress={()=> this._onPressCell(item) }
                />
              )}
              onEndReached={this.actionLoadMore}
              onEndReachedThreshold={0.01}
              removeClippedSubviews={Platform.OS !== 'ios'} // improve scroll performance for large lists bug will bug disappear on ios
            />
           {/* {this.state.isLoading &&
              <View style={styles.loadingStyle}>
                <ActivityIndicator size='small' />
              </View>
            } */}
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
  loadingMore: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
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
    height: 48,
    flexDirection: 'row',
  },
  arrow: {
    color: 'gray',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10
  },
  buttonDropDown:{
    flex: 1,
    fontWeight: '300',
    fontSize: 13
  },
  dropDownButtonText:{
    fontSize:14, 
    marginTop:10, 
    marginLeft: 10,
    marginBottom: 10
  },
});
