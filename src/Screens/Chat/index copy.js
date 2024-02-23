//import liraries
import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { View, TextInput, Text, FlatList, StyleSheet, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { StylesGloble } from './../../helper/Globlecss';
import imagePath from './../../constants/imagePath';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiDataService from "./../../services/Apiservice.service";
import { useTranslation } from 'react-i18next';
import './../../Language/i18';
import Uploadimage from './../../helper/Uploadimage';
import moment from 'moment';
import Toast from 'react-native-simple-toast';


const Chat = ({ navigation, route }) => {
    const { t, i18n } = useTranslation();
    const chat_type = route?.params?.chattype
    const room_id = route?.params?.room;
    console.log('room_id--------------', room_id);
    const r_id = route?.params?.receiver;
    const s_id = route?.params?.sender;
    const recive = route?.params?.r_id
    console.log(',,,,,,,,', s_id);
    console.log('r_id', r_id);

    const name = route?.params?.user_name;
    const image = route?.params?.user_image
    const s_name = route?.params?.name;
    const s_image = route?.params?.image;
    const flatListRef = useRef(null);
    const socket = useRef();
    socket.current = io('http://57.128.107.121:6500');
    // socket.current = io('http://192.168.1.23:6500');

    const [userid, setuserid] = useState('')
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [imagebox, setimagebox] = useState(false);
    const [Loading, setLoading] = useState(false);

    const calltoastmessage = (data) => {
        Toast.showWithGravity(data, Toast.SHORT, Toast.BOTTOM,);
    };


    useEffect(() => {
        AsyncStorage.getItem('Applang', (err, cr) => {
            i18n.changeLanguage(cr)
        })
        AsyncStorage.getItem('userID', (err, cre) => {
            let userID = JSON.parse(cre);
            setuserid(userID);
        })
        socket.current.emit('chat_between_two_users_agian', {
            room_id: room_id,
            user_id: userid

        });

        socket.current.on('chat_between_two_users_agian', (data) => {
            console.log('dta-------', data.data);
            if (data) {
                setMessages(data.data);
            } else {
                console.error('Received empty data in chat_between_two_users event');
            }
        });
        return () => {
            socket.current.disconnect();
        };
    }, [])

    useEffect(() => {
        socket.current.on('single_data', (data) => {
            console.log('chattttttttttttttttttlog--------', data.data);
            if (data) {
                setMessages(messages => [...messages, data.data[0]])
            } else {
                console.log('Received empty data in chat_between_two_users event');
            }
        });
        return () => {
            socket.current.disconnect();
        };
    }, [room_id])

    const sendMessage = () => {
        if (inputText == '') {
            calltoastmessage('Please type message here');
        }
        else {
            let data = {
                message: inputText,
                image: '',
                sender_id: s_id,
                receiver_id: r_id,
                chat_type: chat_type,
                message_type: 0,
                room_id: room_id
            };
            console.log('data----roome id', data);
            socket.current.emit("chat", data)
            setInputText('');
        }
    };
    const closeimagepopup = (type, data, bs6) => {
        setimagebox(false);
        addimagelist(data);
    }

    const addimagelist = (source) => {
        setLoading(true);
        const data = new FormData();
        data.append('file', { name: 'camera-picture', type: 'image/jpeg', uri: source.path });
        ApiDataService.Uploadapi('sendImageFromChat', data).then(response => {
            setLoading(false);
            console.log('resssss', response.data.data);
            if (response.data.status == true) {

                let data = {
                    message: inputText,
                    image: response.data.data,
                    sender_id: s_id,
                    receiver_id: r_id,
                    chat_type: chat_type,
                    message_type: 1,
                    room_id: room_id
                };
                console.log('data----roome------------------------ id', data);
                socket.current.emit("chat", data)
                setInputText('');
            }
        }).catch(e => {
            console.log('e------------', e);
            setLoading(false);
        });
    }

    return (
        <View style={{ flex: 1, }}>
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
                </Text>
                }
            </View>

            <View style={{ width: wp('100%'), position: "relative", marginBottom: 80, paddingBottom: 80 }}>
                <FlatList
                    data={messages.slice().reverse()}
                    style={{}}
                    ref={flatListRef}
                    inverted={true}
                    renderItem={({ item }) => {
                        return (
                            <View style={{}} >
                                {
                                    (item.message_type == 0) ? (
                                        <View style={(item.sender_id == s_id) ? StylesFirst.alignright : StylesFirst.alignleft}>
                                            <Text style={{ color: 'white', fontWeight: '400', }}>{item.message}</Text>
                                            <Text style={{ color: 'white', fontWeight: '400', fontSize: 10, alignSelf: "flex-end", marginLeft: 25 }}>{moment(item.created_at).format('hh:mma')}</Text>
                                        </View>
                                    ) : (
                                        <View style={(item.sender_id == s_id) ? StylesFirst.alignright1 : StylesFirst.alignleft1}>
                                            {
                                                item.image ?
                                                    <ImageBackground style={{ width: 100, height: 100, }} source={{ uri: item.image }}></ImageBackground>
                                                    : null
                                            }
                                            <Text style={{ color: 'white', fontWeight: '400', fontSize: 10, alignSelf: "flex-end", marginLeft: 25 }}>{moment(item.created_at).format('hh:mma')}</Text>
                                        </View>
                                    )
                                }
                                <View style={{ marginLeft: 20 }}>
                                </View>
                            </View>
                        )
                    }}
                />
            </View>
            <View style={{ position: "absolute", bottom: 10, flexDirection: "row" }}>
                <TouchableOpacity style={{ width: wp('10%'), marginLeft: wp('1.5%'), marginLeft: 15, alignSelf: "center" }} onPress={() => { setimagebox(true) }}>
                    <Image style={{ width: 25, height: 25, }} source={imagePath.chatsgallery} />
                </TouchableOpacity>
                <View style={{ flexDirection: "row", borderColor: "#f3e9e9", borderRadius: 50, borderWidth: 1, backgroundColor: "#FFFFFF", }}>
                    <View style={{ width: wp('65%'), marginLeft: 10 }}>
                        <TextInput
                            value={inputText}
                            onChangeText={(text) => setInputText(text)}
                            style={{ width: "100%", height: 60, }}
                            placeholder={t("Type your message...")}
                            placeholderTextColor="#817878"
                            type="text"
                        />
                    </View>
                    <TouchableOpacity style={{ alignSelf: "center", width: wp('13%') }} onPress={sendMessage}>
                        <Image style={{ width: 30, height: 30 }} source={imagePath.chatsend} />
                    </TouchableOpacity>
                </View>
            </View>
            {
                imagebox && (
                    <Uploadimage closeimagepopup={closeimagepopup} width={wp('100%')} height={400} cropperCircleOverlay={false} />
                )
            }
        </View>
    );
};
export const StylesFirst = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    leftsecwidth: {
        width: "100%",
        height: "auto",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        marginTop: 12
    },
    rightsecwidth: {
        width: "100%",
        height: "auto",
        alignItems: "flex-end",
        justifyContent: "flex-end",
        marginTop: 12
    },
    rightside: {
        width: "90%",
        backgroundColor: "#acf0ff",
        borderTopStartRadius: 10,
        borderBottomStartRadius: 10,
        borderBottomEndRadius: 10,
        alignItems: "flex-end",
        justifyContent: "flex-end",
        padding: 10
    },
    timestamp: {
        fontSize: 12,
        color: '#CCCCCC',
    },
    leftside: {
        width: "90%",
        backgroundColor: "#f7eaea",
        borderTopStartRadius: 10,
        borderTopEndRadius: 10,
        borderBottomEndRadius: 10,
        alignItems: "flex-start",
        justifyContent: "flex-start",
        padding: 10
    },
    listoutertwo: {
        flexDirection: "row",
    },
    alignright: {
        backgroundColor: '#338AFF', alignSelf: 'flex-end', width: 'auto', padding: hp(1.5), marginTop: 20, marginRight: 15, marginLeft: 15, borderTopLeftRadius: 15, borderBottomLeftRadius: 15, borderBottomRightRadius: 15,
        flexDirection: 'row',

    },
    alignleft: {
        backgroundColor: 'grey', alignSelf: 'flex-start', width: 'auto', padding: hp(1.5), marginTop: 20, marginRight: 15, marginLeft: 15, borderBottomLeftRadius: 15, borderBottomRightRadius: 15, borderTopRightRadius: 15,
        flexDirection: 'row',


    },
    alignright1: {
        alignSelf: 'flex-end', width: 'auto', padding: hp(1.2), marginTop: 10, marginRight: 15, marginLeft: 15, borderTopLeftRadius: 15, borderBottomLeftRadius: 15, borderBottomRightRadius: 15,
        flexDirection: 'row',

        backgroundColor: "#338AFF"

    },
    alignleft1: {
        alignSelf: 'flex-start', width: 'auto', padding: hp(1.2), marginTop: 10, marginRight: 15, marginLeft: 15, borderBottomLeftRadius: 15, borderBottomRightRadius: 15, borderTopRightRadius: 15,
        flexDirection: 'row',

        backgroundColor: 'grey',

    }
});
export default Chat;