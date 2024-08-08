import React, { useState } from 'react'
import UserDashboard from '../components/UserDashboard';
import UserNavbar from '../components/UserNavbar';
import UserProfile from '../components/UserProfile';

const UserHome = () => {
    const [nav,setnav]=useState({dash:true,profile:false});
    const handlenav=(val)=>{
        if(val==="dash"){
            setnav({dash:true,profile:false})
        }
        if(val==="profile"){
            setnav({dash:false,profile:true})
        }
    }
  return (
    <div>
        <UserNavbar nav={handlenav}/>
        <br/><br/><br/>
        {nav.dash && <UserDashboard/>}
        {nav.profile && <UserProfile/>}
    </div>
  )
}

export default UserHome;