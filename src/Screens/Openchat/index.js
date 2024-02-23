import React, { useEffect, useState, useContext } from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { View, Text,ImageBackground ,TouchableOpacity,BackHandler,PermissionsAndroid} from 'react-native';
import ButtonField  from './../../helper/ButtonField';
import { StylesGloble } from './../../helper/Globlecss';
import imagePath from './../../constants/imagePath';
import ApiDataService from "./../../services/Apiservice.service";
import Toast from 'react-native-simple-toast';
import LoadingPage from '../../helper/LoadingPage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import './../../Language/i18'
import Geolocation from '@react-native-community/geolocation';

const Openchat = ({ navigation,route }) => {
    const [Loading, setLoading] = useState(false);
    const [image,setimage] = useState('')
    const [s_name, sets_name] = useState('');
    const [userId, setuserId] = useState('');
    const[stranger,setstranger] = useState('');
    const[applan,setapplan] = useState('')
    const [sname,setsname] = useState()
           
    const {t,i18n}=useTranslation();
    useEffect(() => {
        AsyncStorage.getItem('Applang', (err, cr) => {
            i18n.changeLanguage(cr)
            setapplan(cr)
        })
        AsyncStorage.getItem('matchid', (err, cre) => { 
            setstranger(cre)
            console.log(cre,'--------------');
        })
        AsyncStorage.getItem('username', (err, cre) => { 
            console.log(cre,'--------------');
            setsname(cre)
        })
    }, []);
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
    // const storedName = AsyncStorage.getItem('strangername');
    useEffect(async() => {
        AsyncStorage.getItem('userID', (err, cre) => {
            let userID = JSON.parse(cre);
            setLoading(true);
            setuserId(userID)
        })
        AsyncStorage.getItem('strangerID',(err,cre)=>{
            let strangerid = JSON.parse(cre);
            getstrangerdetail(strangerid)

           
        }) 
         const storedStrangerName = await AsyncStorage.getItem('strangername');
              if (storedStrangerName !== null) {
                sets_name(storedStrangerName);
              }
              AsyncStorage.getItem('matchid', (err, cre) => { 
                getstrangerdetail(cre)
                uselogin(cre)
            })
      
    }, [])
    const [lat,setlat]=useState('');
    const [long,setlong] = useState('');
    const [id, setid] = useState('');
    const [name, setname] = useState('')
    const [photooption,setphotooption] = useState('')
    const callapiinthispage = (cre) =>{
        AsyncStorage.getItem('Currentlatlng', (err, cre) => {
            let latlng = JSON.parse(cre);
            setlat(latlng.lat);
            setlong(latlng.lng);
           
          
        })
    }
    

    const getstrangerdetail = (cre) => {
        let url = `showStrangersProfile?stranger_id=${cre}&lang=${applan}`
        ApiDataService.Getapi(url).then(response => {
            setLoading(false);
            if (response.data.status == true) {
                setimage(response.data.data.image);
            }
        }).catch(e => {
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


    useEffect(() => {
        AsyncStorage.getItem('userID', (err, cre) => {
            let userID = JSON.parse(cre);
            setLoading(true);
            
        })
    }, [])

    const uselogin = async (cre) => {
        let url = `userProfile?id=${cre}&lang=${applan}`
        ApiDataService.Getapi(url).then(response => {
            console.log('enfhsmkn cjiwhdfjiwkd=========',response.data);
            setLoading(false);
            setlat(response.data.data.lat);
            setlong(response.data.data.lng);
            setname(response.data.data.name);
            setphotooption(response.data.data.photo_option)


        }).catch(e => {
        console.log('e-',e);

        }).finally(() => {
            setLoading(false);
        });

}

    const submitfun = () =>{
       
        setLoading(true);
        let formdata = {
            "my_id": userId,
            "stranger_id": stranger,
            "lang":applan
        }
        console.log('formmmmmmmmmm-',formdata);
        let url = 'deniedStranger'
        ApiDataService.Postapi(url, formdata).then(response => {
            setLoading(false);
            if (response.status == true) {
               
                    navigation.navigate('Home')
                
            }
        }).catch(e => {
        console.log('w-',e);
            
        });
    }
    const submitfun2 = () =>{
        setLoading(true);
        let formdata = {
            "my_id": userId,
            "stranger_id": stranger,
            "accepted_lat": lat,
            "accepted_lng": long,
            "lang":applan
        }
        console.log('formmmmmmmmmm-',formdata);

        let url = 'acceptStranger'
        ApiDataService.Postapi(url, formdata).then(response => {
        console.log('formmmm',response);
            
            setLoading(false);
            if (response.status == true) {
                    navigation.navigate('Chat',{name:sname,image:image,receiver:stranger,sender:userId,chattype:'1'})
                
            }
        }).catch(e => {
            console.log('w-',e);
        });
    }
    const calltoastmessage = (data) => {
        Toast.showWithGravity(data, Toast.SHORT, Toast.BOTTOM);
    };
    return (
        <View style={{width:wp('100%'),height:hp('100%')}}>
              {
                Loading&&
                <View style={{position:"absolute",top:0,left:0,height:"100%",width:"105%",zIndex:999999}}>
                    <LoadingPage/>
                </View>
            }
              {(photooption == 0)?  <ImageBackground  style={{width: wp('100%'), height: hp('35%')}} source={imagePath.Showprofile_user}>
            </ImageBackground>:  <ImageBackground  style={{width: wp('100%'), height: hp('40%')}} source={{uri:image}}>
            </ImageBackground>}
           
            <View style={{ width:wp('90%'),height:hp('60%'),alignItems:"center",justifyContent:"center",marginTop:-10}}>
                <View style={{ width:wp('100%'),alignItems:"center",justifyContent:"center"}}>
                    <Text style={{...StylesGloble.fontsmall,fontWeight:"400",marginLeft:wp('10%')}}>{t('We would like the open communication with')} </Text>
                    <Text style={{...StylesGloble.fontsmall,fontWeight:"400",marginLeft:wp('10%')}}> {t('you and')} {sname}, {t('Just click the')}</Text>
                    <Text style={{...StylesGloble.fontsmall,fontWeight:"400",marginLeft:wp('10%')}}>
                   {t('button to let us know ')}
                    </Text>
                </View>
                <TouchableOpacity onPress={()=>submitfun2()} >
                <ImageBackground  style={{width: wp('100%'), height: 280,marginTop:5}} source={imagePath.sayhellowithhand}>
                </ImageBackground>
                </TouchableOpacity>
                
                <View style={{width:wp('85%'),marginTop:-10,marginLeft:wp('8%')}}>
                    <ButtonField label={t('Not Right Now')} submitfun={submitfun}/>
                </View>
            </View>
        </View>
    );
};
export default Openchat;