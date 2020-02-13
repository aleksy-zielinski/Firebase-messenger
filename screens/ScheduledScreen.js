import React from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Text,
  Alert,
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser'
import { Appbar } from 'react-native-paper';
import { GiftedChat, Bubble } from 'react-native-gifted-chat'
import Moment from 'moment';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import DateTimePicker from 'react-native-modal-datetime-picker';

import SchedulerView from '../components/Guests/SchedulerView';
import ShareView from '../components/Guests/ShareView';
import EditReservationView from '../components/Guests/EditReservationView';
import Constant from '../constants/Constant';


export default class ScheduledScreen extends React.Component {

  constructor(props) {
    super(props);

    this.item = this.props.navigation.getParam('item');

    this.state = {
      messages: [],
      recipients: [],
      viewSelect: 0,
      selectIndexTop: 0,
      isDateTimePickerVisible: false,
      isPickingCheckIn: true,
      checkInDate: new Date(this.item.check_in),
      checkOutDate: new Date(this.item.check_out),
      shareOption: [],
      sent_scheduled_messages: this.item.sent_scheduled_messages,
      isLoading: false,
    };

    this.userShort = this.item.first_name.substring(0,1) + this.item.last_name.substring(0,1);

  }

  componentDidMount(){
    this.getMessage()
    this.getListAction()
  }

  getListAction = async () => {

    try {
      const url = Constant.severUrl + 'api/scheduler'
      let response = await fetch(url, {
        method: 'GET',
        headers: {
          Cookie: global.cookies,
        },
      });
      let responseJson = await response.json();

      if (responseJson && Object.keys(responseJson).length > 0){
        this.setState({shareOption: responseJson})
      } else{
        console.log('no action found');
      }
      
    } catch (error) {
      console.error(error);
    }
  }

  createMessage = (res, recipients) => {
    recipients = recipients || this.state.recipients;

    let messages = [];    
    let primary = recipients.filter((r) => {
      return r.primary;
    })[0] || {};
    res.forEach( item => {
      var initals = ""

      if (item.sender_type === "recipient"){
        recipient = recipients.filter((r) => {
          return r.id.toString() === item.sender_id.toString();
        })[0];

        if (!!recipient){
          initials = `${ recipient.first_name[0] || "" }${ recipient.last_name[0] || "" }`
        } 
      } else if (item.sender_type === "guest") {
        initials = this.userShort;
      } else {
        initials = `${ primary.first_name[0] || "" }${ primary.last_name[0] || "" }`
      }

      const m = {
        _id: item.id,
        text: item.content,
        createdAt: item.created_at,
        user: {
          _id: item.sender_type,
          name: initials
        },
      }
      messages.push(m);
    })
    return messages.reverse()

  }

  getMessage = async () => {
    console.log(this.item.thread_id)

    if (!this.item.thread_id){
      return
    }
    
    this.setState({isLoading:true})

    var guest = {},
        messages = [],
        recipients = [];

    Promise.all([
      new Promise( async (res, rej) => {
        const url = Constant.severUrl + `api/messaging/thread/${this.item.thread_id}`
        
        try {
          let response = await fetch(url, {
            method: 'GET',
            headers: {
              Cookie: global.cookies,
            },
          });
          let responseJson = await response.json();

          if (responseJson && Object.keys(responseJson).length > 0){
            
            guest = responseJson.guest;
            messages = responseJson.messages;
            console.log("success")
            res();
          } else{
            console.log('no data');
            res();
          }
        } catch (error) {
          res();
        }
      }),

      new Promise( async (res, rej) => {
        try {
          const url = Constant.severUrl + `/api/messaging/inbox/current`
          let response = await fetch(url, {
            method: 'POST',
            headers: {
              Cookie: global.cookies,
            },
          });
          let responseJson = await response.json();
          if (responseJson && Object.keys(responseJson).length > 0){
            recipients = responseJson.recipients
            res()
          } else{
            console.log('no data for inbox');
            res()
          }
        } catch (error) {
          console.error("error", error);
          res()
        }
      })
    ]).then(() => {
      let msgs = this.createMessage(messages, recipients)

      this.setState({isLoading:false, guest: guest, messages: msgs, recipients: recipients})
    })
  }


  _goBack = () => this.props.navigation.goBack();


  appBarSetect = (index) => {
    if (index == 4){
      if (this.item.guestlink_id){
        WebBrowser.openBrowserAsync(`https://www.ruebarue.com/guestbook/${this.item.guestlink_id}`)
      } else if (this.item.rental_id){
        WebBrowser.openBrowserAsync(`https://www.ruebarue.com/rental/${this.item.rental_id}`)
      } else{
        Alert.alert('Delete Guest', 'Are you sure?', 
        [{ text: 'OK', onPress: () => {  this.props.navigation.goBack();} },
        { text: 'Cancel'}])
        return
      }
      
    } else if (index == 5){
      Alert.alert('Delete Guest', 'Are you sure?', 
        [{ text: 'OK', onPress: () => { this.deleteGuest() } },
        { text: 'Cancel'}])
        return
    } 
    this.setState({viewSelect:index})
  }

