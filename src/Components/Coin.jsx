import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { SingleCoin } from "../config/Api";
import { useParams } from "react-router-dom";
import { CryptoState } from "./CryptoContext"
import { Typography, LinearProgress, Button } from "@material-ui/core";
import ReactHtmlParser from "react-html-parser";
import CoinInfo from "./CoinInfo";
import "./Coin.css";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import {toast} from 'react-toastify'
const Coin = () => {
  const [coin, setCoin] = useState("");
  
  const { id } = useParams();
  const { currency, symbol, user, watchlist } = CryptoState();
  const fetchCoinById = async () => {
    const { data } = await axios.get(SingleCoin(id));
    setCoin(data);
  };
  const inWatchlist = watchlist.includes(coin?.id);
  function functionForPrice(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  useEffect(() => {
    fetchCoinById();
  }, [currency]);

  if (!coin) {
    return <LinearProgress style={{ backgroundColor: "gold" }} />;
  }
  

  const AddtoWatchlist = async() =>{
    const coinRef = doc(db, "watchlist", user.uid);
    try{
      await setDoc(coinRef,
        {
          coins:watchlist?[...watchlist,coin?.id]:[coin?.id],
        });
        toast.success(`${coin.name} added to the Watchlist`);
    }catch(error)
    {
        toast.error(error);
    }
  }
  const RemoveWatchlist = async() =>{
    const coinRef = doc(db, "watchlist", user.uid);
    try{
      await setDoc(coinRef,
        {
          coins: watchlist.filter((watch) => watch!==coin?.id)
        },
        {
          merge:"true"
        }
        );
        toast.success(`${coin.name} Remove from the Watchlist`);
    }catch(error)
    {
        toast.error(error);
    }
  }
  
  return (
    <div className="coinContainer">
      <div className="sidebar">
        <img
          src={coin?.image.large}
          alt={coin?.name}
          height="200"
          style={{ marginBottom: 20 }}
        />
        <Typography variant="h3" className="coinHeading">
          {coin?.name}
        </Typography>
        <Typography
          variant="subtitile1"
          className="coinDesc"
          style={{
            wordSpacing: "1.1px",
            letterSpacing: "1.05px",
            lineHeight: "1.1",
          }}
        >
          {ReactHtmlParser(coin?.description.en.split(". ")[0])}.
        </Typography>
        <div className="marketData">
          <span
            style={{
              display: "flex",
              marginBottom: 20,
            }}
          >
            <Typography
              variant="h5"
              style={{
                fontWeight: "bold",
                fontFamily: "Montserrat",
              }}
            >
              Rank:
            </Typography>
            &nbsp;&nbsp;
            <Typography
              variant="h5"
              style={{
                fontFamily: "Montserrat",
                fontWeight: "400",
              }}
            >
              {coin?.market_cap_rank}
            </Typography>
          </span>
          <span style={{ display: "flex", marginBottom: 20 }}>
            <Typography
              variant="h5"
              style={{
                fontWeight: "bold",
                fontFamily: "Montserrat",
              }}
            >
              Current Price:
            </Typography>
            &nbsp;&nbsp;
            <Typography variant="h5" style={{ fontFamily: "Montserrat" }}>
              {symbol}
              {functionForPrice(
                coin?.market_data.current_price[currency.toLowerCase()]
              )}
            </Typography>
          </span>
          <span style={{ display: "flex", marginBottom: 20 }}>
            <Typography
              style={{
                fontWeight: "bold",
                fontFamily: "Montserrat",
                fontSize: "1.5rem",
              }}
            >
              Market Cap:
            </Typography>
            &nbsp;&nbsp;
            <Typography variant="h5" style={{ fontFamily: "Montserrat" }}>
              {symbol}
              {functionForPrice(
                coin?.market_data.market_cap[currency.toLowerCase()]
                  .toString()
                  .slice(0, -6)
              )}
              M
            </Typography>
          </span>
          {user && (
            <Button
            variant="outlined"
            style={{
              width:"100%",
              height:40,
              backgroundColor:inWatchlist?"red":"white",
            }}
            onClick={inWatchlist?RemoveWatchlist:AddtoWatchlist}
            >
              
              {inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
            </Button>
          )}
        </div>
      </div>
      <CoinInfo coin={coin} />
    </div>
  );
};

export default Coin;