import React, { useState,useEffect } from 'react';
import { View, Text,Image,TouchableOpacity,FlatList,BackHandler } from 'react-native';
import { StylesGloble } from '../../helper/Globlecss';
import ButtonField  from '../../helper/ButtonField';
import imagePath from '../../constants/imagePath';
import ApiDataService from "./../../services/Apiservice.service";
import LoadingPage from '../../helper/LoadingPage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import './../../Language/i18'


const likesdis = [{name:'Yoga',check:0},{name:'Movies',check:0},{name:'Gym & Fitness',check:0},{name:'Art',check:0},
    {name:'Swimming',check:0},{name:'Photography',check:0},{name:'Food & Drink',check:0},{name:'Video games',check:0},{name:'Tea',check:0},{name:'Comedy',check:0},
    {name:'Entertainment',check:0},{name:'Music',check:0},{name:'Travel',check:0},{name:"Nature & Plants",check:0},{name:'Instagram',check:0}]

const Wenttodislikes = ({ navigation,route }) => {
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

    const [likedislike,setlikedislike]  = useState(likesdis);
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
                let url = `userProfile?id=${userID}`
                ApiDataService.Getapi(url).then(response => {
                    setLoading(false);
                    if(response.data.data.my_dis_likes !=null || response.data.data.my_dis_likes !='')
                    {
                        var comdata = response.data.data.my_dis_likes;
                        comdata = comdata.split(/,/);
                        var newdata = [];
                        for(let j=0;j < likesdis.length;j++)
                        {
                            var chekval = 0;
                            for(let i=0;i < comdata.length;i++)
                            {
                                if(likesdis[j].name==comdata[i])
                                {
                                    chekval = 1;
                                }
                            }
                            newdata.push({name:likesdis[j].name,check:chekval})
                        }
                        setlikedislike(newdata);
                    }
                }).catch(e => { });
            } else {
            }
          } catch (error) {}
    }

    const changvaluefun = (name) =>{
        let newvalue = likedislike.filter((item)=>{
            if(item.name==name)
            {
                if(item.check==0)
                {
                    item.check=1; 
                }  
                else{
                    item.check=0; 
                }
            }
            return item;
        })
        setlikedislike(newvalue);
    }

    const submitfun = () =>{
        let newdata = [];
        let senddata = likedislike.filter((item)=>{
            if(item.check==1)
            newdata += item.name+',';
        })
        setLoading(true); 
        let formdata = {
            "id": userId,
            "my_dis_likes":newdata ,
            "page":"9",
            "lang":applan
        }
        let url = 'updateUserPersonalInformation'

        ApiDataService.Postapi(url, formdata).then(response => {
            setLoading(false);
            {(routenum==2)?    navigation.navigate('Home') :
            navigation.navigate('Addinformation')}
                
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
                        (pagetype == 2)&&    <TouchableOpacity onPress={() => navigation.navigate('Home')} style={{zIndex:999,marginRight:12}}>
                            <Image  style={{ width: 21.43, height: 18,marginTop:5}} source={imagePath.backPage} />
                        </TouchableOpacity> 
                    }
                    <Text style={{fontSize:18,fontWeight:"700",color:"#000000",...StylesGloble.startposition}}>{t('Want to dislikes')}</Text>
                </View>
                {
                    <FlatList
                        numColumns={3}
                        contentContainerStyle={{
                            marginTop:20 
                        }}
                        data={likedislike}
                        renderItem={({item}) => <Item item={item}  changvaluefun={changvaluefun}/>}
                        keyExtractor={(item, index) => index}
                    />    
                }
               <View style={{width:"100%",marginTop:-20,position:"absolute",bottom:50,left:"5%"}}>
                    <ButtonField label={(routenum==2)?t('Update'):t('Save')} submitfun={submitfun}/>
                </View> 
               
            </View>
        </>
    );

};
const Item = ({item,changvaluefun}) => (
    <TouchableOpacity  onPress={()=>{changvaluefun(item.name)}} style={item.check == 1 ? StylesGloble.activelikebtn : StylesGloble.inactivelikebtn} >
        <Text style={item.check == 1 ? StylesGloble.activeliketext : StylesGloble.inactiveliketext} >{item.name}</Text>
    </TouchableOpacity>
);
export default Wenttodislikes;