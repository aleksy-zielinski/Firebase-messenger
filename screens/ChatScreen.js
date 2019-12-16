import React from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  FlatList,
  Platform,
  Image,
  Text
} from 'react-native';
import {  FontAwesome, Entypo } from '@expo/vector-icons';
import TaskCell from '../components/TaskCell';
import { Appbar } from 'react-native-paper';

const options = [
  'All messages',
  'Priority',
  'Unread',
];

export default class ChatScreen extends React.Component {

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

    this.props.navigation.navigate('Chat',{
      item: item
    });

  }

  _goBack = () => this.props.navigation.goBack();

  _handleBox = () => console.log('Searching');

  _handleMore = () => console.log('Shown more');

  render(){

    const item = this.props.navigation.getParam('item');

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />

        <Appbar.Header style={{backgroundColor:'#455a69'}}>
          <Appbar.BackAction
            onPress={this._goBack}
          />
          <Appbar.Content
            title=""
          />
          <Appbar.Action icon={({ size, color }) => (
            <Entypo
              color =  {'lightgray'}
              name={'box'}
              size={25}
            />
          )} 
          onPress={this._handleBox} />
          <Appbar.Action icon={({ size, color }) => (
            <Entypo
              color =  {'lightgray'}
              name={'flag'}
              size={25}
            />
          )} 
          onPress={this._handleMore} />
        </Appbar.Header>

        <View style={styles.headContainer}> 
            <View style={styles.topContainer}>

              <Image
                style={styles.avatar}
                source={{ uri: 'https://facebook.github.io/react-native/img/tiny_logo.png' }}
              />
              <View style={{marginLeft: 10, flex: 1}}>
              
                  <Text style= {styles.nameText}>{item.user_name}</Text>
                  <Text style={styles.locationText}>{item.location}</Text>
                  <Text style={styles.durationText}>{item.start_time} - {item.end_time}</Text>

              </View>

            </View>

            <Text style={[styles.contentText]}> david.fincher@gmail.com / 617-216-9862 </Text>
            <View style={{flexDirection:'row', marginBottom: 20, marginTop: 4}}>
            <Text style={[styles.codeText, {color: 'dimgray', marginLeft: 20}]}> Door Code: </Text>
            <Text style={styles.codeText}> 1244 </Text>

          </View>
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
                onPress={()=> this._onPressCell(item.post) }
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

ChatScreen.navigationOptions = {
  title: 'Chat',
  headerTintColor: 'white',
  headerStyle: {
    backgroundColor: '#455a69',
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  headContainer: {
    backgroundColor: 'white',
    borderColor: 'darkgray',
    margin: 0,
  },
  topContainer: {
    flexDirection: 'row',
    margin: 20,
  },
  avatar: {
    width: 50, 
    height: 50,
    borderRadius: 25,
  },
  nameText: {
    fontSize: 20,
  },
  durationText: {
    color: 'dimgray',
    fontSize: 13,
  },
  locationText: {
    color: 'dimgray',
    fontSize: 15,
  },
  contentText: {
    textAlign: 'justify',
    fontWeight: '300',
    fontSize: 15,
    marginHorizontal: 20
  },
  codeText: {
    textAlign: 'justify',
    fontWeight: '300',
    fontSize: 15
  }
});
