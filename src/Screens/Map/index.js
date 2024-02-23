//import liraries
import React, { useEffect,useState } from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Geolocation from '@react-native-community/geolocation';
import { PermissionsAndroid,Platform,View, Text, Image, TouchableOpacity,BackHandler } from 'react-native';
import ApiDataService from "./../../services/Apiservice.service";
import LoadingPage from '../../helper/LoadingPage';
import { StylesGloble } from './../../helper/Globlecss';
import imagePath from './../../constants/imagePath';
import  Mapcomponent  from './../../helper/Mapcomponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import './../../Language/i18'

const Map = ({ navigation,route }) => {
    const[applan,setapplan] = useState('')
    const [lat, setlat] = useState('');
    const [long, setlong] = useState('')
    const [Loading, setLoading] = useState(false);
    const [flag,setflag] = useState([]);
    const [userID,setuserId] =  useState('')

    const {t,i18n}=useTranslation();

    useEffect(() => {
        AsyncStorage.getItem('Applang', (err, cr) => {
            i18n.changeLanguage(cr)
            setapplan(cr)
        })
    }, []);

    const User_name= route?.params?.name;
    const User_image= route?.params?.image

    useEffect(() => {
        AsyncStorage.getItem('userID', (err, cre) => {
            let userID = JSON.parse(cre);
            setLoading(true);
            setuserId(userID)
            callapiinthispage(userID)
        })
    }, [])
    const callapiinthispage = (userID) =>{
        AsyncStorage.getItem('Currentlatlng', (err, cre) => {
            let latlng = JSON.parse(cre);
            setlat(latlng.lat);
            setlong(latlng.lng);
            // getmatch(userID,latlng.lat,latlng.lng)
            getflag(userID,latlng.lat,latlng.lng)
          
        })
    }

    // const getmatch = (userID,ulat,ulng) => {
    //     let url = `matchStangers?id=${userID}&lang=${applan}&lat=${ulat}&lng=${ulng}`;
    //     console.log('url---matchStangers',url);
    //     ApiDataService.Getapi(url).then(response => {
    //         console.log('response--------match',response.data);
    //     }).catch(e => {
    //         console.log('e--------match',e);
    //     })
    //     .finally(() => {
    //         setLoading(false);
    //     });
    // }

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
   
    const getflag = (userID,ulat,ulng) => {
        let url = `nearByCouples?id=${userID}&lang=${applan}&lat=${ulat}&lng=${ulng}`;
        console.log("flag",url)
        ApiDataService.Getapi(url).then(response => {
            console.log('flage....',response.data);
          
            setLoading(false);
            if (response.data.status == true) {
                setflag(response.data.data)
            }
        }).catch(e => {
        }).finally(() => {
            setLoading(false);
        });
    }

    return (
        <View style={{width:wp('100%'),height:hp('100%'),position:"relative"}}>
            {
                Loading&&
                <View style={{position:"absolute",top:0,left:0,height:"100%",width:"115%",zIndex:999999}}>
                    <LoadingPage/>
                </View>
            }
            <TouchableOpacity onPress={() => navigation.navigate('Home')} style={{...StylesGloble.homeheaderlocation,left:wp('5%'),zIndex:999,marginTop:10}}>
                <Image  style={{ width: 27.43, height: 24}} source={imagePath.backPage} />
            </TouchableOpacity>
            <TouchableOpacity style={{...StylesGloble.homeheaderprofile,left:wp('14%'),zIndex:999,marginTop:15}}>
                <Image  style={{ width: 45, height: 45, borderRadius: 50}} source={{ uri: User_image }} />
            </TouchableOpacity>
            <Text style={{...StylesGloble.fontsmall,...StylesGloble.homeheadername,zIndex:999,marginTop:10,fontWeight:"700",left:100}}>{User_name}</Text>
            {
                (long > 0)&&
                <Mapcomponent style={{width:wp('100%'),height:hp('100%')}} data={flag} currentLatitude={lat} currentLongitude={long}/>
            }
        </View>
    );
};
export default Map;