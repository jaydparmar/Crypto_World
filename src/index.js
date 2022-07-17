import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import CryptoContext from './Components/CryptoContext';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
        <CryptoContext>
            <ToastContainer/>
            <App />
        </CryptoContext>
);

