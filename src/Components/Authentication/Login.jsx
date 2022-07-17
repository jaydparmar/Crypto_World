import { Box, TextField, Button } from '@mui/material';
import React, { useState } from 'react'
import { toast } from 'react-toastify';
import { Auth } from '../../firebase';
import {signInWithEmailAndPassword} from 'firebase/auth'

const Login = ({handleClose}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const handleSubmit = async() =>{
        if(!email || !password)
        {
            return toast.error('Please fill all the fields')
        }
        try {
            await signInWithEmailAndPassword(Auth, email, password)
              .then((result) => {
                toast.success(`Login successful.Welcome ${result.user.email}`);
                handleClose();
              })
              .catch((e) => {
                if (e.code === "auth/wrong-password") {
                  toast.error("Password is Incorrect");
                } else if (e.code === "auth/user-not-found") {
                  toast.error("User Doesn't exist");
                } else {
                  toast.error("auth error " + e.toString());
                }
              });
          } catch (error) {
            toast.error(error);
          }

    }
  return (
    <Box
            p={3}
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
            }}
        >
            <TextField
                variant='outlined'
                type="email"
                label="Enter Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
            />
            <TextField
                variant='outlined'
                type="password"
                label="Enter Your PassWord"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
            />

            <Button
            variant="contained"
            size="larger"
            style={{
                background:"rgb(255,255,255)",
                color:"black",
        
        }}
            onClick={handleSubmit}
            >
                Login
            </Button>
        </Box>
  )
}

export default Login