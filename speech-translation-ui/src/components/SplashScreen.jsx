import React from "react"
import splash from '../assets/Translato.mp4'
import '../App.css'

function SplashScreen() {
    
  return (
    <div className="splash-container">
        <video autoPlay muted loop id="myVideo">
            <source src={splash} type="video/mp4"/>
        </video>
    </div>
  )
}

export default SplashScreen