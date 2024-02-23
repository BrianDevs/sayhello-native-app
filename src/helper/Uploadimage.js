import React, { useEffect, useRef, useState } from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Text,StyleSheet,View,TouchableOpacity,Modal,Image,PermissionsAndroid,} from 'react-native'

import ImagePicker from 'react-native-image-crop-picker';
import ImgToBase64 from 'react-native-image-base64';
import DeviceInfo from "react-native-device-info";
import { useTranslation } from 'react-i18next';
import './../Language/i18';
import AsyncStorage from '@react-native-async-storage/async-storage';
import imagePath from './../constants/imagePath';


const Uploadimage= (props) => {
    const androidVersion = DeviceInfo.getSystemVersion()
    const {t,i18n}=useTranslation();
    useEffect(() => {
        AsyncStorage.getItem('Applang', (err, cr) => {
            i18n.changeLanguage(cr)
        })
    }, []);

    const ImageUploadincamera = async () =>{
       const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
                title: t('Camera Permission'),
                message: t('App needs access to your camera'+'so you can take awesome pictures.'),
                buttonNeutral: t('Ask Me Later'),
                buttonNegative:t('Cancel'),
                buttonPositive: t('OK'),
            },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            ImagePicker.openCamera({
                width: props.width,
                height: props.height,
                cropperCircleOverlay:props.cropperCircleOverlay,
                cropping: true,
            }).then(image => {
                if (image.path) {
                    let uri = image.path;
                    addinserverfun(image);
                }
                else {
                    props.closeimagepopup(1,'') ;
                }
            });
    
        } 
        else {
        }
    }
    const ImageUploadingallery = async () =>{ 
        let granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
                title: t('Gallery permission'),
                message: t('Say hello needs gallery permission'),
            },  
        );
        if(androidVersion > 12){
            granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
                {
                    title: t('Gallery permission'),
                    message: t('Say hello needs gallery permission'),
                },  
            );
        }
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            ImagePicker.openPicker({
                width: props.width,
                height: props.height,
                cropperCircleOverlay:props.cropperCircleOverlay,
                cropping: true
              }).then(image => {
                if (image.path) {
                    let uri = image.path;
                    addinserverfun(image);
                }
                else {
                    props.closeimagepopup(1,'') ;
                }
            });
        } 
        else {
        }
    }
    const addinserverfun = async (source) =>{
        ImgToBase64.getBase64String(source.path).then(base64String => {
          
            props.closeimagepopup(2,source,base64String);
          
        }).catch(err => 
            {
                props.closeimagepopup(2,source,'');
            });
       
    }

    return<View >
           <Modal  animationType="slide" transparent={true} visible={true}>
                <View style={{   height: '100%',  marginTop: 'auto',position:"relative", backgroundColor:'#0e0e0e61',zIndex:999999}}>
                    <TouchableOpacity style={{position: 'absolute',bottom: 0,width:'100%',height:"100%"}} onPress={() =>{
                         props.closeimagepopup(1,'') }}>
                        <View  ></View>
                    </TouchableOpacity>
                    <View style={{position: 'absolute',bottom: 0,left:0,right:0,borderTopRadius:50,height:160,backgroundColor:"#ffffff",borderTopRightRadius:15,borderTopLeftRadius:15}}>  
                       
                        <View style={StylesFirst.photoview}>
                            <View style={StylesFirst.photosec}> 
                                <TouchableOpacity onPress={() =>{
                                        ImageUploadingallery();
                                    }}>
                                    <Image style={StylesFirst.photoicon}   source={imagePath.Gallery}/>
                                </TouchableOpacity>
                                <Text style={StylesFirst.phottext}>Select Photo</Text>
                            </View>
                            <View style={StylesFirst.photosec}>
                                <TouchableOpacity onPress={() =>{
                                    ImageUploadincamera();
                                }}>
                                    <Image style={StylesFirst.photoicon}   source={imagePath.camera}/>
                                </TouchableOpacity>
                                <Text style={StylesFirst.phottext}>Camera</Text>
                            </View>
                        </View>
                    </View>
                    
                </View>
            </Modal>
    </View>;
}
export const StylesFirst = StyleSheet.create({
    footerdv:{
        width:"100%",
        height:60,
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 9,
        },
        shadowOpacity: 0.50,
        shadowRadius: 12.35,
        elevation: 19,
        flexDirection: 'row', 
        alignItems:'center', 
    },
    bottomButtons: {
        width:"20%",
        alignItems:'center', 
    },
    footerText: {
        color:'#000000',
        fontWeight:'bold',
        alignItems:'center',
        fontFamily:'Poppins-Regular',fontSize:18,
    },
    photoview:{
       flexDirection: 'row-reverse', 
        paddingTop:35,
        paddingBottom:25,
       // alignSelf:"center"
    },
    photosec:{
        width:"50%",
        height:"100%",
        alignItems:"center"
    },
    photoicon:{
        width :80,
        height :80,
    },
    phottext:{
        alignItems:"center",
        fontFamily:'Poppins-Regular',
        color:"#000000",
        fontSize:16,
        fontWeight:"500"
    },
})

export default Uploadimage