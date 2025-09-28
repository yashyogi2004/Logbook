
import React, { useEffect, useState } from 'react'


const protectedroutes = ({children,admin}) => {
  const [accessDenied,setAccessDenied]=useState(false);
useEffect(()=>{
    if(!admin || !admin.id){
        setAccessDenied(true);
    }else{
        setAccessDenied(false);
    }
  },[admin]); 
  if(accessDenied){
    return <><div className='flex justify-center items-center h-screen'>
    <h1 className='text-2xl font-bold'>Access Denied</h1></div> </>
  }else{
    return  <>{children}</>
  }
  // if(){
    //     return <><div className='flex justify-center items-center h-screen'>
    //     <h1 className='text-2xl font-bold'>Access Denied</h1></div> </>
    // }else{
    //     return  <>{children}</>
    // }
  
}
export default protectedroutes;