import React from 'react'
import Grid from '@mui/material/Unstable_Grid2';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Prayer from './Prayer';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { colors } from '@mui/material';
import axios from 'axios';
import { useState,useEffect } from 'react';
import moment from 'moment';
import "moment/dist/locale/ar-kw";

moment.locale('ar');
export default function MainContent(){


//STATE


const[nextPrayerIndex,setNextPrayerIndex]=useState(0);


const [timing,setTiming]=useState(

  {
  
    Fajr:"04:10",
    Dhuhr:"11:50",
    Asr:"15:18",
    Sunset:"18:03",
    Isha:"19:33"
  
  
  }
    
  );

  const [selectedCity, setSelectedCity] = useState(
    {
   
      displayName:"عمان",
      apiName:"Amman"



  });

  const avilableCities=[

  {
      displayName:"عمان",
      apiName:"Amman"
  },
  {
    displayName:"الزرقاء",
    apiName:"Zarqa"
},
{
  displayName:"الكرك",
  apiName:"Karak"
},
{
  displayName:"اربد",
  apiName:"Irbid"
},
{
  displayName:"العقبة",
  apiName:"Aqaba"
}

  ];

  const [today,setToday]=useState("");

  const [timer,setTimer]=useState(10);


  const prayersArray=[
    {key:'Fajr',displayName:"الفجر"},
    {key:'Dhuhr',displayName:"الظهر"},
    {key:'Asr',displayName:"العصر"},
    {key:'Sunset',displayName:"المغرب"},
    {key:'Isha',displayName:"العشاء"}
    
  ]



const getTimings=async()=>{

const response=await axios.get(`https://api.aladhan.com/v1/timingsByCity?country=JO&city=${selectedCity.apiName}`);

setTiming(response.data.data.timings);
}



useEffect(()=>{

  
getTimings();



},[selectedCity]);



useEffect(()=>{

let interval=setInterval(()=>{
  console.log("calling timer");

  setupCountDownTimer();

},1000);

const t=moment();

setToday(t.format("MMM Do YYYY | hh:mm"));

return ()=> {

  clearInterval(interval);
}


},[]);


    const setupCountDownTimer=()=>{

    const momentNow=moment();

    let prayerIndex=2;


    if(momentNow.isAfter(moment(timing["Fajr"],"hh::mm")) && momentNow.isBefore(moment(timing['Dhuhr'],"hh::mm")))

    {
      prayerIndex=1;
    } else if(momentNow.isAfter(moment(timing["Dhuhr"],"hh::mm")) && momentNow.isBefore(moment(timing['Asr'],"hh::mm")))
    {

    
     prayerIndex=2;
    } else if(momentNow.isAfter(moment(timing["Asr"],"hh::mm")) && momentNow.isBefore(moment(timing["Sunset"],"hh:mm"))){

      prayerIndex=3

    } else if(momentNow.isAfter(moment(timing["Sunset"],"hh::mm")) && momentNow.isBefore(moment(timing["Isha"],"hh:mm"))){

     prayerIndex=4;

    }else {
      prayerIndex=0;
    }

    
    setNextPrayerIndex(prayerIndex);


    const nextPrayerObject=prayersArray[prayerIndex];
    const nextPrayerTime = timing[nextPrayerObject.key];
   
    const remaingTime=moment(nextPrayerTime,"hh:mm").diff(momentNow);

    console.log(nextPrayerTime);

    console.log(remaingTime);

    }

    const handleChange = (event) => {
      
     const cityObject=avilableCities.find((city)=>{
      return city.apiName== event.target.value;
     })
      
      setSelectedCity(cityObject);
      };





    return <>
    

    {/* Top Row */}
<Grid container>

<Grid xs={6}>
    <div>
   <h2>{today}</h2>
   <h1>{selectedCity.displayName}</h1>
   <h2>{timer}</h2>
    </div>

</Grid>

<Grid xs={6}>
<div>
<h2>متبقي حتى صلاة {prayersArray[nextPrayerIndex].displayName}</h2>
<h1>00:10:15</h1>

</div>


</Grid>





</Grid>

 {/* == Top Row == */}

<Divider variant="middle" style={{borderColor:"white",opacity:"1.0"}} />


{/* Prayers Cards */}


<Stack direction="row" justifyContent={'space-around'} style={{marginTop:"50px"}}>
        <Prayer  name="الفجر" time={timing.Fajr} image="./src/assets/img/fajr-prayer.png" />
        <Prayer name="الظهر"  time={timing.Dhuhr} image="./src/assets/img/dhhr-prayer-mosque.png" />
        <Prayer name="العصر"  time={timing.Asr} image="./src/assets/img/asr-prayer-mosque.png" />
        <Prayer name="المغرب" time={timing.Sunset} image="./src/assets/img/sunset-prayer-mosque.png" />
        <Prayer name="العشاء" time={timing.Isha}image="./src/assets/img/night-prayer-mosque.png" />
      </Stack>






{/* ==Prayers Cards== */}

{/* Select City */}


<Stack direction={'row'} justifyContent={'center'} style={{marginTop:"20px"}}>
      <FormControl style={{width:"20%"}}>
        <InputLabel id="demo-simple-select-label"><span style={{color:"white"}}>المدينة</span></InputLabel>
        <Select
          style={{color:"white"}}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedCity.apiName}
          label="City"
          onChange={handleChange}
        >
          {
            avilableCities.map((city)=>{
             
              // eslint-disable-next-line react/jsx-key
              return (<MenuItem value={city.apiName} key={city.apiName} >{city.displayName}</MenuItem>);
            })
          }
         
        </Select>
      </FormControl>
    </Stack>


{/* ==Select City== */}


    </>
} 
 