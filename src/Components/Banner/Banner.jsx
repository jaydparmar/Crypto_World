import { Container ,Typography} from '@mui/material'
import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import {TrendingCoins} from '../../config/Api.js'
import {CryptoState} from '../CryptoContext'
import AliceCarousel from 'react-alice-carousel' 
import "react-alice-carousel/lib/alice-carousel.css";
import "./Banner.css"
import { Link } from 'react-router-dom'
import { fontWeight } from '@mui/system'

function functionForPrice(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
const Banner = () => {
    const [trending, setTrending] = useState([]);
    const {currency, symbol} = CryptoState();
    const fetchTrendingCoins = async() =>{
        const {data} = await axios.get(TrendingCoins(currency));
        setTrending(data);
    }
    useEffect(()=>{
        fetchTrendingCoins();
    },[currency]);
    const items = trending ? trending.map((coin)=>(
        <Link className='carouselItem' to={`/coin/${coin.id}`}>
            
            <img
                src={coin.image}
                alt={coin.name}
                height = "80"
                style={{marginBottom:10}}
            />
            <span style={{marginBottom:"10px"}}>
                {coin.symbol}
                &nbsp;
                <span className={coin.price_change_percentage_24h >=0 ? 'green':'red'}>
                    {coin.price_change_percentage_24h >=0 ? `+${coin.price_change_percentage_24h?.toFixed(2)}%` : `${coin.price_change_percentage_24h?.toFixed(2)}%`}

                </span>

            </span>
            <span style={{letterSpacing:"2px" , fontSize:"1.1rem", fontWeight:600}}>
                {symbol} {functionForPrice(coin.current_price.toFixed(2))}
            </span>
        </Link>
    )):[];
    const responsive = {
        0:{
            items:2,
        },
        600:{
            items:4,
        },
    }
  return (
    <div className='banner'>
        <Container className="bannerContent">
            <div className="tagline">
                <Typography variant='h2' style={{
                    fontWeight:"bold",
                    marginBottom:15,
                    fontFamily: 'Montserrat',
                    letterSpacing:"4px",
                    wordSpacing:"8px",
                }}>
                    Crypto World
                </Typography>
                <Typography variant='subtitle2'style={{
                    color:"darkgrey",
                    transform:"capitalize",
                    fontFamily:"Montserrat",
                    fontSize:"1.1rem",
                }}>
                    Get all Info about Crypto Currency
                </Typography>
            </div>
            <div className="carouselclass">
                <AliceCarousel
                    mouseTracking
                    infinite
                    autoPlayInterval = {1000}
                    animationDuration = {1500}
                    disableDotsControls
                    responsive={responsive}
                    autoPlay
                    disableButtonsControls
                    items={items}
                />
            </div>
        </Container>
    </div>
  )
}

export default Banner
