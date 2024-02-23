//import liraries
import React, { useState,useEffect} from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { View, Text, Image,TouchableOpacity,BackHandler} from 'react-native';
import { StylesGloble } from './../../helper/Globlecss';
import imagePath from './../../constants/imagePath';
import TextField  from './../../helper/TextField';
import { RadioButton } from 'react-native-paper';
import ApiDataService from "./../../services/Apiservice.service";
import LoadingPage from '../../helper/LoadingPage';
import ButtonField  from '../../helper/ButtonField';
import Toast from 'react-native-simple-toast';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import './../../Language/i18';
import { useSelector, useDispatch } from 'react-redux';
import { setVideoData} from './../../Redux/index';


const Addvideo = ({ navigation,route }) => {
    const coupleid= route.params.couple_id
    const[applan,setapplan] = useState('');
    const dispatch = useDispatch();
    
    const {t,i18n}=useTranslation();
    useEffect(() => {
        AsyncStorage.getItem('Applang', (err, cr) => {
            i18n.changeLanguage(cr)
            setapplan(cr)
        })
        AsyncStorage.setItem('coupleid', '' + route.params.couple_id);
        AsyncStorage.getItem('coupleid', (err, cr) => {
            console.log('coupleidcoupleidcoupleid', cr);
        })
    }, []);

    useEffect(() => {
        const backAction = () => {
          navigation.navigate('Memberconnection');
          return true;
        };
        const backHandler = BackHandler.addEventListener(
          'hardwareBackPress',
          backAction
        );
        return () => backHandler.remove();
      }, [navigation]);
    const [checked, setChecked] = React.useState('youtube');
    const [videourl, setvideourl] = useState({
        value: '',
        message:'',
        isValid: false,
    });
    const [Loading, setLoading] = useState(false);
  
    const calltoastmessage = (data) => {
        Toast.showWithGravity(data, Toast.SHORT, Toast.BOTTOM);
    };

    const addVideo = () => {
        setLoading(true); 
        let formdata = {
            "couple_id":coupleid,
            "youtube_link": videourl.value,
            "lang":applan
        }
        let url = 'memberConnection'

        ApiDataService.Postapi(url, formdata).then(response => {
            setLoading(false);
            console.log('rrrrrrr',response);
            if (response.status == true) {
                if(videourl.value==''){
                    calltoastmessage(t("Please add youtube url"));
                }else{
                    dispatch(setVideoData('0',applan));
                    calltoastmessage(t("Link Uploaded!"));
                    navigation.navigate('Memberconnection',{coupleid:coupleid})
                }
            }
        }).catch(e => {
        });
    }

    const validatevideourl = (_in) => {
        try
        {
            setvideourl(prev => ({ ...prev, value: _in  }));
            if (!_in) {
                setvideourl(prev => ({ ...prev, isValid: true,message:t("Please enter video url")}));
            }
            else if (_in.length === 0) {
                setvideourl(prev => ({ ...prev, isValid: true,message:t("Please enter video url")}));
            }
            else {
                setvideourl(prev => ({ ...prev, isValid: false,message:''}));
            }
        } catch (error) {
        }
    }
    return (
        <View style={{...StylesGloble.container,...StylesGloble.ScreenHorigental}}>
            {
                    Loading &&
                    <View style={{ position: "absolute", top: 0, left: 0, height: "100%", width: "115%", zIndex: 999999 }}>
                        <LoadingPage />
                    </View>
                }
            <View style={{flexDirection:"row",marginTop:20}}>
                <TouchableOpacity onPress={() => navigation.navigate('Home')} style={{...StylesGloble.homeheaderlocation,left:wp('1%'),top:0,zIndex:999}}>
                    <Image  style={{ width: 20, height: 20}} source={imagePath.backPage} />
                </TouchableOpacity>
                <Text style={{fontSize:18,fontWeight:"700",color:"#000000",...StylesGloble.startposition,marginLeft:45,marginTop:-5}}>{t("Add video")}</Text>
            </View>
            <View style={{flexDirection:"row",marginTop:55}}>
                <View style={{flexDirection:"row",width:wp('30%')}}>
                    <RadioButton
                        value="youtube"
                        status={ checked === 'youtube' ? 'checked' : 'unchecked' }
                        onPress={() => setChecked('youtube')}
                    />
                     <Text style={{fontSize:15,fontWeight:"500",color:"#000000",marginTop:8}}>{t("You tube")}</Text>
                </View>
                <View style={{flexDirection:"row",width:150}}>
                    <RadioButton
                        value="vimeo"
                        status={ checked === 'vimeo' ? 'checked' : 'unchecked' }
                        onPress={() => setChecked('vimeo')}
                    />
                    <Text style={{fontSize:15,fontWeight:"500",color:"#000000",marginTop:8}}>{t("Vimeo")}</Text>
                </View>
            </View>
            <View style={{marginTop:55}}>
                <TextField 
                    value={videourl.value}
                    label={t('Video URL')}
                    Placeholder={t('URL')}
                    type='text'
                    errorText={videourl.message}
                    onChangeText={  videourl => validatevideourl(videourl)} />
               
            </View>
            <View style={{marginTop:'120%'}}>
                    <ButtonField label={t('Save')} 
                    submitfun={addVideo}
                    />
                </View> 
        </View>
    );
};
export default Addvideo;