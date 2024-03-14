import React from 'react'
import './Hero.css'
import hand_icon from '../Assets/hand_icon.png'
import arraw_icon from "../Assets/arrow.png"
import hero_image from "../Assets/hero_image.png"

const Hero = () => {
    return (
        <div className='hero'>
            <div className="hero-left">
                <h2>NEW ARRIVAL ONLY</h2>
                <div>
                    <div className="hero-hand-icon">
                        <p>New</p>
                        <img src={hand_icon} alt="" />
                    </div>
                    <p>Collections</p>
                    <p>for Everyone</p>
                </div>
                <div className="hero-latest-btn">
                    <a href="#newCollection"><div>Latest Collection</div></a>
                    <img src={arraw_icon} alt="" />
                </div>
            </div>
            <div className="hero-right">
                <img src={hero_image} alt="" />
            </div>
        </div>
    )
}

export default Hero
