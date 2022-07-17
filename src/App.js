import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Components/Header';
import Home from './Components/Home';
import Coin from './Components/Coin';
function App() {
  return (
    <Router>
      <Header/>
      <Routes>
        <Route exact path="/" element={<Home/>}></Route>   
        <Route exact path="/coin/:id" element={<Coin/>}></Route>   
         
      </Routes>
    </Router>
  );
}

export default App;
