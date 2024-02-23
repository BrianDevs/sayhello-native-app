//import liraries
import React, { useEffect, useState } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { View, Text, ScrollView, Image, TouchableOpacity, BackHandler } from 'react-native';
import { StylesGloble } from '../../helper/Globlecss';
import imagePath from '../../constants/imagePath';
import ApiDataService from "./../../services/Apiservice.service";
import LoadingPage from '../../helper/LoadingPage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import './../../Language/i18';
import Toast from 'react-native-simple-toast';


const Chatlist = ({ navigation, route }) => {
    const [applan, setapplan] = useState('')

    const { t, i18n } = useTranslation();

    useEffect(() => {
        AsyncStorage.getItem('Applang', (err, cr) => {
            i18n.changeLanguage(cr)
            setapplan(cr)
        })
    }, []);
    const calltoastmessage = (data) => {
        Toast.showWithGravity(data, Toast.SHORT, Toast.BOTTOM);
    };
    const [Loading, setLoading] = useState(false);
    const [chatlist, setchatlist] = useState([])

    useEffect(() => {
        const backAction = () => {
            navigation.navigate('Home');
            return true;
        };
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );
        return () => backHandler.remove();
    }, [navigation]);
    useEffect(() => {
        AsyncStorage.getItem('userID', (err, cre) => {
            let userID = JSON.parse(cre);
            setLoading(true);
            getchatlist(userID)
        })

    }, [])
    const getchatlist = (userID) => {
        let url = `chatList?id=${userID}&lang=${applan}`
        // let url = `chatList?id=7&lang=${applan}`
        console.log(url);
        ApiDataService.Getapi(url).then(response => {
            setLoading(false);
            console.log("============response.data=======", response.data)
            if (response.data.status == true) {
                setchatlist(response.data.data)
            }else{
                calltoastmessage("No user");
            }
        }).catch(e => {
            setLoading(false);
        })
    }
    const gotogotochatlist = (image, name, receiver, sender, room,photo_option) => {
        navigation.navigate('Chat', { image: image, name: name, receiver: receiver, sender: sender, room: room, chattype: '1',photo_option:photo_option })
    }
    return (
        <>
            <View style={{ ...StylesGloble.container, ...StylesGloble.ScreenHorigental, position: "relative" }}>
                <View style={{ ...StylesGloble.oneline, width: "100%", marginTop: 10 }}>
                    <TouchableOpacity onPress={() => navigation.navigate('Home')} style={{}}>
                        <Image style={{ width: 21.43, height: 18,marginTop:15}} source={imagePath.backPage} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 18, fontWeight: "700", color: "#000000", ...StylesGloble.startposition, marginLeft: 10, marginTop: 10 }}>{t("Chats")}</Text>
                </View>
                <View style={{ marginTop: 20, height: hp('100%') }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {
                            chatlist.map((item, index) => {
                                return <TouchableOpacity key={index} onPress={() => { gotogotochatlist(item.image, item.name, item.receiver_id, item.sender_id, item.room_id,item.photo_option) }} style={{ ...StylesGloble.oneline, marginBottom: 20, flexDirection: "row",borderBottomWidth:0.5, paddingBottom:10,borderBottomColor:"lightgrey"}}>
                                    <View style={{ width: '20%', }}>
                                        {(item.photo_option==0) ? <Image style={{ width: 51, height: 51, borderRadius: 50 }} source={imagePath.user_chat }/> :<Image style={{ width: 51, height: 51, borderRadius: 50 }} source={{ uri: item.image }} />}
                                        
                                    </View>
                                    <View style={{ width: '70%' }}>
                                        <Text style={{ fontSize: 15, fontWeight: "600", color: "#000000", marginLeft: -5, marginTop: 10 }}>{item.name}</Text>
                                        <Text style={{ fontSize: 12, fontWeight: "400", color: "#888888", marginLeft: -5, marginTop: 1 }} numberOfLines={1}>{item.message}</Text>
                                    </View>
                                    {
                                        (item.unread_messages == 0) ? null :
                                        (<View style={{ marginTop: 5 ,marginLeft:-20,backgroundColor:"#338AFF",height:20,width:20,alignSelf:"center",borderRadius:20}}>
                                        <Text style={{ fontSize: 10, fontWeight: "400", color: "white",textAlign:"center",alignSelf:"center",marginTop:3}}>{item.unread_messages}</Text>
                                    </View>)
                                    }
                                    
                                </TouchableOpacity>
                            })
                        }
                    </ScrollView>
                </View>
            </View>
        </>
    );
};
export default Chatlist;