  shareRequest = async (messageId, altContact)=>{

    this.setState({isLoading:true})

    try {

      const url = Constant.severUrl + `api/scheduler/${messageId}/reservation/${this.item.id}/send?contact=${altContact || ""}`

      let response = await fetch(url, {
        method: 'POST',
        headers: {
          Cookie: global.cookies,
        }
      });
      
      let responseJson = await response.json();
      
      if (responseJson && Object.keys(responseJson).length > 0){
        const newValue = this.state.sent_scheduled_messages + ` ${messageId}`
        this.setState({sent_scheduled_messages: newValue, isLoading:false}) 
      } else{
        this.setState({isLoading:false})
        Alert.alert('Error', 'no response from sever')
      }
      
    } catch (error) {
      this.setState({isLoading:false})
      Alert.alert('Error sending message')
      // console.error(error);
    }

  }

  onSend(messages = []) {
    this.sendMessage(messages);
  }

  sendMessage = async (messages)=>{

    Keyboard.dismiss();
    this.setState({isLoading:true})

    try {
      let formdata = new FormData();

      formdata.append('message', messages[0].text)
      formdata.append('thread_id', this.item.thread_id)


      const url = Constant.severUrl + 'api/messaging/inbound/app'
      
      let response = await fetch(url, {
        method: 'POST',
        headers: {
          Cookie: global.cookies,
        },
        body: formdata,
      });
      
      let responseJson = await response.json();
      if (responseJson && Object.keys(responseJson).length > 0){
        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, messages), isLoading:false
        }))
      } else{
        this.setState({isLoading:false})
        Alert.alert('Error', 'no data')
      }
      
    } catch (error) {
      this.setState({isLoading:false})
      Alert.alert('Error',error.message)
      console.error(error);
    }

  }

  deleteGuest = async () => {
    try {

      this.setState({isLoading:true})

      const url = Constant.severUrl + `api/reservations/delete`

      let response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({ids: [this.item.id]}),
        headers: {
          Cookie: global.cookies,
        }
      });
      
      let responseJson = await response.json();
      if (responseJson.status === "OK") {
        this.setState({isLoading:false})
        this.props.navigation.state.params.callBack();
        this._goBack()
      } else {
        this.setState({isLoading:false})
        Alert.alert('Error', 'Could not delete guest')
      }    
    } catch (error) {
      this.setState({isLoading:false})
      console.log("Error deleting guest: ", error)
      Alert.alert('Error deleting guest')
    }
  }

  saveGuestInfo = async (pms_id, first_name, last_name, email, phone, door_code) =>{

    Keyboard.dismiss();
    this.setState({isLoading:true})

    let start_time = Moment(this.state.checkInDate).format("YYYY-MM-DD");
    let end_time = Moment(this.props.checkOutDate).format("YYYY-MM-DD");

    // try {
      let formdata = new FormData();

      formdata.append('id', this.item.id)
      formdata.append('reservation_id', this.item.reservation_id)

      formdata.append('pms_id', pms_id)
      formdata.append('first_name', first_name)
      formdata.append('last_name', last_name)
      formdata.append('check_in', start_time)
      formdata.append('check_out', end_time)
      formdata.append('email', email)
      formdata.append('phone', phone)
      formdata.append('door_code', door_code)

      const url = Constant.severUrl + 'api/reservations/save'
     
      let response = await fetch(url, {
        method: 'POST',
        headers: {
          Cookie: global.cookies,
        },
        body: formdata,
      }).catch((resp) => {
        console.log("Failed")
        console.log(response)
      })
      
      let responseJson = await response.json();
      if (responseJson && Object.keys(responseJson).length > 0){
        this.item = responseJson
        this.setState({isLoading:false})
        Alert.alert('', 'Successfully saved the changes')
      } else{
        this.setState({isLoading:false})
        Alert.alert('Error', 'no response from sever')
        Alert.alert('Error', 'no data')
      }
      
    // } catch (error) {
    //   this.setState({isLoading:false})
    //   Alert.alert('Error',error.message)
    //   console.error(error);
    // }

  }

  renderBubble= (props) => {
    return (
      <Bubble
        {...props}
        textStyle={{
          left: {
            color: 'black',
            fontWeight: '300'
          },
          right: {
            color: 'white',
            fontWeight: '300'
          },
        }}
        wrapperStyle={{
          left: {
            backgroundColor: '#fff',
          },
          right: {
            backgroundColor: '#78AD6B',
          },
        }}
        
      />
    );
  }

  renderAvatar= (props) => {
    return (
      <View style={{width: 36, height: 36, backgroundColor: '#4d6b85', borderRadius: 18, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{color: 'white', fontSize: 12}}>{(((props.currentMessage || {}).user || {}).name || "??")}</Text>
      </View>
    );
  }

  formatTime = (timeStr) => {
    let newDate = new Date(timeStr);
    return Moment(newDate).format("MM/DD/YYYY");
  }

  _showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  }

  _hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false});
  }

  _handleDatePicked = (date) => {
    if (this.state.isPickingCheckIn){
      this.setState({  isDateTimePickerVisible: false, checkInDate: date }); 
    } else{
      this.setState({ isDateTimePickerVisible: false, checkOutDate: date });
    }
    
  };


  render(){

    const item = this.item
    const start_time = this.formatTime(item.check_in);
    const end_time = this.formatTime(item.check_out);
    const {viewSelect} = this.state

    let appBarIcon = [
      'calendar-text',
      'chart-bubble',
      'share',
      'square-edit-outline',
      'delete-forever'
    ]

    if (this.item.rental_id || this.item.guestlink_id){
      appBarIcon = [
        'calendar-text',
        'chart-bubble',
        'share',
        'square-edit-outline',
        'link-variant',
        'delete-forever'
      ]
    }
    
    const appBar = appBarIcon.map( (icon, index) =>
      <Appbar.Action 
        key = {icon}
        color =  {viewSelect == index ? 'white' : 'darkgray'} 
        icon= {icon}
        onPress={()=>this.appBarSetect(index)} 
      />
    )

    let contentView;
    switch (viewSelect) {
      case 0:
        contentView = (
          <SchedulerView
            messagesIds={this.state.sent_scheduled_messages} 
            options={this.state.shareOption}
            onPress={(messageId)=> this.shareRequest(messageId) }
          />
        )
        break;
      case 1:
        contentView = (
          <GiftedChat
            showUserAvatar={true}
            renderBubble={this.renderBubble}
            renderAvatar={this.renderAvatar}
            messages={this.state.messages}
            onSend={messages => this.onSend(messages)}
            user={{
              _id: 'recipient' || 'automated',
            }}
          />
        )
        break;
      case 2:
        contentView=(
          <KeyboardAwareScrollView enableOnAndroid={true}>
            <ShareView 
              item={item} 
              options={this.state.shareOption}
              pending={this.state.pending}
              onPress={(messageId, contact)=> this.shareRequest(messageId, contact) }
              cancelPress={()=>
                this.setState({viewSelect:1})
              }
            />
          </KeyboardAwareScrollView>
        )
        break
      case 3:
          contentView = (
            <KeyboardAwareScrollView enableOnAndroid={true}>
              <EditReservationView 
                item= {item} 
                showDatePicker={this.state.isDateTimePickerVisible} 
                checkIn = {this.state.checkInDate}
                checkOut = {this.state.checkOutDate}
                onPressTimePicker={(value)=> {
                  this.setState({isDateTimePickerVisible: true, isPickingCheckIn: value})} 
                }
                cancelPress={()=>
                  this.setState({viewSelect:1})
                }
                onSave={(pms_id, first_name, last_name, email, phone, door_code)=>
                  this.saveGuestInfo(pms_id, first_name, last_name, email, phone, door_code)
                }
                />
            </KeyboardAwareScrollView>
          )
          break;
      default:
        contentView = (
          <View/>
        )
        break;
    }

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
          {appBar}
        </Appbar.Header>

        <DateTimePicker
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this._handleDatePicked}
          onCancel={this._hideDateTimePicker}
          date={this.state.isPickingCheckIn ? this.state.checkInDate : this.state.checkOutDate}
          // maximumDate = {toDay}
        />

        <View style={styles.headContainer}> 
            <View style={styles.topContainer}>

              <View style={{width: 48, height: 48, backgroundColor: '#4d6b85', borderRadius: 24, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color: 'white', fontSize: 16}}>{this.userShort}</Text>
              </View>
              <View style={{marginLeft: 10, flex: 1}}>
              
                  <Text style= {styles.nameText}>{`${item.first_name} ${item.last_name}`}</Text>
                  <Text style={styles.locationText}>{item.pms_id}</Text>
                  <Text style={styles.durationText}>{start_time} - {end_time}</Text>

              </View>

            </View>

        </View>
          
          {contentView}
          {Platform.OS === 'android' && viewSelect === 1
              && <KeyboardAvoidingView behavior="padding" />
              }

          {this.state.isLoading &&
              <View style={styles.loadingStyle}>
                <ActivityIndicator size='large' />
              </View>
            }

          
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
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,
  },
  loadingStyle: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.8,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center'
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
    fontSize: 17,
    lineHeight: 20    
  },
  durationText: {
    color: 'dimgray',
    fontSize: 13,
    marginTop: 4
  },
  locationText: {
    color: 'dimgray',
    fontSize: 13
  },
  contentText: {
    textAlign: 'left',
    fontWeight: '300',
    fontSize: 15,
    lineHeight: 18,
    marginHorizontal: 20
  },
  codeText: {
    textAlign: 'left',
    fontWeight: '300',
    fontSize: 15,
    lineHeight: 18
  }
});
