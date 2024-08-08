import React, { useState } from 'react'
import AdminDashboard from '../components/AdminDashboard';
import AdminNavbar from '../components/AdminNavbar';
import AdminProfile from '../components/AdminProfile';
import BookingDetails from '../components/BookingDetails';

const AdminHome = () => {
    const [nav,setnav]=useState({dash:true,profile:false,booking:false});
    const handlenav=(val)=>{
        if(val==="dash"){
            setnav({dash:true,profile:false,booking:false})
        }
        if(val==="profile"){
            setnav({dash:false,profile:true,booking:false})
        }
        if(val==="booking"){
            setnav({dash:false,profile:false,booking:true})
        }
                
    }
  return (
    <div>
        <AdminNavbar nav={handlenav}/>
        <br/><br/><br/>
        {nav.dash && <AdminDashboard/>}
        {nav.profile && <AdminProfile/>}
        {nav.booking && <BookingDetails/>}
    </div>
  )
}

export default AdminHome;