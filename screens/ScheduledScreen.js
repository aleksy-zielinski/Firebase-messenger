import React from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Image,
  Text
} from 'react-native';
import {  Entypo, MaterialCommunityIcons, Ionicons, SimpleLineIcons, Feather } from '@expo/vector-icons';
import { Appbar } from 'react-native-paper';


export default class ScheduledScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      messages: [
        {
          _id: 2,
          text: 'Hi',
          createdAt: new Date(),
          user: {
            _id: 1,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        {
          _id: 1,
          text: 'Hello',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
      ]
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

  _onPressCell = (item) => {

    this.props.navigation.navigate('Chat',{
      item: item
    });

  }

  _goBack = () => this.props.navigation.goBack();

  _handleBox = () => console.log('Searching');

  _handleMore = () => console.log('Shown more');

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

  renderBubble= (props) => {
    return (
      <Bubble
        {...props}
        textStyle={{
          left: {
            color: 'white',
          },
          right: {
            color: 'white',
          },
        }}
        wrapperStyle={{
          left: {
            backgroundColor: '#4d6b85',
          },
          right: {
            backgroundColor: 'darkgray',
          },
        }}
        
      />
    );
  }

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
              <MaterialCommunityIcons
                color =  {'lightgray'}
                name={'calendar-text'}
                size={28}
              />
            )} 
            onPress={this._handleMore} 
          />
           <Appbar.Action icon={({ size, color }) => (
              <Ionicons
                color =  {'lightgray'}
                name={'ios-chatbubbles'}
                size={28}
              />
            )} 
            onPress={this._handleMore} 
          />
          <Appbar.Action icon={({ size, color }) => (
              <Ionicons
                color =  {'lightgray'}
                name={'ios-share-alt'}
                size={28}
              />
            )} 
            onPress={this._handleMore} 
          />
          <Appbar.Action icon={({ size, color }) => (
              <MaterialCommunityIcons
                color =  {'lightgray'}
                name={'square-edit-outline'}
                size={28}
              />
            )} 
            onPress={this._handleMore} 
          />
          <Appbar.Action icon={({ size, color }) => (
            <Feather
              color =  {'lightgray'}
              name={'link'}
              size={23}
            />
          )} 
          onPress={this._handleBox} />
          <Appbar.Action icon={({ size, color }) => (
            <MaterialCommunityIcons
              color =  {'lightgray'}
              name={'delete-forever'}
              size={28}
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
{/*        
        <FlatList 
            ref={notiRef => this.listView = notiRef}
            data={this.data}
            // key={keyGrid}
            // numColumns={2}
            keyExtractor={item => item.user_name}
            // refreshing={isRefresh}
            // onRefresh={this.actionRefresh}
            renderItem={({ item }) => (
              <ChatCell
                item={item}
                onPress={()=> this._onPressCell(item.post) }
              />
            )}
            // onEndReached={this.actionLoadMore}
            // onEndReachedThreshold={0.01}
            removeClippedSubviews={Platform.OS !== 'ios'} // improve scroll performance for large lists bug will bug disappear on ios
          /> */}
          
    </View>
    );
  }
  
}

ScheduledScreen.navigationOptions = {
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
