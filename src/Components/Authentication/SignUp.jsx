import { Box, TextField, Button } from '@mui/material';
import React, { useRef, useState } from 'react'
import { Auth } from '../../firebase';
import { toast } from 'react-toastify'
import { createUserWithEmailAndPassword } from 'firebase/auth';
const SignUp = ({ handleClose }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = async(e)=>{
        if (password != confirmPassword) {
            toast.error('Password Does Not match');
            return;
        }
        try {
            await createUserWithEmailAndPassword(Auth, email, password)
              .then((result) => {
                toast.success(`Sign Up successful.Welcome ${result.user.email}`);
                handleClose();
              })
              .catch((e) => {
                if (e.code === "auth/weak-password") {
                  toast.error("The password provided is too weak.");
                } else if (e.code === "auth/email-already-in-use") {
                  toast.error("The account already exists for that email.");
                } else if (e.code === "auth/operation-not-allowed") {
                  toast.error("There is a problem with auth service config :/");
                } else if (e.code === "auth/weak-password") {
                  toast.error("Please type stronger password");
                } else {
                  toast.error("auth error " + e.toString());
                }
              });
          } catch (error) {
            return toast.error(error);
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

            <TextField
                variant='outlined'
                type="password"
                label="Enter Confirm PassWord"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
            />
            <Button
                variant="contained"
                size="larger"
                style={{
                    background: "rgb(255,255,255)",
                    color: "black",

                }}
                onClick={handleSubmit}
            >
                Sign Up

            </Button>
        </Box>
    )
}

export default SignUp