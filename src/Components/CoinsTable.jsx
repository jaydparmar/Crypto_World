import React from 'react'
import axios from 'axios'
import { useEffect } from 'react';
import { useState } from 'react'
import { CryptoState } from './CryptoContext';
import { CoinList } from '../config/Api';
import { useNavigate } from 'react-router-dom';
import "./CoinTable.css"
import { Pagination } from '@material-ui/lab';
import { createTheme, ThemeProvider, Container, Typography, TextField, TableContainer, LinearProgress, Table, TableBody, TableRow, TableHead, TableCell} from '@material-ui/core';

function functionForPrice(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
const CoinsTable = () => {

    const [search, setSearch] = useState("");
    const {currency, symbol, coins, loading, fetchCoins} = CryptoState();
    const [page, setPage] = useState(1);
    
    useEffect(() => {
        fetchCoins();
    }, [currency]);
    const darkTheme = createTheme({
        palette: {
            primary: {
                main: "#fff",
            },
            type: "dark",
        },
    });
    const handleSearch = () => {
        return coins.filter(
            (coin) =>
                coin.name.toLowerCase().includes(search) ||
                coin.symbol.toLowerCase().includes(search)
        )
    }
    useEffect(()=>{
        setPage(1);
    },[search])
    const navigate = useNavigate();
    return (
        <ThemeProvider
            theme={darkTheme} >
            <Container style={{ textAlign: "center" }}>
                <Typography variant="h4"
                    style={{ margin: 18, fontFamily: "Montserrat" }}
                >
                    Cryptocurrency prices by market cap
                </Typography>
                <TextField label="Search for Crypto Currency.." variant='outlined'
                    style={{ marginBottom: 20, width: "100%" }}
                    // value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <TableContainer>
                    {
                        loading ? (
                            <LinearProgress style={{ backgroundColor: "green" }} />
                        ) : (
                            <>
                                <Table>
                                    <TableHead style={{ backgroundColor: "rgb(256,256,256)" }}>
                                        <TableRow>
                                            {["Coin", "Price", "24h Change", "Market Cap"].map((head) => (
                                                <TableCell
                                                    style={{
                                                        color: "black",
                                                        fontWeight: 600,
                                                        fontFamily: 'Montserrat',
                                                    }}
                                                    key={head}
                                                    align={head === "Coin" ? "" : "right"}
                                                >
                                                    {head}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {handleSearch() 
                                        .slice((page -  1 )*10, (page-1)*10 + 10)
                                        .map((e) => {
                                            const profit = e.price_change_percentage_24h >= 0;
                                            return (
                                                <TableRow
                                                onClick={() => navigate(`/coin/${e.id}`)}
                                                    className="fortablerow"
                                                    key={e.name}
                                                >
                                                    <TableCell component='th' scope='row'
                                                        style={{
                                                            display: "flex",
                                                            gap: 15,
                                                        }}>
                                                        <img
                                                            src={e?.image}
                                                            alt={e.name}
                                                            height="50"
                                            
                                                            style={{ marginBottom: 10 ,cursor:"pointer"}}

                                                        />
                                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                                            <span style={{
                                                                textTransform: "uppercase",
                                                                fontSize: 22,

                                                            }}>
                                                                {e.symbol}

                                                            </span>
                                                            <span style={{ color: "darkgrey" }}>{e.name}</span>

                                                        </div>

                                                    </TableCell>
                                                    <TableCell align='right'
                                                        style={{
                                                            fontWeight: 500,
                                                        }}
                                                    >
                                                        {symbol} {functionForPrice(e.current_price.toFixed(2))}
                                                    </TableCell>

                                                    <TableCell align='right'
                                                        style={{
                                                            color: profit > 0 ? "rgb(14,203,129)" : "red",
                                                            fontWeight: 500,
                                                        }}
                                                    >
                                                        <span className={e.price_change_percentage_24h >= 0 ? 'green' : 'red'}>
                                                            {e.price_change_percentage_24h >= 0 ? `+${e.price_change_percentage_24h?.toFixed(2)}%` : `${e.price_change_percentage_24h?.toFixed(2)}%`}

                                                        </span>
                                                    </TableCell>
                                                    <TableCell align='right'
                                                        style={{
                                                            fontWeight: 500,
                                                        }}
                                                    >
                                                        {symbol} {functionForPrice(e.market_cap.toString().slice(0,-6)
                                                        )}
                                                        M
                                                    </TableCell>

                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </>
                        )
                    }
                </TableContainer>
                <Pagination
                className='pagination'
                style={{
                    padding:20,
                    width:"100%",
                    display:"flex",
                    justifyContent:"center",
                }}
                    count={(handleSearch()?.length/10).toFixed(0)}
                    onChange = {(_, value)=>{
                        setPage(value);
                        window.scroll(0, 450);
                    }}
                    />

            </Container>
        </ThemeProvider>
    )
}

export default CoinsTable
