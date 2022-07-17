import React from "react";
import {
  Button,
  Typography,
  Box,
  Modal,
  Backdrop,
  Fade,
  AppBar,
  Tabs,
  Tab,
} from "@material-ui/core";
import "./Authmodel.css";
import Login from "./Login";
import SignUp from "./SignUp";
import GoogleButton from "react-google-button";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Auth } from "../../firebase"; 
import { toast } from "react-toastify";

const Authmodel = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const googleProvider = new GoogleAuthProvider();

  const signInWithGoogleHandler = () => {
    signInWithPopup(Auth, googleProvider)
      .then((res) => {
        toast.success(`Sign Up Successfull. Welcome ${res.user.email}`);
        console.log(res);
        handleClose();
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    borderRadius: 10,
    boxShadow: 24,
  };

  return (
    <div>
      <Button variant="contained" id="loginBtn" onClick={handleOpen}>
        Login
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <AppBar
              position="static"
              style={{
                backgroundColor: "transparent",
                color: "white",
              }}
            >
              <Tabs
                value={value}
                onChange={handleChange}
                variant="fullWidth"
                style={{ borderRadius: 10 }}
              >
                <Tab label="Login" />
                <Tab label="Sign Up" />
              </Tabs>
            </AppBar>
            {value === 0 && <Login handleClose={handleClose} />}
            {value === 1 && <SignUp handleClose={handleClose} />}
            <Box className="google">
              <span>OR</span>
              <GoogleButton
                style={{ width: "100%", outline: "none" }}
                onClick={signInWithGoogleHandler}
              />
            </Box>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default Authmodel;