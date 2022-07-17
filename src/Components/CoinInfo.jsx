import React, { useEffect, useState } from "react";
import { HistoricalChart } from "../config/Api";
import "./CoinInfo.css";
import axios from "axios";
import { CryptoState } from "./CryptoContext"
import {
  createTheme,
  ThemeProvider,
  CircularProgress,
} from "@material-ui/core";
import { Line } from "react-chartjs-2";
import { registerables, Chart as ChartJS } from "chart.js";
import {chartDays} from '../config/data.js'
ChartJS.register(...registerables);

const darkTheme = createTheme({
  palette: {
    primary: {
      main: "#fff",
    },
    type: "dark",
  },
});

const CoinInfo = ({ coin }) => {
  const [historicalData, setHistoricalData] = useState();
  const [days, setDays] = useState(1);

  const { currency } = CryptoState();

  const fetchHistoricalDataApi = async () => {
    const { data } = await axios.get(HistoricalChart(coin.id, days, currency));
    setHistoricalData(data.prices);
  };

  useEffect(() => {
    fetchHistoricalDataApi();
  }, [currency, days]);

  return (
    <ThemeProvider theme={darkTheme}>
      <div className="historicalDataContainer">
        {!historicalData ? (
          <CircularProgress
            style={{ color: "gold" }}
            size={250}
            thickness={1}
          />
        ) : (
          <>
            <Line
              data={{
                labels: historicalData.map((e) => {
                  let date = new Date(e[0]);
                  let time =
                    date.getHours() > 12
                      ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                      : `${date.getHours()}:${date.getMinutes()} AM`;

                  return days === 1 ? time : date.toLocaleDateString();
                }),
                datasets: [{ data: historicalData.map((e) => e[1]) , label: `Price (Past ${days} Days) in ${currency}`,
                borderColor: "rgb(255,255,255)",}],
                
              }}
              options={{
                elements:{
                  point:{
                    radius:1,
                  },
                },
              }}
          
            />
            <div style={{
                  display:"flex",
                  marginTop:20,
                  justifyContent:"space-around",
                  width:"100%",
                }}>
              {chartDays.map(day =>(
                
                <button className="selectbutton"
                style={{
                  backgroundColor:day.value===days ? "black":"",
                  color:day.value===days?"white":"",
                  fontWeight:day.value===days?700:500,
                }}
                    key={day.value}
                    onClick={()=>setDays(day.value)}
                    selected = {day.value === days}
                    >
                    {day.label}

                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </ThemeProvider>
  );
};

export default CoinInfo;