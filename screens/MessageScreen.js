import React from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  FlatList,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Notifications } from 'expo';
import ModalDropdown from 'react-native-modal-dropdown';
import { FontAwesome } from '@expo/vector-icons';
import TaskCell from '../components/TaskCell';
import Constant from '../constants/Constant';

const options = [
  'All Messages',
  'Priority',
  'Unread',
  'Archived'
];

export default class MessagesScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      recipients: [],
      pageData: [],
      filter: '',
      isRefresh: false,
      isFull: false,
      isLoading: false,
      isLoadingMore: false,
      page: 0,
    };
    this.notificationSubscription;
  }

  componentDidMount() {

    this.getThread()
    this.notificationSubscription = Notifications.addListener(this._handleNotification);

  }

  componentWillUnmount(){
    this.notificationSubscription.remove()
  }

  _handleNotification = (notification) => {
    
    console.log(JSON.stringify(notification.data))

    this.state.page.forEach( item =>{

      console.log('item', item.id, notification.data.thread_id)
      if (item.id == notification.data.thread_id){
        this.props.navigation.navigate('Chat', {
          recipients: this.state.recipients,
          page: item,
          onSelect:this.callBack
        });
      }
      
    })

  };

   isRealValue = (obj) =>
  {
    return obj && obj !== 'null' && obj !== 'undefined';
  }

  getThread = async () => {

    this.setState({ isLoading: true })

    try {
      const url = Constant.severUrl + `api/messaging/inbox/0/meta?page=${this.state.page}&filter=${this.state.filter}`
      console.log(url)
      let response = await fetch(url, {
        method: 'GET',
        headers: {
          Cookie: global.cookies,
        },
      });
      let responseJson = await response.json();
      // console.log(response)

      if (responseJson && Object.keys(responseJson).length > 0) {
        // console.log(responseJson);
        const pageFull = !this.isRealValue(responseJson.page)
        const newData = pageFull ? [] : responseJson.page
        this.setState(({ isRefresh, pageData }) => ({
          isLoading: false, 
          isLoadingMore: false,
          pageData: isRefresh ? newData : [...pageData, ...newData], 
          recipients: responseJson.recipients,
          isFull: pageFull,
          isRefresh: false,
        }));
      } else {
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

  _selectOption = (index) => {

    // const selectCate =  options[index]
    let filter = ['', 'priority', 'unread', 'archived'][index];
    console.log(filter)
    this.setState({
      selectedIndex: index,
      filter: filter,
      page: 0,
      isRefresh: true
    },
      () => {
        this.getThread();
      }
    );


  }

  _onPressCell = (item) => {

    this.props.navigation.navigate('Chat', {
      page: item,
      recipients: this.state.recipients,
      onSelect:this.callBack
    });

  }

  callBack = () => {
    //reload data
    this.actionRefresh()
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
        this.getThread();
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
        this.getThread();
      },
    );
  };

  render() {

    const { pageData, isRefresh } = this.state;

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />

        <View style={styles.topContainer}>

          <ModalDropdown
            onSelect={(index) => this._selectOption(index)}
            defaultIndex={0}
            defaultValue={'All messages'}
            options={options}
            style={styles.buttonDropDown}
            textStyle={styles.dropDownButtonText}
            dropdownStyle={{ left: 0, right: 10, height: 170 }}
            dropdownTextStyle={{ fontSize: 14, textAlign: 'center' }}
          />
          <FontAwesome
            disabled={true}
            pointerEvents='none'
            style={styles.arrow}
            name={'angle-down'}
            size={30}
          />

        </View>

        <FlatList
          ref={notiRef => this.listView = notiRef}
          data={pageData}
          // key={keyGrid}
          // numColumns={2}
          keyExtractor={item => `${item.id}`}
          refreshing={isRefresh}
          onRefresh={this.actionRefresh}
          ListFooterComponent={this.renderFooter}
          renderItem={({ item }) => (
            <TaskCell
              item={item}
              onPress={() => this._onPressCell(item)}
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
    backgroundColor: 'white',
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 3,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    marginBottom: 10,
    height: 46,
    flexDirection: 'row',
  },
  arrow: {
    position: 'absolute',
    color: 'gray',
    right: 10,
    top: 5,
  },
  buttonDropDown: {
    flex: 1,
    height: 46
  },
  dropDownButtonText: {
    fontSize: 14,
    marginTop: 10,
    marginLeft: 10,
    marginBottom: 10
  },
});
