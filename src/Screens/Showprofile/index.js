import React, { useEffect, useState, useContext } from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { View, Text, ScrollView,Image, TouchableOpacity,ImageBackground,BackHandler } from 'react-native';
import ButtonField  from './../../helper/ButtonField';
import { StylesGloble } from './../../helper/Globlecss';
import imagePath from './../../constants/imagePath';
import ApiDataService from "./../../services/Apiservice.service";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import './../../Language/i18'

const Showprofile = ({ navigation,route})=> {
  console.log('route------------------',route.params);
    const r_id= route?.params?.r_id
    const u_id = route?.params?.userId


    AsyncStorage.setItem('matchid', ''+r_id);
    const [Loading, setLoading] = useState(false);
    const [data,setdata] = useState({});
    const [strangername, setstrangername] = useState('');
    const [name,setname]= useState('')
    const [photooption,setphotooption] = useState('')

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

    useEffect(()=>{
        getstrangerdetail()
        uselogin()
    },[])
    const uselogin = async () => {
        let url = `userProfile?id=${r_id}&lang=${applan}`
        ApiDataService.Getapi(url).then(response => {
            console.log('enfhsmkn cjiwhdfjiwkd=========',response.data);
            setLoading(false);
            setname(response.data.data.name)
    AsyncStorage.setItem('username', ''+response.data.data.name);

            setphotooption(response.data.data.photo_option)

        }).catch(e => {
        console.log('e-',e);

        }).finally(() => {
            setLoading(false);
        });

}

    const getstrangerdetail = () => {
        let url = `showStrangersProfile?stranger_id=${r_id}&lang=${applan}`
        ApiDataService.Getapi(url).then(response => {
            console.log("showStrangersProfile?",response.data)
            setLoading(false);
            if (response.data.status == true) {
                setdata(response.data.data);
                setstrangername(response.data.data.username)
            }
        }).catch(e => {
        })
            .finally(() => {
                setLoading(false);
            });
    }

    const submitfun = () =>{
        navigation.navigate('Qrcode',{name:strangername,matchuser_id:r_id})
    }
    const[applan,setapplan] = useState('')
           
    const {t,i18n}=useTranslation();
    useEffect(() => {
        AsyncStorage.getItem('Applang', (err, cr) => {
            i18n.changeLanguage(cr)
            setapplan(cr)
        })
    }, []);
    return (
        <View style={{width:wp('100%'),height:hp('100%')}}>
              {
                Loading&&
                <View style={{position:"absolute",top:0,left:0,height:"100%",width:"115%",zIndex:999999}}>
                    <LoadingPage/>
                </View>
            }
            {(photooption == 0)? <ImageBackground  style={{flex: 1,width: wp('100%'), height: ('100%')}} source={imagePath.Showprofile_user}>
            </ImageBackground>: <ImageBackground  style={{flex: 1,width: wp('100%'), height: ('100%')}} source={{uri: data.image}}>
            </ImageBackground>}
           
            <View style={{ width:wp('100%'),height:hp('60%'),padding:wp('5%')}}>
                <ScrollView contentContainerStyle={{ flexGrow: 1,paddingBottom:50 }} >
                    <Text style={{...StylesGloble.fontmedium,fontSize:25}}>{name}</Text>
                    <Text style={{...StylesGloble.fontlargesmall,marginTop:15}}>
                        {data.about_me}
                        </Text>
                    <Text style={{...StylesGloble.fontsmall,marginTop:15}}>{t('Your matches')}</Text>
                    <View style={{...StylesGloble.oneline,marginTop:15}}>
                        <Image  style={{ width: 25, height: 25}} source={imagePath.smoking} />
                        {(data.smoking==1)?(<Text style={{...StylesGloble.fontlargesmall,marginLeft:20,marginTop:10}}>{t('Yes')}</Text>):(<Text style={{...StylesGloble.fontlargesmall,marginLeft:20,marginTop:10}}>{t('No')}</Text>)}
                        
                    </View>
                    <View style={{...StylesGloble.oneline,marginTop:15}}>
                        <Image  style={{ width: 25, height: 25}} source={imagePath.alcohol} />

                        {(data.alcohol==1)?(
                            <Text style={{...StylesGloble.fontlargesmall,marginLeft:20,marginTop:10}}>{t('Yes')}</Text>
                        ):(<Text style={{...StylesGloble.fontlargesmall,marginLeft:20,marginTop:10}}>{t('No')}</Text>)}
                    </View>
                    <View style={{...StylesGloble.oneline,marginTop:15}}>
                        <Image  style={{ width: 25, height: 25}} source={imagePath.pets} />
                        <Text style={{...StylesGloble.fontlargesmall,marginLeft:20,marginTop:7}}>{data.pet_name}</Text>
                    </View>
                    <View style={{ width:wp('80%'),height:hp('8%'),position:"relative"}}>
                        <TouchableOpacity style={{position:"absolute",top:20,left:wp('20%')}}  onPress={()=>navigation.navigate('ScanQr',{matchuser_id:r_id})}>
                            <Image  style={{ width: 80, height: 80}} source={imagePath.sceneer} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{position:"absolute",top:20,left:wp('50%')}} onPress={()=>navigation.navigate('TempChat',{name:name,image:data.image,chattype:'0',receiver:r_id,sender:u_id })}>
                            <Image  style={{ width: 80, height: 80}} source={imagePath.chat} />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <View style={{marginTop:0}}>
                    <ButtonField label={t('Next')} submitfun={submitfun}/>
                </View>
            </View>
        </View>
    );
};
export default Showprofile;