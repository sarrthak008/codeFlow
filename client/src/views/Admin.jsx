import React from 'react'
import { broadcast } from '../../utils/socket/emmiter.js'

const Admin = () => {


    const handelSend = ()=>{
        broadcast("MESSAGE" , {messge : "welcome"})
    }

  return (
    <div onClick={()=>handelSend()}>click</div>
  )
}

export default Admin