//import liraries
import React, { useState,useEffect } from 'react';
import { View, Text,Image,TouchableOpacity,BackHandler } from 'react-native';
import { StylesGloble } from '../../helper/Globlecss';
import ButtonField  from '../../helper/ButtonField';
import imagePath from '../../constants/imagePath';
import TextField  from './../../helper/TextField';
import ApiDataService from "./../../services/Apiservice.service";
import LoadingPage from '../../helper/LoadingPage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setUserData } from '../Redux/index';
import { useTranslation } from 'react-i18next';
import './../../Language/i18'


const Professionaldetails = ({ navigation,route }) => {

    const[applan,setapplan] = useState('')
            
    const {t,i18n}=useTranslation();
    useEffect(() => {
        AsyncStorage.getItem('Applang', (err, cr) => {
            i18n.changeLanguage(cr)
            setapplan(cr)
        })
    }, []);
    const pagetype = route.params.routetype;
    const routenum = route?.params?.routetype

    const [ Jobtitle,setJobtitle ] = useState(false);
    const [ Company,setCompany ] = useState(false);
    const [ Collage,setCollage ] = useState(false);
    const [ School,setSchool ] = useState(false);
    const [Loading, setLoading] = useState(false);
    const [ userId,setuserId ] = useState('');
    const [IsLogin, setIslogin] = useState(false);

    useEffect(() => {
        const backAction = () => {
            {(routenum ==2) && navigation.navigate('Home')}

          return true;
        };
        const backHandler = BackHandler.addEventListener(
          'hardwareBackPress',
          backAction
        );
        return () => backHandler.remove();
      }, [navigation]);
    useEffect(()=>{
        AsyncStorage.getItem('userID', (err, cre) => {
            let  userID =  JSON.parse(cre);
            setuserId(userID);
            uselogin(userID)
        })
    },[])

    const uselogin = async (userID)=>{
        try {
            const user = await AsyncStorage.getItem('isLogin');
            if (user=='1') {
                setIslogin(user)
                let url = `userProfile?id=${userID}&lang=${applan}`
                ApiDataService.Getapi(url).then(response => {
                    setLoading(false);
                    setJobtitle(response.data.data.job_title);
                    setCompany(response.data.data.company);
                    setCollage(response.data.data.collage);
                    setSchool(response.data.data.school)
                    
                    
                }).catch(e => {
                }).finally(() => {
                    setLoading(false);
                });
               
            } else {
               
            }
          } catch (error) {}
    }

    const submitfun = () =>{
        addProfessionalinfo()
    }
    
    const addProfessionalinfo = () => {
            setLoading(true); 
            let formdata = {
                "id": userId,
                "job_title": Jobtitle,
                "company": Company,
                "collage": Collage,
                "school": School,
                "lang":applan
            }
            let url = 'updateUserPersonalInformation'

            ApiDataService.Postapi(url, formdata).then(response => {
                setLoading(false);
                if (response.status == true) {
                    {(routenum==2)?navigation.navigate('Home'):navigation.navigate('Mysearch', {
                        routetype: 1
                    });}
                     
                }
            }).catch(e => {
            });
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
                <View style={{...StylesGloble.oneline,width:"100%",marginTop:20}}>
                    {
                        (pagetype == 2) &&    <TouchableOpacity onPress={() => navigation.navigate('Home')} style={{zIndex:999,marginRight:12}}>
                            <Image  style={{ width: 21.43, height: 18,marginTop:5}} source={imagePath.backPage} />
                        </TouchableOpacity> 
                    }
                    <Text style={{fontSize:18,fontWeight:"700",color:"#000000",...StylesGloble.startposition}}>{t('Professional details')}</Text>
                </View>
                
                <View style={{marginTop:25}}>
                    <TextField 
                        value={Jobtitle}
                        label={t('Job title')}
                        Placeholder={t('Job title')}
                        type='text'
                        errorText={''}
                        onChangeText={  text => setJobtitle(text)} />
                </View>
                <View style={{marginTop:25}}>
                    <TextField 
                        value={Company}
                        label={t('Company')}
                        Placeholder={t('Company')}
                        type='text'
                        errorText={''}
                        onChangeText={  text => setCompany(text)} />
                </View>
                <View style={{marginTop:25}}>
                    <TextField 
                        value={Collage}
                        label={t('Collage')}
                        Placeholder={t('Collage')}
                        type='text'
                        errorText={''}
                        onChangeText={  text => setCollage(text)} />
                </View>
                <View style={{marginTop:25}}>
                    <TextField 
                        value={School}
                        label={t('School')}
                        Placeholder={t('School')}
                        type='text'
                        errorText={''}
                        onChangeText={  text => setSchool(text)} />
                </View>
                 <View style={{marginTop:85}}>
                    <ButtonField label={(routenum==2)?t('Update'):t('Save')} submitfun={submitfun}/>
                </View> 
               
            </View>
        </>
    );
};
export default Professionaldetails;