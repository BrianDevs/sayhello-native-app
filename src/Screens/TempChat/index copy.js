import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import { GiftedChat, Composer, Send, Bubble, Actions } from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import imagePath from '../../constants/imagePath';
import { StylesGloble } from '../../helper/Globlecss';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Uploadimage from '../../helper/Uploadimage';
import ApiDataService from "./../../services/Apiservice.service"


const TempChat = ({ navigation, route }) => {
    console.log('routeeee----------', route.params);
    const senderid = route?.params?.sender;
    const reciverid = route?.params?.receiver;
    const name = route?.params?.user_name;
    const image = route?.params?.user_image
    const s_name = route?.params?.name;
    const s_image = route?.params?.image;
    const [imagebox, setimagebox] = useState(false);
    const [Loading, setLoading] = useState(false);


    const [messageslist, setMessageslist] = useState([])
    const [senderId, setsenderId] = useState(route?.params?.sender);
    const [reciverId, setreciverId] = useState(route?.params?.receiver);
    const [text, setText] = useState('');
    const [imgurl,setimgurl] = useState('')



    useEffect(() => {
        const subscriber = firestore().collection('Chats')
            .doc(senderId + 'Chats' + reciverId)
            .collection('message')
            .orderBy('createdAt', 'desc');
        subscriber.onSnapshot(querysnapshot => {

            const allmessages = querysnapshot.docs.map(item => {
                return { ...item._data, createdAt: Date.parse(new Date()) }
            })

            console.log("+++++++++++++++++++++++++++++++++++");
            console.log(allmessages);
            console.log("+++++++++++++++++++++++++++++++")
            setMessageslist(allmessages);
        })

    }, [])

    const onSend = useCallback((messages = []) => {
            const msg = messages[0];
            var lenid = 1;
            if(messageslist != []){
                lenid = messageslist.length+1;
            }

            var myMessage = {
                _id:lenid,
                createdAt:new Date(),
                text:msg.text,
                user:{"_id":senderId},
                senderId: senderId,
                reciverId: reciverId,
                message: msg.text,
                type: 1,
                createddate: Date.parse(msg.createdAt)
        
            }
            firestore().collection('Chats').doc(senderId + 'Chats' + reciverId)
                .collection('message')
                .add(myMessage)
            setMessageslist(previousMessages =>
                GiftedChat.append(previousMessages, messages),
            )
            firestore().collection('Chats').doc(reciverId + 'Chats' + senderId)
                .collection('message')
                .add(myMessage)

    }, [])

    const renderActions = () => {

        return <Actions
            containerStyle={{
                // width: 44,
                // height: 44,
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 4,
                marginRight: 4,

            }}
            icon={() => (
                <TouchableOpacity onPress={() => setimagebox(true)}>
                    <Image style={{ width: 25, height: 25, }} source={imagePath.chatsgallery} />
                </TouchableOpacity>

            )}
        //   options={()=>}
        // optionTintColor="#222B45"
        />
    }

    const renderSend = (props) => {
        return <Send
            {...props}
            containerStyle={{ backgroundColor: "red" }}
            alwaysShowSend
            onSend={messages => onSend(messages)}
            text={text}
        // label="Send"
        >

        </Send>
        // <Send
        //   containerStyle={{

        //   }}
        // >
        //    <Image style={{  }}  />
        // </Send>

    }

    const closeimagepopup = (type, data, bs6) => {
        setimagebox(false);
        addimagelist(data);
    }

    const addimagelist =async (source,messages=[]) => {
        setLoading(true);
        const data = new FormData();
        data.append('file', { name: 'camera-picture', type: 'image/jpeg', uri: source.path });
        ApiDataService.Uploadapi('temporarySendImageFromChat', data).then(response => {
            setLoading(false);
            console.log('resssss-----------------------', response.data.data);
            if (response.data.status == true) {
               setimgurl(response.data.data)
               var lenid = 1;
               if(messageslist != []){
                   lenid = messageslist.length+1;
               }
   
               var myMessage = {
                   _id:lenid,
                   createdAt:new Date(),
                   user:{"_id":senderId},
                   senderId: senderId,
                   reciverId: reciverId,
                   image:response.data.data,
                   type: 1,
                   createddate: Date.parse(new Date())
                }
                firestore().collection('Chats').doc(senderId + 'Chats' + reciverId)
                   .collection('message')
                   .add(myMessage)
                setMessageslist(previousMessages =>
                   GiftedChat.append(previousMessages, messages),
                )
               firestore().collection('Chats').doc(reciverId + 'Chats' + senderId)
                   .collection('message')
                   .add(myMessage)
               
            }
        }).catch(e => {
            console.log('e------------', e);
            setLoading(false);
        });
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={{ ...StylesGloble.headerout, height: hp('10%'), }}>
                <TouchableOpacity onPress={() => { socket.current.disconnect(); navigation.navigate('Chatlist') }} style={{ ...StylesGloble.homeheaderlocation, left: wp('5%'), zIndex: 999, marginTop: 12, justifyContent: "center" }}>
                    <Image style={{ width: 20, height: 20 }} source={imagePath.backPage} />
                </TouchableOpacity>
                <TouchableOpacity style={{ ...StylesGloble.homeheaderprofile, left: wp('13%'), zIndex: 999, top: 15 }}>
                    {s_image ? <Image style={{ width: 40, height: 40, borderRadius: 40 }} source={{ uri: s_image }} /> :
                        <Image style={{ width: 40, height: 40, borderRadius: 40 }} source={{ uri: image }} />}

                </TouchableOpacity>
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
                messages={messageslist}
                onSend={messages => onSend(messages)}
                
                user={{
                    _id: senderId,
                }}

                // renderInputToolbar={customtInputToolbar}
                renderBubble={(props) => {
                    return <Bubble
                        {...props}
                        wrapperStyle={{
                            left: {
                                backgroundColor: "lightgrey",
                                marginLeft: -45
                            }
                        }}
                    />
                }}
                alwaysShowSend
                renderActions={renderActions}
                renderSend={props => {
                    return (
                        <View>
                            <Send {...props}>
                                <Image
                                    source={imagePath.chatsend}
                                    style={{ marginRight: 15, marginBottom: 5 }}
                                />
                            </Send>
                        </View>
                    )
                }}
            // isCustomViewBottom

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


export default TempChat;