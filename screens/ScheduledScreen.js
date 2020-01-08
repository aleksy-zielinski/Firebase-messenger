import React from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Image,
  Text,
  Alert,
} from 'react-native';
import {   MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';
import { Appbar } from 'react-native-paper';
import { GiftedChat, Bubble } from 'react-native-gifted-chat'
import Moment from 'moment';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import DateTimePicker from 'react-native-modal-datetime-picker';

import SchedulerView from '../components/Guests/SchedulerView';
import ShareView from '../components/Guests/ShareView';
import EditReservationView from '../components/Guests/EditReservationView';



export default class ScheduledScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      messages: [],
      viewSelect: 0,
      selectIndexTop: 0,
      selectIndexBot: 0,
      emai: '',
      phone: '',
      isDateTimePickerVisible: false,
    };

    this.item = this.props.navigation.getParam('item');

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
          avatar: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Facebook_default_male_avatar.gif',
        },
      }
      messages.push(m);
    })
    return messages

  }

  getMessage = async () => {

    if (!this.item.thread_id){
      Alert.alert('Error', 'Thread id null')
      return
    }
    
    this.setState({isLoading:true})

    try {
      let url = `https://mobile-dot-ruebarue-curator.appspot.com/m/api/messaging/thread/${this.item.thread_id}`
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


  _goBack = () => this.props.navigation.goBack();


  appBarSetect = (index) => {
    console.log('Shown more');
    this.setState({viewSelect:index})
  }

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
    return Moment(newDate).format("DD/MM/YYYY");
  }

  _showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  }

  _hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false});
  }

  _handleDatePicked = (date) => {
    console.log('A date has been picked: ', date);
    if (this.pickingBirthDay){
      this.setState({ birthDate: date, isDateTimePickerVisible: false });
    } else{
      this.setState({ adopDate: date, isDateTimePickerVisible: false });
    }
    
  };


  render(){

    const item = this.props.navigation.getParam('item');
    let start_time = this.formatTime(item.check_in);
    let end_time = this.formatTime(item.check_out);

    let contentView;
    switch (this.state.viewSelect) {
      case 0:
        contentView = (
          <SchedulerView/>
        )
        break;
      case 1:
        contentView = (
          <GiftedChat
            renderBubble={this.renderBubble}
            messages={this.state.messages}
            onSend={messages => this.onSend(messages)}
            user={{
              _id: 1,
            }}
          />
        )
        break;
      case 2:
        contentView=(
          <KeyboardAwareScrollView>
            <ShareView 
              isEmail={true}
              emai={this.state.email} 
              selectIndexTop={this.state.selectIndexTop} 
              onPress={(index)=> this.setState({selectIndexTop:index}) }
            />
            <ShareView
              isEmail={false}
              phone={this.state.phone} 
              selectIndexTop={this.state.selectIndexBot} 
              onPress={(index)=> this.setState({selectIndexBot:index}) }
            />
          </KeyboardAwareScrollView>
        )
        break
      case 3:
          contentView = (
            <KeyboardAwareScrollView>
              <EditReservationView 
                item= {item} 
                showDatePicker={this.state.isDateTimePickerVisible} 
                onPress={(value)=> {this.setState({isDateTimePickerVisible: value})} }
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
          <Appbar.Action icon={({ size, color }) => (
              <MaterialCommunityIcons
                color =  {'lightgray'}
                name={'calendar-text'}
                size={28}
              />
            )} 
            onPress={()=>this.appBarSetect(0)} 
          />
           <Appbar.Action icon={({ size, color }) => (
              <Ionicons
                color =  {'lightgray'}
                name={'ios-chatbubbles'}
                size={28}
              />
            )} 
            onPress={()=>this.appBarSetect(1)} 
          />
          <Appbar.Action icon={({ size, color }) => (
              <Ionicons
                color =  {'lightgray'}
                name={'ios-share-alt'}
                size={28}
              />
            )} 
            onPress={()=>this.appBarSetect(2)} 
          />
          <Appbar.Action icon={({ size, color }) => (
              <MaterialCommunityIcons
                color =  {'lightgray'}
                name={'square-edit-outline'}
                size={28}
              />
            )} 
            onPress={()=>this.appBarSetect(3)} 
          />
          <Appbar.Action icon={({ size, color }) => (
              <Feather
                color =  {'lightgray'}
                name={'link'}
                size={23}
              />
            )} 
            onPress={()=>this.appBarSetect(4)} 
            />
          <Appbar.Action icon={({ size, color }) => (
              <MaterialCommunityIcons
                color =  {'lightgray'}
                name={'delete-forever'}
                size={28}
              />
            )} 
            onPress={()=>this.appBarSetect(5)} 
          />
        </Appbar.Header>

        <DateTimePicker
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this._handleDatePicked}
          onCancel={this._hideDateTimePicker}
          // date={toDay}
          // maximumDate = {toDay}
        />

        <View style={styles.headContainer}> 
            <View style={styles.topContainer}>

              <Image
                style={styles.avatar}
                source={{ uri: 'https://facebook.github.io/react-native/img/tiny_logo.png' }}
              />
              <View style={{marginLeft: 10, flex: 1}}>
              
                  <Text style= {styles.nameText}>{`${item.first_name} ${item.last_name}`}</Text>
                  <Text style={styles.locationText}>{item.rental_name}</Text>
                  <Text style={styles.durationText}>{start_time} - {end_time}</Text>

              </View>

            </View>

            <Text style={[styles.contentText]}>  {`${item.email} /${item.phone}`} </Text>
            <View style={{flexDirection:'row', marginBottom: 20, marginTop: 4}}>
            <Text style={[styles.codeText, {color: 'dimgray', marginLeft: 20}]}> Door Code: </Text>
            <Text style={styles.codeText}> {item.door_code} </Text>

          </View>
        </View>
          
          {contentView}

          
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
