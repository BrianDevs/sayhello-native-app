import React, { useEffect, useState, useContext } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { View, Text,Image, TouchableOpacity, ImageBackground } from 'react-native';
import ButtonField from './../../helper/ButtonField';
import imagePath from './../../constants/imagePath';
import Uploadimage from './../../helper/Uploadimage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiDataService from "./../../services/Apiservice.service";
import LoadingPage from './../../helper/LoadingPage';
import Toast from 'react-native-simple-toast';
import { useTranslation } from 'react-i18next';
import './../../Language/i18'
const Uploaddocimg = ({ navigation, route }) => {
    const[applan,setapplan] = useState('')
    const {t,i18n}=useTranslation();
    useEffect(() => {
        AsyncStorage.getItem('Applang', (err, cr) => {
            i18n.changeLanguage(cr)
            setapplan(cr)
        })
    }, []);

    const [Loading, setLoading] = useState(false);
    const [imgfront, setimgfront] = useState('');
    const [imgback, setimgback] = useState('');
    const [pageno, setpageno] = useState(1);
    const [userId, setuserId] = useState('');
    const [imagebox, setimagebox] = useState(false);

    const [imgfrontbs64, setimgfrontbs64] = useState('');
    const [imgback64, setimgback64] = useState('');

    useEffect(() => {
        AsyncStorage.getItem('userID', (err, cre) => {
            let userID = JSON.parse(cre);
            setuserId(userID);
        })
    }, [])

    const submitfun = () => {
        if (pageno == 1) {
            if (imgfront == '') {
                calltoastmessage(t('Please upload your image'));
            } else  {
                setpageno(2);
            }     
        }
        else {
            if (imgback == '') {
                calltoastmessage(t('Please upload your image'));
            } else  {
                setLoading(true);
                const data = new FormData();
                data.append('id', userId);
                data.append('page', '3');
                data.append('lang', applan);

                data.append('front_doc_64',imgfrontbs64);
                data.append('back_doc_64',imgback64);
                ApiDataService.Uploadapi('updateUserDocsImageAndProfileImageInBase64', data).then(response => {
                    console.log('response--------image--------',response.data);
                    setLoading(false);
                    if (response.data.status == true) {
                        navigation.navigate('Verified', { pagetype: 1 })
                    }
                }).catch(e => {
                    console.log('e--------image--------',e);

                    setLoading(false);
                });

               
            }
        }
    }
    const closeimagepopup = (type, data,bs6) => {
        if (type == 1) {
            setimagebox(false);
        }
        else {
            setimagebox(false);
            addimagelist(data);
            if(pageno == 2)
            {
                setimgback64(bs6);
            }
            else{
                setimgfrontbs64(bs6);
            }
        }
    }
    const addimagelist = (source) => {
        let imagetype = 'front_doc';
        if (pageno == 2) {
            imagetype = 'back_doc';
        }
        setLoading(true);
        const data = new FormData();
        data.append('id', userId);
        data.append('page', '3');
        data.append('lang', applan);

        data.append(imagetype,  { name: 'camera-picture', type: 'image/jpeg', uri:source.path  });
        ApiDataService.Uploadapi('updateUserDocsImageAndProfileImage', data).then(response => {
            setLoading(false);
            if (response.data.status == true) {
                if (pageno == 1) {
                    setimgfront(response.data.data.front_doc_image);
                }
                else {
                    setimgback(response.data.data.back_doc_image);
                }
            }
        }).catch(e => {
            setLoading(false);
        });
    }

    const calltoastmessage = (data) => {
        Toast.showWithGravity(data, Toast.SHORT, Toast.BOTTOM,'200');
    };
    return (
        <View style={{ width: wp('100%'), height: hp('100%'), position: "relative" }}>
            {
                Loading &&
                <View style={{ position: "absolute", top: 0, left: 0, height: "100%", width: "100%", zIndex: 999999 }}>
                    <LoadingPage />
                </View>
            } 
                <View style={{ width: wp('100%'), position: "absolute", top: 60, left: 0, alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ fontSize: 22, fontWeight: "700", color: "#000000" }}>{pageno}/2</Text>
                   
                    {
                        (pageno == 1) ? (
                            
                            <>
                             <Text style={{ fontSize: 16, fontWeight: "400", color: "#000000" }}>{t('Place your front side of your card on')}</Text>
                    <Text style={{ fontSize: 16, fontWeight: "400", color: "#000000" }}>{t('on the blue box')}</Text>
                            </>
                           
                        ) : (
                           
                            <>
                             <Text style={{ fontSize: 16, fontWeight: "400", color: "#000000" }}>{t('Place your back side of your card on')}</Text>
                    <Text style={{ fontSize: 16, fontWeight: "400", color: "#000000" }}>{t('on the blue box')}</Text>
                            </>
                        )
                    }
                </View>
                <ImageBackground style={{ width: "93%", height: 340,marginTop:'50%',margin:20,position: "absolute",  }} source={imagePath.Blue_box}>
                <View style={{ }}>
                    {
                        (pageno == 1) ? (
                            imgfront &&
                            <ImageBackground style={{ width: "90%", height: 270 ,margin:20}} source={{ uri: imgfront }}></ImageBackground>
                        ) : (
                            imgback &&
                            <ImageBackground style={{ width: "90%", height: 270 ,margin:20 }} source={{ uri: imgback }}></ImageBackground>
                        )
                    }
                </View>
                </ImageBackground>
                <TouchableOpacity onPress={() => { setimagebox(true) }} style={{ width: wp('100%'), position: "absolute", bottom: 140, left: 0, alignItems: "center", justifyContent: "center" }}>
                    <Image source={imagePath.sceneer} style={{ width: 60, height: 60 }} />
                </TouchableOpacity>
                <View style={{ marginTop: -50, position: "absolute", bottom: 50, left: wp('5%'), width: wp('90%') }}>
                    <ButtonField label={t('Next')} submitfun={submitfun} />
                </View>
            {/* </ImageBackground> */}
            {
                imagebox && (
                    <Uploadimage closeimagepopup={closeimagepopup} width={wp('100%')} height={400} cropperCircleOverlay={false} />
                )
            }
        </View>
    );
};
export default Uploaddocimg;