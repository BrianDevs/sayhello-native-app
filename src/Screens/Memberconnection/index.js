import React, { Component, useState, useEffect, useCallback } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Button, BackHandler, ImageBackground, Modal, Pressable } from 'react-native';
import { StylesGloble } from './../../helper/Globlecss';
import imagePath from './../../constants/imagePath';
import ApiDataService from "./../../services/Apiservice.service";
import LoadingPage from '../../helper/LoadingPage';
import YoutubePlayer from 'react-native-youtube-iframe';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { setVideoData} from './../../Redux/index';
import './../../Language/i18'

const Memberconnection = ({ navigation, route }) => {
    const idc=route?.params?.coupleid
    const couple_id=route?.params?.id
    const dispatch = useDispatch();
    const videolistre = useSelector((state) => state.VideoReducer.data);

    const [userId, setuserId] = useState(false);
    const [addpopup, setaddpopup] = useState(false);
    const [Loading, setLoading] = useState(false);
    const [playing, setPlaying] = useState(false);
    const [youtubeurl, setyoutubeurl] = useState();
    console.log('url-----',youtubeurl);
    const [modalVisible, setModalVisible] = useState(false);
    const [mainurl, setmainurl] = useState('')
    const [filter, setFilter] = useState(0);
   
const [cid,setcid]=useState('')
    const[applan,setapplan] = useState('');
           
    const {t,i18n}=useTranslation();


    useEffect(() => {
        AsyncStorage.getItem('Applang', (err, cr) => {
            i18n.changeLanguage(cr)
            setapplan(cr)
        })
        AsyncStorage.getItem('userID', (err, credentials) => {
            let  ID =  JSON.parse(credentials);
            setuserId(ID)
        });
        AsyncStorage.getItem('coupleid', (err, cr) => {
            console.log('coupleidcoupleidcoupleid', cr);
            setcid(cr)
        })
        getyoutubelist()
    }, []);
   
    useEffect(() => {
        const backAction = () => {
            navigation.navigate('Home')

            return true;
        };
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );
        return () => backHandler.remove();
    }, [navigation]);
    const onStateChange = useCallback((state) => {
        if (state === "ended") {
            setPlaying(false);
            Alert.alert("video has finished playing!");
        }
    }, []);

    const togglePlaying = () => {
        setPlaying((prev) => !prev);
    }

    useEffect(() => {
        console.log("sdfsdfsdfsdf");
        setyoutubeurl(videolistre)
    }, [videolistre])

    const getyoutubelist = (ty,cr) => {
        let url = 'getCoupleData?lang='+applan+'&couple_id='+cid+'&filter='+ty;
        console.log('response========',url);
        ApiDataService.Getapi(url).then(response => {
            console.log('resp',response.data.data);
            setLoading(false);
            if (response.data.status == true) {
                let allyoutubeurl = response.data.data[0].youtube_link;
                let newdata = allyoutubeurl.map(element => {
                    let checkurl = Number(element.search('v='));
                    if(checkurl == -1)
                    {
                        var onetype = element;
                        var sval = Number(onetype.search('.be/')) + 4;
                        var cval = onetype.search('&');
                        var value = '';
                        if (cval > sval) {
                            value = onetype.substring(sval, cval);
                        }
                        else {
                            value = onetype.substring(sval, onetype.length);
                        }
                        return value;
                    }
                    else{
                        let sval = Number(element.search('v=')) + 2;
                        let cval = element.search('&');
                        var value = '';
                        if (cval > sval) {
                            value = element.substring(sval, cval);
                        }
                        else {
                            value = element.substring(sval, element.length);
                        }
                        return value;
                    }
                });
                setyoutubeurl(newdata);
            }
            else{
                setyoutubeurl('');
            }

        }).catch(e => {
        })
            .finally(() => {
                setLoading(false);
            });
    }

    const muteVideo = () => setMute(!isMute);

    const openurlplease = (url) => {
        setmainurl(url)
        setModalVisible(true)
    }
    
    const popupvalue=(ty)=>{
        setFilter(ty);
        setaddpopup(false);
        getyoutubelist(ty);
       // dispatch(setVideoData(ty,applan));
    }
    

    return (
        <View style={{ ...StylesGloble.container, paddingHorizontal: 10 }}>
            {
                Loading &&
                <View style={{ position: "absolute", top: 0, left: 0, height: "100%", width: "100%", zIndex: 999999 }}>
                    <LoadingPage />
                </View>
            }
            <View style={{ ...StylesGloble.oneline, width: "100%", marginTop: 20 }}>
                <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity onPress={() => navigation.navigate('Home')} style={{ ...StylesGloble.homeheaderlocation, left: wp('1%'), top: 0, zIndex: 999 }}>
                        <Image style={{ width: 20, height: 20 }} source={imagePath.backPage} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 18, fontWeight: "700", color: "#000000", ...StylesGloble.startposition, marginLeft: 45, marginTop: -5 }}>{t('Members connection')}</Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('Addvideo',{couple_id:couple_id})} style={{ ...StylesGloble.endposition, marginLeft: -70 }}>
                    <Image style={{ width: 18, height: 18, ...StylesGloble.endposition }} source={imagePath.makevideo} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setaddpopup(true)} style={{ ...StylesGloble.endposition, marginLeft: 30 }} >
                    <Image style={{ width: 18, height: 18 }} source={imagePath.openfilter} />
                </TouchableOpacity>
            </View>
            <View style={{ marginTop: 20 }}>
                <ScrollView style={{ marginBottom: 30 }} showsVerticalScrollIndicator={false}>

                    {
                        youtubeurl &&
                        youtubeurl.map((item, index) => {
                            return (
                                <Pressable key={index} onPress={() => openurlplease(item)} style={{ ...StylesGloble.oneline, marginBottom: 15 }} >
                                    <View style={{ backgroundColor: "black", height: 160, width: '100%', borderRadius: 5, justifyContent: "center", alignSelf: "center", alignItems: "center" }}>
                                        <ImageBackground style={{ height: 40, width: 40 }} source={imagePath.youtube}>

                                        </ImageBackground>
                                    </View>
                                </Pressable>
                            )
                        })
                    }
                </ScrollView>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <Pressable style={{ position: 'absolute', bottom: 0, width: '100%', height: "100%", backgroundColor: "#1c191938" }} onPress={() => {
                    setModalVisible(false)
                }}>
                    <View></View>
                </Pressable>
                <View style={{ height: '100%', width: "99%", backgroundColor: 'black', alignSelf: "center", }}>
                    <Pressable onPress={() => {
                        setModalVisible(false)
                    }}>
                        <Image source={imagePath.Close} style={{ height: 15, width: 15, margin: 20, marginBottom: 210, }} />
                    </Pressable>

                    <View style={{}}>
                        <YoutubePlayer
                            height={200}
                            width={353}
                            play={playing}
                            videoId={mainurl}
                            onChangeState={onStateChange}
                        />
                    </View>

                </View>

            </Modal>
            <Modal animationType="slide" transparent={true} visible={addpopup}>
                <TouchableOpacity style={{ position: 'absolute', bottom: 0, width: '100%', height: "100%", backgroundColor: "#1c191938" }} onPress={() => {
                    setaddpopup(false);
                }}>
                    <View>
                    </View>
                </TouchableOpacity>
                <View style={{ position: "absolute", top: 20, right: 10, width: 150, height: 135, backgroundColor: '#ffffff', borderRadius: 6 }}>
                    <TouchableOpacity style={{ padding: 20, borderBottomColor: "#b3acac38", borderBottomWidth: 1 }} onPress={() =>popupvalue('1')} >
                        <Text style={{ fontSize: 18, fontWeight: "400", color: "#000000", }}>{t('My videos')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ padding: 20 }} onPress={() => popupvalue('0')} >
                        <Text style={{ fontSize: 18, fontWeight: "400", color: "#000000", }}>{t('Others videos')}</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};
export default Memberconnection;