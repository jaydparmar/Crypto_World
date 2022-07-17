import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { CryptoState } from '../CryptoContext';
import Avatar from '@mui/material/Avatar';
import './UserSidebar.css'
import Button from '@mui/material/Button';
import { signOut } from 'firebase/auth';
import { Auth, db } from '../../firebase';
import {toast} from 'react-toastify'
import {AiFillDelete} from 'react-icons/ai'
import { doc, setDoc } from 'firebase/firestore';

function functionForPrice(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
export default function UserSidebar() {
  const [state, setState] = React.useState({
    right: false,
  });
  const {user, watchlist, coins, symbol}= CryptoState();
  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const RemoveWatchlist = async(coin) =>{
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
  const logout = () =>{
    signOut(Auth);
    toast.success('Logout Successfully');
  }
  return (
    <div>
      {['right'].map((anchor) => (
        <React.Fragment key={anchor}>
            <Avatar onClick={toggleDrawer(anchor, true)}
                style={{
                    height:38,
                    width:38,
                    marginLeft:15,
                    cursor:"pointer",
                    backgroundColor:"black",
                    border:"1px solid white"
                }}
                src={user.photoURL}
                alt={user.displayName || user.email}
                />
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            <div className="container">
                <div className="profile">
                    <Avatar
                        id='picture'
                        src={user.photoURL}
                        alt={user.displayName || user.email}
                    />
                    <span
                    style={{
                        width:"100%",
                        fontSize:25,
                        textAlign:"center",
                        fontWeight:"bolder",
                        WordWrap:"break-word",
                    }}>
                        {user.displayName || user.email}
                    </span>
                    <div className="watchlist">
                        <span
                        style={{
                            fontSize:15,
                            textShadow:"0 0 5px black",
                        }}>
                            Watchlist
                        </span>
                        {
                          coins.map(coin =>{
                            if(watchlist.includes(coin.id)){
                              return (
                                <div className='watchlistcoin'>
                                  <span>{coin.name}</span>
                                  <span 
                                  style={{
                                    display:"flex",
                                    gap:8,
                                  }}>
                                    {symbol}
                                    {functionForPrice(coin.current_price.toFixed(2))}
                                    <AiFillDelete
                                    style={{
                                      cursor:"pointer",
                                    }}
                                    fontSize="16"
                                    onClick={()=>RemoveWatchlist(coin)}
                                    />
                                  </span>
                                </div>
                              )
                                  }
                          })
                        }
                    </div>
                </div>
                <Button
                variant='contained'
                className='logout'
                onClick={logout}>
                    LogOut
                </Button>
            </div>
            
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
