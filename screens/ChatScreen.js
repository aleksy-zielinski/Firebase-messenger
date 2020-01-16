import React from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Image,
  Text,
  ActivityIndicator,
} from 'react-native';
import {  Entypo } from '@expo/vector-icons';
import { Appbar } from 'react-native-paper';
import { GiftedChat, Bubble } from 'react-native-gifted-chat'
import Moment from 'moment';

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
      guest: null,
      messages: [],
    };
    this.pageData = this.props.navigation.getParam('page');
  }

  componentDidMount(){
    this.getMessage()
  }

  creatMessage = (res) => {

    let messages = [];
    res.forEach( item =>{
      const m = {
        _id: item.id,
        text: item.content,
        createdAt: item.created_at,
        user: {
          _id: item.sender_id,
          name: item.sender_type,
          avatar: 'https://placeimg.com/140/140/any',
        },
      }
      messages.push(m);
    })
    return messages

  }

  getMessage = async () => {
    
    this.setState({isLoading:true})

    try {
      let url = `https://mobile-dot-ruebarue-curator.appspot.com/m/api/messaging/thread/${this.pageData.id}`
      console.log(url)
      let response = await fetch(url, {
        method: 'GET',
        headers: {
          Cookie: global.cookies,
        },
      });
      let responseJson = await response.json();

      if (responseJson && Object.keys(responseJson).length > 0){
        console.log(responseJson);
        let mes = this.creatMessage(responseJson.messages)
        this.setState({isLoading:false, guest: responseJson.guest, messages: mes})
      } else{
        console.log('no data');
        this.setState({isLoading:false})
      }
       
      
    } catch (error) {
      console.error(error);
      this.setState({isLoading:false})
    }
  }

  _goBack = () => {
    console.log('back')
    this.props.navigation.goBack()
  }

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

  formatTime = (timeStr) => {
    let newDate = new Date(timeStr);
    return Moment(newDate).format("MM/DD/YYYY");
  }


  render(){

    const {guest} = this.state;
    if (!guest ){
      return (
        <View style={styles.container}>
          <StatusBar barStyle="light-content" />
          <Appbar.Header style={{backgroundColor:'#455a69'}}>
            <Appbar.BackAction
              onPress={()=>this._goBack()}
            />
            
          </Appbar.Header>
          {this.state.isLoading ?
              <View style={styles.loadingStyle}>
                <ActivityIndicator size='small' />
              </View>
              : 
              <View style={styles.loadingStyle}>
               <Text> No data </Text>
              </View>              
            }
        </View>
      )
    }
    let start_time = this.formatTime(guest.created_at);
    let end_time = this.formatTime(guest.updated_at);
    

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />

        <Appbar.Header style={{backgroundColor:'#455a69'}}>
          <Appbar.BackAction
            onPress={()=>this._goBack()}
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
              color =  {this.pageData.meta_values.includes('priority') ? 'salmon' : 'darkgray'}
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
              
                  <Text style= {styles.nameText}>{guest.name}</Text>
                  {/* <Text style={styles.locationText}>{guest.location}</Text> */}
                  <Text style={styles.durationText}>{start_time} - {end_time}</Text>

              </View>

            </View>

            <View style={{flexDirection:'row', marginTop: 4}}>
              <Text style={[styles.codeText, {color: 'dimgray', marginLeft: 20}]}>Email: </Text>
              <Text style={[styles.codeText]}>{guest.email}</Text>
            </View>

            <View style={{flexDirection:'row', marginTop: 4, marginBottom: 20,}}>
              <Text style={[styles.codeText, {color: 'dimgray', marginLeft: 20}]}>Phone:</Text>
              <Text style={[styles.codeText]}>{guest.phone}</Text>
            </View>

            {guest.door_code && 
              <View style={{flexDirection:'row', marginBottom: 20, marginTop: 4}}>
                <Text style={[styles.codeText, {color: 'dimgray', marginLeft: 20}]}>Door Code: </Text>
                <Text style={styles.codeText}>{guest.door_code}</Text>
              </View>
            }
            
        </View>
           <GiftedChat
            renderBubble={this.renderBubble}
            messages={this.state.messages}
            onSend={messages => this.onSend(messages)}
            user={{
              _id: guest.id,
            }}
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
  loadingStyle: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 120,
    bottom: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
    margin: 20
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
    marginTop: 4
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
