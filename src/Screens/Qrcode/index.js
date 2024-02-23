import React, {useEffect,useState} from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { View, Text,Image, TouchableOpacity,BackHandler } from 'react-native';
import ButtonField  from './../../helper/ButtonField';
import { StylesGloble } from './../../helper/Globlecss';
import imagePath from './../../constants/imagePath';
import ApiDataService from "./../../services/Apiservice.service";
import LoadingPage from '../../helper/LoadingPage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import './../../Language/i18'


const Qrcode = ({ navigation,route }) => {
    const [Loading, setLoading] = useState(false);
    const [qrcode,setqrcode] = useState('');
    const strangername = route.params.name;
    const id= route.params.matchuser_id
    const[applan,setapplan] = useState('')
    
    const {t,i18n}=useTranslation();
    useEffect(() => {
        AsyncStorage.getItem('Applang', (err, cr) => {
            i18n.changeLanguage(cr)
            setapplan(cr)
        })
    }, []);
    useEffect(() => {
        const backAction = () => {
          navigation.navigate('Showprofile');
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
            uselogin(userID)
        })
    }, [])
    const uselogin = async (userID) => {
                let url = `userProfile?id=${userID}&lang=${applan}`
                ApiDataService.Getapi(url).then(response => {
                    setLoading(false);
                    setqrcode(response.data.data.qrcode)
                }).catch(e => {
                }).finally(() => {
                    setLoading(false);
                });

    }

    const submitfun = () =>{
        navigation.navigate('Takeselfi',{id:id})
    }
    return (
        <>
            <View style={{...StylesGloble.container,...StylesGloble.ScreenHorigental}}>
            {
                Loading&&
                <View style={{position:"absolute",top:0,left:0,height:"100%",width:"115%",zIndex:999999}}>
                    <LoadingPage/>
                </View>
            }
                <View style={{...StylesGloble.widthheight100,marginTop:150,}}>
                    <Image  style={{ width: '80%', height: 250}} source={{uri: qrcode}} />
                </View>
                <View style={{...StylesGloble.centerclass}}>
                    <Text style={{...StylesGloble.fontsmall,alignItems:"center",marginTop:30,textAlign:"center",fontWeight:"500"}}>{t('Scan')} {strangername} {t('’s code and complete the connection')}</Text>
                </View>
                <View style={{ width:wp('88%'),height:hp('8%'),position:"relative",marginTop:'30%'}}>
                    <TouchableOpacity style={{position:"absolute",top:20,alignSelf:"center",}} onPress={()=>{ navigation.navigate('ScanQr',{id:id})}} >
                        <Image  style={{ width: 80, height: 80}} source={imagePath.sceneer} />
                    </TouchableOpacity>
                </View>
                <View style={{marginTop:80}}>
                    <ButtonField label={t('Next')} submitfun={submitfun}/>
                </View>
            </View>
        </>
    );
};
export default Qrcode;