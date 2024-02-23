import { StyleSheet } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export const StylesGloble = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#FFFFFF',
    },
    ScreenHorigental:{
        paddingHorizontal:hp('3%')
    },
    widthheight100:{
        height: hp('30%'), 
        width: wp('100%'),
        alignItems:"center",
        justifyContent:"center",   
    },
    fontmedium:{
        color: '#000000',
        fontWeight: 'bold',
        lineHeight:30,
        fontSize: 30,
    },
    fontlarge:{
        color: '#000000',
        fontWeight: 'bold',
        lineHeight:35,
        fontSize: 35,
    },
    fontsmallsimple:{
        
        fontWeight:"400",
        color:"#666666",
        lineHeight:20,
        fontSize: 15,
    },
    fontsmall:{
        color: '#000000',
        lineHeight:20,
        fontSize: 15,
    },
    fontlargesmall:{
        color: '#000000',
        lineHeight:15,
        fontSize: 12,
    },
    oneline:{
       flexDirection:"row",
       width: wp('94%'),
    },
    centerclass:{
        alignItems:"center",
        // marginTop: hp('8%')
    },
    grrnbtn:{
        width:wp('40%'),
        height: hp('6%'), 
        backgroundColor:"#00A47C",
        alignItems:"center",
        justifyContent:"center"  ,
    },
    addcardbtn:{
        width:wp('30%'),
        height: hp('6%'),
        padding: hp('1%'), 
        borderColor:"#999999",
        borderRadius:4,
        borderWidth:2,
        alignItems:"center",
        justifyContent:"center"  
    },
    startposition:{
        width:wp('75%'),
    },
    endposition:{
        alignItems:"flex-end",
    },
    toggleswitch:{
        flexDirection:"row",
        width: wp('87%'),
        paddingVertical:18,
        borderRadius:4,
        paddingLeft:5,
        backgroundColor:"#EEEEEE"
    },
    inactivelikebtn:{
        margin:hp('1%'), 
        padding: hp('1.5%'), 
        backgroundColor:"#EEEEEE",
        borderRadius:4,
        alignItems:"center",
        justifyContent:"center"  
    },
    activelikebtn:{
        margin:hp('1%'), 
        padding: hp('1.5%'), 
        backgroundColor:"#338AFF",
        borderRadius:4,
        alignItems:"center",
        justifyContent:"center" 
    },
    inactiveliketext:{
        color: '#A7A7A8',
        lineHeight:20,
        fontSize: 15,
    },
    activeliketext:{
        color: '#FFFFFF',
        lineHeight:20,
        fontSize: 15,
    },
    actaddinfobtni:{
        // margin:hp('1%'),
        marginTop:hp('2%'), 
        padding: hp('1.2%'), 
       marginBottom:hp('2%'),
        backgroundColor:"#00D9A5",
        borderRadius:4,
        alignItems:"center",
        width:hp('14%'),
        justifyContent:"center" ,
      
    },
    homeheaderouter:{
        width:wp('90%'),
        position:"relative",
        height:hp('10%'),
        marginTop:10,
    },
    homeheaderprofile:{
        flexDirection:"row",
        width: wp('17%'),
        height:hp('10%'),
        position:"absolute",
        top:0,
        left:0,
        zIndex:999
    },
    homeheaderprofile:{
        width: wp('17%'),
        height:hp('10%'),
        position:"absolute",
        top:0,
        left:0
    },
    homeheadername:{
        position:"absolute",
        top:wp('5%'),
        left:wp('17%')
    },
    homeheaderlocation:{
        position:"absolute",
        top:wp('4%'),
        right:wp('2%')
    },
    homebottom:{
        position:"absolute",
        bottom:wp('4%'),
        left:wp('5%'),
        width: wp('90%'),
        height:hp('15%'),
        flexDirection:"row"
    },
    bottomsec:{
        width: wp('30%'),
        height:hp('15%'),
        alignItems:"center",
        justifyContent:"center"
    },
    headerout:{
        flexDirection: 'row', 
        alignItems:'center', 
        backgroundColor: '#fff',
        shadowColor: "#626464",
        borderBottomColor:"#626464",
        borderBottomWidth:.1,
        elevation: 5,
        width:wp('100%'),
        height:hp('10%'),
        position:"relative"
    },
    dropdownlabelstyle:{
        fontSize: 14,
        fontWeight:"700",
        color:"#000000",
        marginBottom:5
    },
    dropdownpickerouter:{
        padding:14,
        backgroundColor:"#EEEEEE",
       
        borderRadius: 4,
        fontFamily:'Poppins-Regular',
        fontSize: 16,
        color:"#000000"
    }
});