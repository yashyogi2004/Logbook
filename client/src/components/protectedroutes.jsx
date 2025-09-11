import React, {  useState } from 'react'


const protectedroutes = ({children}) => {

   const [isAuthenticated, setIsAuthenticated] = useState(false);
   const getData = async () => {
    try{
       const res = await fetch("http://localhost:5000/api/v1/userProfile", {
       method: "GET",
       headers: {
         "Content-Type": "application/json",
       },
       credentials: "include",
     });
     if(res.ok){
      setIsAuthenticated(true);
     }else{
      setIsAuthenticated(false);
     }
    }catch(err){
      console.log(err,"invalid credentials");
    }
   }
   getData();
    if(!isAuthenticated){
        return <><div className='flex justify-center items-center h-screen'>
        <h1 className='text-2xl font-bold'>Access Denied</h1></div> </>
    }else{
        return  <>{children}</>
    }
  
}
export default protectedroutes;