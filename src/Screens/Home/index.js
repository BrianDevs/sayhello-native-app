import React, { useEffect, useState, useContext } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { View, Text, Image, TouchableOpacity, ImageBackground, Alert, Modal, StyleSheet, Pressable, Share, BackHandler } from 'react-native';
import { StylesGloble } from './../../helper/Globlecss';
import imagePath from './../../constants/imagePath';
import ApiDataService from "./../../services/Apiservice.service";
import LoadingPage from '../../helper/LoadingPage';
import messaging from "@react-native-firebase/messaging";
import AsyncStorage from '@react-native-async-storage/async-storage';
import NotificationModal from '../../helper/NotificationModal';
import { useTranslation } from 'react-i18next';
import './../../Language/i18';
import { useSelector, useDispatch } from 'react-redux';
import { setVideoData} from './../../Redux/index';


const Home = ({ navigation, route, onPress }) => {
    const [applan, setapplan] = useState('')
    const dispatch = useDispatch();
   
    const { t, i18n } = useTranslation();
    useEffect(() => {
        AsyncStorage.getItem('Applang', (err, cr) => {
            i18n.changeLanguage(cr);
            setapplan(cr);
            dispatch(setVideoData('0',cr));
        })
    }, []);
    const [Loading, setLoading] = useState(false);
    const [Notificationpopup, setNotificationpopup] = useState(false);
    const [notificationdata, setnotificationdata] = useState(false);
    const [gethome, setgethome] = useState({});
    const [name, setname] = useState('');
    const [image, setimage] = useState('');
    const [IsLogin, setIslogin] = useState('');
    const [bimage, setbimage] = useState('')
    const [modalVisible, setModalVisible] = useState(false);

    const [lat, setlat] = useState('');
    const [long, setlong] = useState('') 
    
    useEffect(() => {
        AsyncStorage.getItem('userID', (err, cre) => {
            let userID = JSON.parse(cre);
            setLoading(true);
            callapiinthispage(userID)
        })
    }, [])
    const callapiinthispage = (userID) =>{
        AsyncStorage.getItem('Currentlatlng', (err, cre) => {
            let latlng = JSON.parse(cre);
            setlat(latlng.lat);
            setlong(latlng.lng);
            getmatch(userID,latlng.lat,latlng.lng)
        })
    }

    const getmatch = (userID,ulat,ulng) => {
        let url = `matchStangers?id=${userID}&lang=${applan}&lat=${ulat}&lng=${ulng}`;
        console.log('url---matchStangers',url);
        ApiDataService.Getapi(url).then(response => {
            console.log('response--------match',response.data);
        }).catch(e => {
            console.log('e--------match',e);
        })
        .finally(() => {
            // setLoading(false);
        });
    }

    useEffect(() => {
        const backAction = () => {
            navigation.goBack();
            return true;
        };
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );
        return () => backHandler.remove();
    }, [navigation]);
    useEffect(() => {
        setModalVisible(true);
    }, []);

    const notificationclosefunc = () => {
        setNotificationpopup(false)
    }

    useEffect(() => {
        messaging().onMessage(async remoteMessage => {
            setnotificationdata(JSON.parse(remoteMessage.data.message));
            console.log('remoteMessageremoteMessage', remoteMessage);
            setNotificationpopup(true)
        });
    }, [])

    useEffect(() => {
        AsyncStorage.getItem('userID', (err, cre) => {
            let userID = JSON.parse(cre);
            uselogin(userID)
        })
    }, [])
    const uselogin = async (userID) => {
        let url = `userProfile?id=${userID}&lang=${applan}`
        ApiDataService.Getapi(url).then(response => {
            setLoading(false);
            setname(response.data.data.name);
            setimage(response.data.data.image)
        }).catch(e => {
            console.log('111111111',e);
        }).finally(() => {
            setLoading(false);
        });

    }
    useEffect(() => {
        gethomedetail()
    }, [])

   
    const gethomedetail = () => {
        let url = `home`
        ApiDataService.Getapi(url).then(response => {
            setLoading(false);
            if (response.data.status == true) {
                setgethome(response.data);
                setbimage(response.data.Banners.image)

            }
        }).catch(e => {
            console.log('e', e);
        })
            .finally(() => {
                setLoading(false);
            });
    }

    const handleShare = async () => {
        try {
            const result = await Share.share({
                message: t('Check out this amazing app! https://codemeg.com/ Awesome App'),
                url: 'https://codemeg.com/',
                title: 'Awesome App',
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                } else {
                }
            } else if (result.action === Share.dismissedAction) {
            }
        } catch (error) {
        }
    };

    return (
        <View style={{ ...StylesGloble.container, position: "relative", paddingLeft: 15, paddingRight: 15 }}>
            {
                Loading &&
                <View style={{ position: "absolute", top: 0, left: 0, height: "100%", width: "110%", zIndex: 999999 }}>
                    <LoadingPage />
                </View>
            }
            <View style={{ ...StylesGloble.homeheaderouter }}>
                <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ ...StylesGloble.homeheaderprofile, alignSelf: "center" }}>
                    <Image style={{ width: 45, height: 45, borderRadius: 50 }} source={{ uri: image }} />
                </TouchableOpacity>
                <Text style={{ ...StylesGloble.fontsmall, ...StylesGloble.homeheadername, marginLeft: -5, fontWeight: "700", fontSize: 18, top: 13 }}>{name}</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Map', { name: name, image: image })} style={{ ...StylesGloble.homeheaderlocation }}>
                    <Image style={{ width: 25, height: 25 }} source={imagePath.locationicon} />
                </TouchableOpacity>
            </View>
            <ImageBackground style={{ flex: 1, height: ('100%') }} source={{ uri: bimage }}>
                {/* <View style={{ alignItems: "center", justifyContent: "center", marginTop: ('18%') }}>
                    <Text style={{ fontSize: 30, fontWeight: "700", color: "#1E9CDE" }}>$1,000,000</Text>
                    <Text style={{ fontSize: 10, color: "#F7BA00", marginTop: 2 }}>Next Giveaway 1 Million Users</Text>
                </View> */}
            </ImageBackground>
            <ImageBackground resizeMode="cover" style={{ flex: 2, height: ('80%') ,}} source={imagePath.homegif}>
                <View style={{ alignItems: "center", justifyContent: "center", marginTop: hp('18%'), padding: 15 }}>
                    <Text style={{ fontSize: 16, fontWeight: "700", color: "#000000" }}>{t('Countdown')}</Text>
                    <Text style={{ fontSize: 23, fontWeight: "700", color: "#00D9A5", marginTop: 2 }}>
                        {gethome.count_down}
                    </Text>
                </View>
            </ImageBackground>
            <View style={{ ...StylesGloble.homebottom }}>
                <View style={{ ...StylesGloble.bottomsec }}>
                    <Image style={{ width: 25, height: 25 }} source={imagePath.users} />
                    <Text style={{ ...StylesGloble.fontsmall, marginTop: 10, fontWeight: "600" }}>
                        {gethome.total_users}
                    </Text>
                    <Text style={{ ...StylesGloble.fontsmall, marginTop: 0, textAlign: "center" }}>{t('Current users')}</Text>
                </View>
                <TouchableOpacity style={{ ...StylesGloble.bottomsec }} onPress={handleShare}>
                    <Image style={{ width: 25, height: 25 }} source={imagePath.share} />
                    <Text style={{ ...StylesGloble.fontsmall, marginTop: 10, fontWeight: "600" }}>3</Text>
                    <Text style={{ ...StylesGloble.fontsmall, marginTop: 0 }}>{t('Your shares')}</Text>
                </TouchableOpacity>
                <View style={{ ...StylesGloble.bottomsec }} >
                    <Image style={{ width: 25, height: 25 }} source={imagePath.signup} />
                    <Text style={{ ...StylesGloble.fontsmall, marginTop: 10, fontWeight: "600" }}>{gethome.your_signups}</Text>
                    <Text style={{ ...StylesGloble.fontsmall, textAlign: "center" }}>{t('Your signups')}</Text>
                </View>
            </View>
            {
                Notificationpopup &&
                <View style={{ position: "absolute", top: 0, left: 0, height: "100%", width: "100%", zIndex: 999999 }}>
                    <NotificationModal data={notificationdata} notificationclosefunc={notificationclosefunc} navigation={navigation} />

                </View>
            }

        </View>
    );
};
export default Home;
const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});