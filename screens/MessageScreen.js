import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  FlatList,
  Platform,
  ActivityIndicator,
} from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import {  FontAwesome } from '@expo/vector-icons';
import TaskCell from '../components/TaskCell';

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
      recipients: [],
      filter: '',
      isLoading: false,
    };
  }

  componentDidMount(){
    
    this.getThread()

  }

  getThread = async () => {
    
    this.setState({isLoading:true})

    try {

      let response = await fetch(`https://mobile-dot-ruebarue-curator.appspot.com/m/api/messaging/inbox/0/threads?page=1&filter=${this.state.filter}`, {
        method: 'GET',
        headers: {
          Cookie: global.cookies,
        },
      });
      let responseJson = await response.json();
      

      if (responseJson){
        console.log(responseJson.recipients.length);
        this.setState({isLoading:false, recipients: responseJson.recipients})
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

    // const selectCate =  options[index]
    let filter = ['all', 'priority','unread'][index];
    console.log(filter)
    this.setState({ selectedIndex: index, filter: filter });
    this.getThread()

  }

  _onPressCell = (item) => {

    this.props.navigation.navigate('Chat',{
      item: item
    });

  }

  render(){

    const {recipients} = this.state;

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
            pointerEvents= 'none'
            style = {styles.arrow}
            name={'angle-down'}
            size={30}
          />

        </View>
       
        <FlatList
              ref={notiRef => this.listView = notiRef}
              data={recipients}
              // key={keyGrid}
              // numColumns={2}
              keyExtractor={item => `${item.id}`}
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
             {this.state.isLoading &&
              <View style={styles.loadingStyle}>
                <ActivityIndicator size='small' />
              </View>
            }
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
    borderRadius: 5,
    marginLeft: 10, 
    marginRight: 10,
    marginTop: 10, 
    marginBottom: 0,
    height: 40,
    flexDirection: 'row',
  },
  arrow: {
    position: 'absolute',
    color: 'gray',
    right: 10,
    top: 5,
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
