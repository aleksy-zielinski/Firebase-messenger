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
      pendingMeta: []
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

  isRealValue = (obj) => {
    return obj && obj !== 'null' && obj !== 'undefined';
  }

  getThread = async () => {

    this.setState({ isLoading: true })

    try {
      const url = Constant.severUrl + `api/messaging/inbox/0/meta?page=${this.state.page}&filter=${this.state.filter}`
      
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
        
        this.setState(({ isRefresh, pageData }) => {
          var data = isRefresh ? newData : pageData

          if (!isRefresh) {
            let filteredData = newData.filter((m) => {
               return !pageData.some(o => o.id === m.id);
            });

            data = [...data, ...filteredData]
          }

          return {  
            isLoading: false, 
            isLoadingMore: false,
            pageData: data, 
            recipients: responseJson.recipients,
            isFull: pageFull,
            isRefresh: false
          }
        });
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

  _onMetaToggle = async (item, meta) => {
    let pageData = this.state.pageData,
        pageItem = pageData.filter(i => i.id === item.id)[0],
        pendingMeta = this.state.pendingMeta
    
    if (!pageItem) return
    if (pendingMeta.indexOf(item.id) !== -1) return

    const isAdd = pageItem.meta_values.split(",").indexOf(meta) === -1

    this.toggleItemMeta(pageItem, meta)
    this.setState({pendingMeta: [item.id, ...pendingMeta]});
    
    try {
      let formdata = new FormData();
          formdata.append('token', meta)

      const url = Constant.severUrl + `api/messaging/thread/${pageItem.id}/meta`
      
      let response = await fetch(url, {
        method:  isAdd ? 'POST' : 'DELETE',
        headers: {
          Cookie: global.cookies,
        },
        body: formdata,
      });
      
      let responseJson = await response.json();
      this.setState({isLoading:false})

      if (responseJson.status == 'ok'){
        this.state.pendingMeta.splice(pendingMeta.indexOf(meta), 1)
        this.setState({pendingMeta: [...pendingMeta]})

        if (meta === "archived") {
          let idx = pageData.indexOf(pageItem);
          if (idx !== -1) {
            pageData.splice(idx, 1)

            if (pageData.length === 0) pageData = [];
            this.setState({pageData: pageData})
          }
        }

      } else{
        this.toggleItemMeta(pageItem, meta)
        console.error(responseJson);
        Alert.alert('Error', responseJson.message)
      }
    } catch (error) {
      this.toggleItemMeta(pageItem, meta)
      console.error(error);
      Alert.alert('Error',error.message) 
    }
  }

  toggleItemMeta = (item, meta) => {
    let current = item.meta_values.split(",").filter(v => v !== ""),
        idx = current.indexOf(meta),
        isAdd = idx === -1;

    if (isAdd) {
      current.push(meta)
    } else {
      current.splice(idx, 1)
    }

    item.meta_values = current.join(",")
    this.setState({pageData: this.state.pageData})
  }

  callBack = () => {
    //reload data
    this.actionRefresh()
  }

  renderFooter = () => {
    if (this.state.isFull) {
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

    const { pageData, pendingMeta, isRefresh } = this.state;

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
          pendingMeta={pendingMeta}
          // key={keyGrid}
          // numColumns={2}
          keyExtractor={item => `${item.id}`}
          refreshing={isRefresh}
          onRefresh={this.actionRefresh}
          ListFooterComponent={this.renderFooter}
          renderItem={({ item }) => (
            <TaskCell
              item={item}
              pending={pendingMeta.indexOf(item.id) !== -1}
              onPress={ () => this._onPressCell(item) }
              onMetaToggle={ this._onMetaToggle.bind(this) }
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
