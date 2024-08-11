import { Provider } from 'react-redux';
import { store } from './store/store';
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useState } from "react";
import MainElements from "./components/mainelements/MainElements";
import Login from "./components/login/Login"
import Search from "./components/search/Search"
import SearchResult from "./components/searchresult/SearchResult"

export const MyContext = React.createContext();

function App() {
  const [signedIn, setSignedIn] = useState(false)

useEffect(() => {
  let expirationTime
  const currentTime = (new Date()).getTime();
  if (localStorage.getItem('accessToken')) {
    setSignedIn(true)
    expirationTime = new Date(JSON.parse(localStorage.getItem('accessToken')).expire).getTime()
    if (currentTime > expirationTime) {
      setSignedIn(false)
      localStorage.removeItem('accessToken');
      localStorage.removeItem('histograms');
      localStorage.removeItem('Find')
    }
  } 
}, [])

return (
  <Provider store={store}>
    <MyContext.Provider value={[signedIn, setSignedIn]}>
      <Router>
        <Routes>
          <Route path="/" element={<MainElements />} />
          <Route path="/login" element={<Login />} />
          <Route path="/search" element={<Search />} />
          <Route path="/searchresult" element={<SearchResult />} />
        </Routes>
      </Router>
    </MyContext.Provider>
  </Provider>
);
}

export default App;
