import React, { useEffect, useState, useContext } from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { View, Text,Image, TouchableOpacity,ImageBackground } from 'react-native';
import ButtonField  from './../../helper/ButtonField';
import imagePath from './../../constants/imagePath';
import Uploadimage  from './../../helper/Uploadimage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiDataService from "./../../services/Apiservice.service";
import LoadingPage  from './../../helper/LoadingPage';
import Toast from 'react-native-simple-toast';
import { useTranslation } from 'react-i18next';
import './../../Language/i18'


const Uploadfacelicence = ({ navigation,route }) => {

    const[applan,setapplan] = useState('')
            
    const {t,i18n}=useTranslation();
    useEffect(() => {
        AsyncStorage.getItem('Applang', (err, cr) => {
            i18n.changeLanguage(cr)
            setapplan(cr)
        })
    }, []);
    const [Loading,setLoading ]= useState(false);
    const [ facephoto,setfacephoto ] = useState('');
    const [ userId,setuserId ] = useState('');
    const [imagebox, setimagebox] = useState(false);

    useEffect(()=>{
        AsyncStorage.getItem('userID', (err, cre) => {
            let  userID =  JSON.parse(cre);
            setuserId(userID);
        })
    },[])

    const submitfun = () =>{
       
            if (facephoto == '') {
                calltoastmessage(t("Please upload your image"));
            } else  {
                
                navigation.navigate('Verified',{pagetype:2})
            }     
    }
    const closeimagepopup = (type,data) =>{
        if(type==1)
        {
            setimagebox(false);
        }
        else
        {
            setimagebox(false);
            addimagelist(data);
        }
    }
    const addimagelist = (source) => {
            setLoading(true);
            const data = new FormData();
            data.append('id',  userId);
            data.append('page',  '4');
            data.append('lang', applan);


            data.append('photo',  { name: 'camera-picture', type: 'image/jpeg', uri:source.path  });
            ApiDataService.Uploadapi('updateUserDocsImageAndProfileImage',data).then(response => {
                setLoading(false);
                if(response.data.status==true)
                {
                    setfacephoto(response.data.data.image);
                    // navigation.navigate('Verified',{pagetype:2})
                }
            }).catch(e => {
                setLoading(false);
            });
    }
    const calltoastmessage  = (data) => {
        Toast.showWithGravity(data, Toast.SHORT, Toast.BOTTOM);
    };
    return (
        <View style={{width: wp('100%'), height: hp('100%'),position:"relative"}}>
            {
                Loading&&
                <View style={{position:"absolute",top:0,left:0,height:"100%",width:"100%",zIndex:999999}}>
                    <LoadingPage/>
                </View>
            }
            {/* <ImageBackground imageStyle={{ borderRadius: 6}} style={{width: wp('100%'), height: ('100%')}} source={imagePath.imageCropback}> */}
                <View style={{width:wp('100%'),position:"absolute",top:60,left:0,alignItems:"center",justifyContent:"center"}}>
                    <Text style={{fontSize:22,fontWeight:"700",color:"#000000"}}>{t('Face liveness')}</Text>
                    <Text style={{fontSize:16,fontWeight:"400",color:"#000000"}}>Lorem ipsum dolor sit amet consectetur</Text>
                    <Text style={{fontSize:16,fontWeight:"400",color:"#000000"}}>adipiscing elit, sed do</Text>
                </View>
                {/* <View style={{width:wp('100%'),height:350,position:"absolute",top:160,left:0,alignItems:"center",justifyContent:"center"}}> */}
                <ImageBackground style={{ width: "93%", height: 340,top: 185,margin:20,position: "absolute",  }} source={imagePath.Blue_box_two}>
                    {
                        facephoto&&
                        <ImageBackground  imageStyle={{ borderRadius:230,borderColor:"#338AFF",borderWidth:5}} style={{width: "97%", height: 310 ,margin:0}} source={{ uri: facephoto }}></ImageBackground>
                    }
                    </ImageBackground>
                {/* </View> */}
                <TouchableOpacity onPress={()=>{setimagebox(true)}} style={{width:wp('100%'),position:"absolute",bottom:140,left:0,alignItems:"center",justifyContent:"center"}}>
                    <Image   source={imagePath.sceneer} style={{width:60,height:60}}/>
                </TouchableOpacity>
                <View style={{marginTop:-50,position:"absolute",bottom:50,left:wp('5%'),width:wp('90%')}}>
                    <ButtonField label={t('Next')} submitfun={submitfun}/>
                </View>
            {/* </ImageBackground> */}
            {
                imagebox && (
                    <Uploadimage closeimagepopup={closeimagepopup} width={wp('100%')} height={400} cropperCircleOverlay={true}/>
                )
            }
        </View>
    );
};
export default Uploadfacelicence;