//import liraries
import React, { useState,useEffect } from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { View, Text, FlatList,BackHandler } from 'react-native';
import { StylesGloble } from '../../helper/Globlecss';
import ButtonField  from '../../helper/ButtonField';
import ApiDataService from "./../../services/Apiservice.service";
import LoadingPage from '../../helper/LoadingPage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import './../../Language/i18'



const Information = ({ navigation,route }) => {
    const[applan,setapplan] = useState('')
    
    const {t,i18n}=useTranslation();
    useEffect(() => {
        AsyncStorage.getItem('Applang', (err, cr) => {
            i18n.changeLanguage(cr)
            setapplan(cr)
        })
    }, []);
    const [userId, setuserId] = useState('');

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
    useEffect(() => {
        AsyncStorage.getItem('userID', (err, cre) => {
            let userID = JSON.parse(cre);
            setLoading(true);
            setuserId(userID);
          
        })
        AsyncStorage.getItem('matchid', () => {
            // setfcmtoken(credentials);
        })
        AsyncStorage.getItem('strangerID',(err,cre)=>{
            let strangerid = JSON.parse(cre);
           
        })
        AsyncStorage.getItem('matchid', (err, cre) => { 
            getAttemptquestionlist(cre)
        })
    }, [])

    const submitfun =()=>{
        navigation.navigate('Openchat')
    }

    const [getquestion, setgetquestion] = useState([]);
    const [Loading, setLoading] = useState(false);
    
    const getAttemptquestionlist = (cre) => {
        let url = `getAttemptQuestionByUser?user_id=${cre}&lang=${applan}`
        ApiDataService.Getapi(url).then(response => {
            setLoading(false);
            if (response.data.status == true) {
                setgetquestion(response.data.data);
            }
        }).catch(e => {
        })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <View style={{...StylesGloble.container,...StylesGloble.ScreenHorigental}}>
              {
                Loading&&
                <View style={{position:"absolute",top:0,left:0,height:"100%",width:"115%",zIndex:999999}}>
                    <LoadingPage/>
                </View>
            }
            <View style={{...StylesGloble.oneline,width:"100%",marginTop:20}}>
                <Text style={{fontSize:18,fontWeight:"700",color:"#000000",...StylesGloble.startposition}}>{t('Information')}</Text>
            </View>
            <View style={{height: hp('80%'),paddingBottom:5,paddingTop:25 }}>
                {
                    <FlatList
                    showsVerticalScrollIndicator={false}
                        numColumns={1}
                        data={getquestion}
                        renderItem={({item}) => <Item item={item}  />}
                        keyExtractor={(item, index) => index}
                    />    
                }
            </View>
            <View style={{marginTop:15}}>
                <ButtonField label={t('Save')} submitfun={submitfun}/>
            </View>
        </View>
    );
};
const Item = ({item}) => (
    <View style={{marginVertical:10}}>
        <Text style={{fontSize:18,fontWeight:"700",color:"#000000"}}>{item.question_id}. {item.question}</Text>
        <View style={{marginTop:10}}>
        <Text style={{fontSize:18,color:"#338AFF",marginLeft:25,fontWeight:"400"}}>{item.answer}</Text>
        </View>
       
    </View>
);
export default Information;