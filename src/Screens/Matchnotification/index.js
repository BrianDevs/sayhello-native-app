//import liraries
import React, { useEffect, useState, useContext } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { View, Text, Image, ImageBackground, TouchableOpacity, BackHandler,PermissionsAndroid } from 'react-native';
import WhiteButtonField from './../../helper/WhiteButtonField';
import { StylesGloble } from './../../helper/Globlecss';
import imagePath from './../../constants/imagePath';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiDataService from "./../../services/Apiservice.service";
import Toast from 'react-native-simple-toast';
import LoadingPage from '../../helper/LoadingPage';
import { useTranslation } from 'react-i18next';
import './../../Language/i18'
import Geolocation from '@react-native-community/geolocation';


const Matchnotification = ({ navigation, route }) => {

    const { t, i18n } = useTranslation();
    useEffect(() => {
        AsyncStorage.getItem('Applang', (err, cr) => {
            i18n.changeLanguage(cr)
            setapplan(cr);
        })
    }, []);

    const [applan, setapplan] = useState('')
    const [Loading, setLoading] = useState(false);
    const [matchId, setmatchId] = useState('');
    const [userId, setuserId] = useState('');
    const [matchtype, setmatchtype] = useState(0);
    const [backimagepath, setbackimagepath] = useState(imagePath.fullscreen);
   
    const [lat, setlat] = useState('');
    const [long, setlong] = useState('')
    const uselogin = async (userID) => {
        let url = `userProfile?id=${userID}`
        ApiDataService.Getapi(url).then(response => {
            console.log('response---------------mappp',response.data.data);
         
        }).catch(e => {
            console.log('eeeeeee---------------mappp',e);

        }).finally(() => {
            setLoading(false);
        });

    }

    useEffect(() => {
        console.log('i am in match notification page');
        AsyncStorage.getItem('matchPercentage', (err, cr) => {
          
            if (cr <= 50 && cr >= 25) {
                setmatchtype(1)
                setbackimagepath(imagePath.fullscreen)
            }
            else if (cr > 50 && cr <= 75) {
                setmatchtype(2)
                setbackimagepath(imagePath.fullscreen1)
            }
            else if (cr > 75) {
                setmatchtype(3)
                setbackimagepath(imagePath.fullscreen2)
            }
            else {
                setmatchtype(0)
                setbackimagepath(imagePath.fullscreen)
            }
        })
        AsyncStorage.getItem('matchid', (err, cre) => {
            setmatchId(cre);  
        })
    }, []);

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
            setuserId(userID)
            uselogin(userID)
        })
    }, [])

    const callapiinthispage = () =>{
        AsyncStorage.getItem('Currentlatlng', (err, cre) => {
            let latlng = JSON.parse(cre);
            setlat(latlng.lat);
            setlong(latlng.lng);
            getmatch(latlng.lat,latlng.lng)
          
        })
    }

    const getmatch = (ulat,ulng) => {
        let url = `matchStangers?id=${userId}&lang=${applan}&lat=${ulat}&lng=${ulng}`;
        console.log('url---matchStangers---------------',url);
        ApiDataService.Getapi(url).then(response => {
            console.log('response------222222222222222222222--',response.data);
            if(response.data.status==true){
            
            }else{
                navigation.navigate('Home')
            }
        }).catch(e => {
            console.log('e--------match',e);
        })
        .finally(() => {
            setLoading(false);
        });
    }

    useEffect(() =>  {
        usecurrentlatlng();
    },[])
    
    const usecurrentlatlng = async () =>{
        if (Platform.OS === 'ios') {
            getOneTimeLocation();
        } else {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Access Required',
                        message: 'This App needs to Access your location',
                    },
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    getOneTimeLocation();
                }
            } catch (err) {
                console.warn(err);
            }
        }
    }

    const getOneTimeLocation = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                setlat(position.coords.latitude);
                setlong(position.coords.longitude);
                let dataload = {
                    lat : position.coords.latitude,
                    lng: position.coords.longitude
                }
                AsyncStorage.setItem('Currentlatlng',JSON.stringify(dataload));
            },
            (error) => {
                getOneTimeLocation();
            },
           
        );
    };

    const submitfun = () => {
        
        let formdata = {
            my_id: userId,
            stranger_id: matchId,
            accepted_lat: lat,
            accepted_lng: long,
        };
        console.log('form-----------',formdata);
        let url = 'acceptStranger';
        setLoading(true);
        ApiDataService.Postapi(url, formdata)
            .then(response => {
                setLoading(false);
                if (response.status == true) {
                    AsyncStorage.setItem('coupleid', '' + response.data.id);
                    navigation.navigate('Showprofile', { name: '', r_id: matchId ,userId:userId});
                }
            })
            .catch(error => {
                console.log('error-----------',error);

            });
    };
    const submitfun2 = () => {
        setLoading(true);
        let formdata = {
            "my_id": userId,
            "stranger_id": matchId,
        }
        let url = 'deniedStranger';
        ApiDataService.Postapi(url, formdata).then(response => {
            console.log('response-------------',response);
            setLoading(false);
            if (response.status == true) {
                navigation.navigate('Home');
                    callapiinthispage()
                
            }
        }).catch(e => {
        });
    }
    return (
        <View style={{ width: '100%', height: '100%' }}>
            {
                Loading &&
                <View style={{ position: "absolute", top: 0, left: 0, height: "100%", width: "105%", zIndex: 999999 }}>
                    <LoadingPage />
                </View>
            }
            <ImageBackground style={{ width: '100%', height: '100%' }} source={backimagepath} >

                <View style={{ ...StylesGloble.ScreenHorigental, marginTop: 25 }}>
                    {
                        (matchtype == 1) ? (
                            <View>
                                <Text style={{ ...StylesGloble.fontmedium, color: "#FFFFFF", fontSize: 25 }}>{t('I’ve got some good news!!!')}</Text>
                                <Text style={{ ...StylesGloble.fontsmall, color: "#FFFFFF", marginTop: 25 }}>
                                    {t(' Someone is close, and I think we should say Hello, you know so we can get the extra entries when the prize, retire and have lots of little programs, hey!!! A program can dream too. Now hit that wave button and lets get to the beach, maybe with her ||||')}</Text>

                                <View>
                                    <Text style={{ ...StylesGloble.fontmedium, color: "#FFFFFF", marginTop: 25, fontSize: 25 }}>{t('25% to 50% Match')}</Text>
                                </View>

                            </View>
                        ) : (matchtype == 2) ? (
                            <View>
                                <Text style={{ ...StylesGloble.fontmedium, color: "#FFFFFF", fontSize: 25 }}>{t('Hi there! Its’s me again.')}</Text>
                                <Text style={{ ...StylesGloble.fontsmall, color: "#FFFFFF", marginTop: 25 }}>{t('Someone is close, and might want to say hello he’s not your perfect match but he is pretty great guy if you don’t take this chance I am going to send a message to everyone close that you are CHICKEN.It’s just HELLO and you never know, and don’t forget those sweet 100 bonus entries. common and take a chance!!!!! Its time to :')}</Text>

                                <View>
                                    <Text style={{ ...StylesGloble.fontmedium, color: "#FFFFFF", marginTop: 25, fontSize: 25 }}>{t('51% to 75% Match')}</Text>
                                </View>

                            </View>
                        ) : (matchtype == 3) ? (
                            <View>
                                <Text style={{ ...StylesGloble.fontmedium, color: "#FFFFFF", fontSize: 25 }}>{t('Hey guess what !')}</Text>
                                <Text style={{ ...StylesGloble.fontsmall, color: "#FFFFFF", marginTop: 25 }}>
                                    {t('looks like someone is close and might want to say  hello and they are a match!!! Alright no excuses hit the wave button already!!! I haven’t seen my cousin since we left the download cue. We will catch up and give you some privacy. Let’s Get those 100 new entries for the next giveaway.')}</Text>

                                <View>
                                    <Text style={{ ...StylesGloble.fontmedium, color: "#FFFFFF", marginTop: 25, fontSize: 25 }}>{t('76% to 100% Match')}</Text>
                                </View>

                            </View>
                        ) : (<View>
                            <Text style={{ ...StylesGloble.fontmedium, color: "#FFFFFF", fontSize: 25 }}>{t('I’ve got some good news!!!')}</Text>
                            <Text style={{ ...StylesGloble.fontsmall, color: "#FFFFFF", marginTop: 25 }}>{t('Someone is close, and I think we should say Hello, you know so we can get the extra entries when the prize, retire and have lots of little programs, hey!!! A program can dream too. Now hit that wave button and lets get to the beach, maybe with her ||||')}
                            </Text>
                            <View>
                                <Text style={{ ...StylesGloble.fontmedium, color: "#FFFFFF", marginTop: 25, fontSize: 25 }}>{t('20% to 50% Match')}</Text>
                            </View>

                        </View>)
                    }
                    <TouchableOpacity style={{ ...StylesGloble.widthheight100, marginTop: '20%', left: -15 }} onPress={() => submitfun()}>
                        <Image style={{ width: 300, height: 200 }} source={imagePath.sayhello} />
                    </TouchableOpacity>
                    <View style={{ marginTop: 0 }}>
                        <WhiteButtonField label={t('Not Right Now')} submitfun={submitfun2} />
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
};
export default Matchnotification;