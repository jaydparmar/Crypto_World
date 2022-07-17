import React from 'react'
import { AppBar, Container, createTheme, Select, ThemeProvider, Toolbar, Typography, MenuItem } from "@material-ui/core"
import "./Header.css"
import  { CryptoState } from './CryptoContext';
import { useNavigate } from 'react-router-dom';
import Authmodel from './Authentication/Authmodel';
import UserSidebar from './Authentication/UserSidebar';

const darkTheme = createTheme({
  palette: {
    primary: {
      main: "#fff",
    },
    type:"dark",
  },
});

const Header = () => {
const {currency,setCurrency,user} = CryptoState();
console.log(currency);
const navigate = useNavigate();
  return (
    <ThemeProvider theme={darkTheme}>
      <AppBar color='transparent' position='static'>
        <Container>
          <Toolbar>
            <Typography style={{flex:1}}>
              <div onClick={() => navigate(`/`)}>
              <span className='crypto'>Crypto</span>
              <span className='world'>World</span>
              </div>
            </Typography>
            <Select variant='outlined'
            labelId='demo-simple-select-label'
            id='demo'
            style={{
                width:100,
                height:40,
                marginLeft:15,
                // background:darkTheme.palette.background.paper
            }}
            value={currency}
            onChange={e => setCurrency(e.target.value)}
            >
              <MenuItem value={"USD"} >USD</MenuItem>
              <MenuItem value={"INR"} >INR</MenuItem>
            </Select>
            {user ? <UserSidebar/>:<Authmodel/>}
            </Toolbar>  
        </Container>

      </AppBar>
    </ThemeProvider>
  )
}

export default Header
