import React, { useEffect, useState} from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { View, Text, Image, TouchableOpacity, ImageBackground,BackHandler } from 'react-native';
import ButtonField from './../../helper/ButtonField';
import imagePath from './../../constants/imagePath';
import Uploadimage from './../../helper/Uploadimage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiDataService from "./../../services/Apiservice.service";
import LoadingPage from './../../helper/LoadingPage';
import Toast from 'react-native-simple-toast';
import { useTranslation } from 'react-i18next';
import './../../Language/i18'


const Takeselfi = ({ navigation, route }) => {
    const id = route?.params?.id
    const[applan,setapplan] = useState('')
            
    const {t,i18n}=useTranslation();
    useEffect(() => {
        AsyncStorage.getItem('Applang', (err, cr) => {
            i18n.changeLanguage(cr)
            setapplan(cr)
        })
    }, []);
    const [Loading, setLoading] = useState(false);
    const [facephoto, setfacephoto] = useState('');
    const [userId, setuserId] = useState('');
    const [imagebox, setimagebox] = useState(false);

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
        AsyncStorage.getItem('userID', (err, cre) => {
            let userID = JSON.parse(cre);
            setuserId(userID);
        })
    },[])

    const submitfun = () => {
        if (facephoto == '') {
            calltoastmessage(t("Please upload your image"));
        } else {

            navigation.navigate('Congrachulation',{routetype:2,id:id})
        }
    }
    const closeimagepopup = (type, data) => {
        if (type == 1) {
            setimagebox(false);
        }
        else {
            setimagebox(false);
            addimagelist(data);
        }
    }
    const addimagelist = (source) => {
        setLoading(true);
        const data = new FormData();
        data.append('couple_id', 1);
        data.append('lang', applan);

        data.append('selfie', { name: 'camera-picture', type: 'image/jpeg', uri: source.path });
        ApiDataService.Uploadapi('TakeSelfi', data).then(response => {
            setLoading(false);
            if (response.data.status == true) {
                setfacephoto(response.data.data.selfie);
            }
        }).catch(e => {

            setLoading(false);
        });
    }
    const calltoastmessage = (data) => {
        Toast.showWithGravity(data, Toast.SHORT, Toast.BOTTOM);
    };
    return (
        <View style={{ width: wp('100%'), height: hp('100%'), position: "relative" ,}}>
            {
                Loading &&
                <View style={{ position: "absolute", top: 0, left: 0, height: "100%", width: "100%", zIndex: 999999 }}>
                    <LoadingPage />
                </View>
            }
            <View style={{width: wp('100%'), height: ('100%')}}>
                <View style={{ width: wp('100%'), position: "absolute", top: 25, left: 22, flexDirection:"row",justifyContent:"space-between",}}>
                    <Text style={{ fontSize: 20, fontWeight: "600", color: "#000000" }}>{t("Take selfie")}</Text>
                    <TouchableOpacity style={{justifyContent:"center"}} onPress={()=> navigation.navigate('Congrachulation',{routetype:2})}>
                    <Text style={{ fontSize: 16, fontWeight: "400", color: "#00D9A5",marginRight:50 }}>{t("Skip")}</Text>
                    </TouchableOpacity>
                   
                </View>
                <View style={{ width: wp('100%'), height: 350, position: "absolute", top: 100, left: 0, alignItems: "center", justifyContent: "center" }}>
                    {
                        facephoto &&
                        <ImageBackground imageStyle={{ borderRadius: 10 }} style={{ width: 320, height: "115%", padding: 5 }} source={{ uri: facephoto }}></ImageBackground> 
                        
                    }
                  
                </View>
                <TouchableOpacity onPress={()=>{setimagebox(true)}} style={{width:wp('100%'),position:"absolute",bottom:140,left:0,alignItems:"center",justifyContent:"center"}}>
                    <Image   source={imagePath.sceneer} style={{width:60,height:60}}/>
                </TouchableOpacity>
                
                <View style={{ marginTop: -50, position: "absolute", bottom: 50, left: wp('5%'), width: wp('90%') }}>
                    <ButtonField label={t('Next')} submitfun={submitfun} />
                </View>
            </View>
            {
                imagebox && (
                    <Uploadimage closeimagepopup={closeimagepopup} width={wp('100%')} height={400} cropperCircleOverlay={true} />
                )
            }
        </View>
    );
};

export default Takeselfi;