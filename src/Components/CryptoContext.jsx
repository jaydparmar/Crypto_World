import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import {CoinList} from '../config/Api.js'
import { onAuthStateChanged } from 'firebase/auth';
import { Auth, db } from '../firebase.js';
import { doc, onSnapshot } from 'firebase/firestore';

const Crypto = createContext();

const CryptoContext = ({children}) => {
    const [currency, setCurrency]=useState("INR");
    const [symbol, setSymbol] = useState("₹");
    const [coins, setCoins] = useState([]);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [watchlist, setWatchlist] = useState([]);
    const fetchCoins = async () => {
      setLoading(true);
      const { data } = await axios.get(CoinList(currency));
      setCoins(data);
      setLoading(false);

  };
    useEffect(() => {
      onAuthStateChanged(Auth, (user)=>{
        if(user)
        {
          setUser(user);
        }
        else{
          setUser(null);
        }
        console.log(user);
      })
    }, [])
    
    useEffect(()=>{
        if(currency === "INR")setSymbol("₹");
        else if(currency === "USD")setSymbol("$");
    },[currency])

    useEffect(() => {
      if(currency)fetchCoins();
  }, [currency]);
    useEffect(() => {
      if(user)
      {
        const coinRef = doc(db, "watchlist", user.uid);
        onSnapshot(coinRef, coin=>{
        
          if(coin.exists())
          {
            setWatchlist(coin.data().coins);
          }
          else{
            console.log("No Items in Watchlist");
          }
        })
        
      }
      
    }, [user])
    
  return (
    <Crypto.Provider value={{currency, symbol, setCurrency, coins, loading, fetchCoins, user, watchlist}}>
      {children}
    </Crypto.Provider>
  )
}

export default CryptoContext;
export const CryptoState = ()=>{
    return useContext(Crypto);
}