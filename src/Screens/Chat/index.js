import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import { GiftedChat, Composer, Send, Bubble, Actions } from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import imagePath from '../../constants/imagePath';
import { StylesGloble } from '../../helper/Globlecss';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Uploadimage from '../../helper/Uploadimage';
import ApiDataService from "./../../services/Apiservice.service"

const makedocid = (sid,rid)=>{
    if(Number(sid) > Number(rid)){
        return sid+'Chat'+rid;
    }
    else{
        return rid+'Chat'+sid;
    }
}
const Chat = ({ navigation, route }) => {
    const name = route?.params?.user_name;
    const image = route?.params?.user_image;
    const chatiddb = makedocid(route?.params?.sender,route?.params?.receiver)
    const s_name = route?.params?.name;
    const s_image = route?.params?.image;
    const photo_option = route?.params?.photo_option
    const [imagebox, setimagebox] = useState(false);
    const [Loading, setLoading] = useState(false);
    const [messageslist, setMessageslist] = useState([])
    const [senderId, setsenderId] = useState(route?.params?.sender);
    const [reciverId, setreciverId] = useState(route?.params?.receiver);
    const [imgurl, setimgurl] = useState('');

    useEffect(() => {
        const subscriber = firestore().collection('Chats1')
        .doc(senderId + 'Chats' + reciverId)
        .collection('message')
        .orderBy('createdAt', 'desc');
        subscriber.onSnapshot(querysnapshot => {
            const allmessages = querysnapshot.docs.map(item => {
                return { ...item._data, createdAt: Date.parse(new Date()) }
            })
            setMessageslist(allmessages);
        })
    }, [])

    const onSend = useCallback((messages = []) => {
        const msg = messages[0];
        var myMessage = {
            _id:   Date.parse(new Date())+senderId+reciverId,
            createdAt: new Date(),
            text: msg.text,
            user: { "_id": senderId },
            senderId: senderId,
            reciverId: reciverId,
            message: msg.text,
            type: 1,
            createddate: Date.parse(msg.createdAt)
        }

        firestore().collection('Chats1').doc(senderId + 'Chats' + reciverId)
            .collection('message')
            .add(myMessage)
        setMessageslist(previousMessages =>
            GiftedChat.append(previousMessages, messages),
        )
        firestore().collection('Chats1').doc(reciverId + 'Chats' + senderId)
            .collection('message')
            .add(myMessage)
        addsomechatindb(0, msg.text);
    }, [])

    const addsomechatindb =(message_type,message)=>{
        let newmessagelist = [];
        let textsend = message;
        let image = '';
        if(message_type==1){
            textsend = '';
            image = message;
        }
        newmessagelist.push({
            "message":textsend,
            "image": image,
            "sender_id":senderId,
            "receiver_id":reciverId,
            "chat_type":1,
            "message_type":message_type,
            "room_id" : chatiddb
        })
        let formdata = {
            "chatData":newmessagelist,
        }
        let url = 'chat'
        ApiDataService.Postapi(url, formdata).then(response => {
            console.log(response);
        }).catch(e => {
        })
    }

    const closeimagepopup = (type, data, bs6) => {
        setimagebox(false);
        addimagelist(data);
    }

    const addimagelist = async (source, messages = []) => {
        setLoading(true);
        const data = new FormData();
        data.append('file', { name: 'camera-picture', type: 'image/jpeg', uri: source.path });
        ApiDataService.Uploadapi('sendImageFromChat', data).then(response => {
            setLoading(false);
            if (response.data.status == true) {
                setimgurl(response.data.data)
                var myMessage = {
                    _id:  Date.parse(new Date())+senderId+reciverId,
                    text:'',
                    message: '',
                    createdAt:new Date(),
                    user:{"_id":senderId},
                    senderId: senderId,
                    reciverId: reciverId,
                    image:response.data.data,
                    type: 1,
                    createddate: Date.parse(new Date())
                 }

                 firestore().collection('Chats1').doc(senderId + 'Chats' + reciverId)
                    .collection('message')
                    .add(myMessage)
                 setMessageslist(previousMessages =>
                    GiftedChat.append(previousMessages, messages),
                 )
                firestore().collection('Chats1').doc(reciverId + 'Chats' + senderId)
                    .collection('message')
                    .add(myMessage);

                addsomechatindb(1, response.data.data);
            }
        }).catch(e => {
            console.log('e------------', e);
            setLoading(false);
        });
    }


    return (
        <View style={{ flex: 1, }}>
            <View style={{ ...StylesGloble.headerout, height: hp('10%'), }}>
                <TouchableOpacity onPress={() => { navigation.navigate('Chatlist') }} style={{ ...StylesGloble.homeheaderlocation, left: wp('5%'), zIndex: 999, marginTop: 12, justifyContent: "center" }}>
                    <Image style={{ width: 20, height: 20 }} source={imagePath.backPage} />
                </TouchableOpacity>
                <View style={{ ...StylesGloble.homeheaderprofile, left: wp('13%'), zIndex: 999, top: 15 }}>
                    {(photo_option==0) ? <Image style={{ width: 40, height: 40, borderRadius: 50 }} source={imagePath.user_chat }/> :((s_image) ? <Image style={{ width: 40, height: 40, borderRadius: 40 }} source={{ uri: s_image }} /> : 
                        <Image style={{ width: 40, height: 40, borderRadius: 40 }} source={{ uri: image }} />)}
                </View>
                {s_name ?
                    <Text style={{ ...StylesGloble.fontsmall, fontSize: 18, ...StylesGloble.homeheadername, left: wp('9%') + 65, zIndex: 999, fontWeight: '700', marginTop: 10 }}>
                        {s_name}
                    </Text>
                    :
                    <Text style={{ ...StylesGloble.fontsmall, fontSize: 18, ...StylesGloble.homeheadername, left: wp('10%') + 65, zIndex: 999, fontWeight: '700', marginTop: 10, fontSize: 20 }}>
                        {name}
                    </Text>}
            </View>
            <GiftedChat
                alwaysShowSend
                renderSend={props => {
                    return (
                        <View
                            style={{ flexDirection: 'row', alignItems: 'center', height: 50 }}>
                          
                            <TouchableOpacity
                                style={{ marginRight: 20 }}
                                onPress={() => {
                                    setimagebox(true)
                                }}>
                                <Image
                                   source={imagePath.chatsgallery}
                                    style={{ width: 24, height: 24 }}
                                />
                            </TouchableOpacity>
                            <Send {...props} containerStyle={{ justifyContent: 'center' }}>
                                <Image
                                    source={imagePath.chatsend}
                                    style={{
                                        width: 24,
                                        height: 24,
                                        marginRight: 10,
                                    }}
                                />
                            </Send>
                        </View>
                    );
                }}
                messages={messageslist}
                onSend={messages => onSend(messages)}
                user={{
                    _id: senderId,
                }}
                style={{}}
                renderBubble={props => {
                    return (
                        <Bubble
                            {...props}
                            wrapperStyle={{
                                left: {
                                    backgroundColor: 'lightgrey',
                                    marginLeft: -45
                                },
                            }}
                        />
                    );
                }}
            />
             {
                imagebox && (
                    <Uploadimage closeimagepopup={closeimagepopup} width={wp('100%')} height={400} cropperCircleOverlay={false} />
                )
            }
        </View>
    );
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        width: "100%",
        padding: 5,
    },

    textInputContainer: {
        marginBottom: 20,
        padding: 10
    },
    roundedTextInput: {
        borderRadius: 10,
        borderWidth: 2,
        borderBottomWidth: 2,
        borderColor: "#cccbd599",
        backgroundColor: "#cccbd599",
        color: "#000000",
    },
    buttonWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
        width: '60%',
    },


});


export default Chat;