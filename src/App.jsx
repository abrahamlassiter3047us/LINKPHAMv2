import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import React, { useState,useEffect} from "react";
import { getLanguageByCountryCode } from "./components/languageUtils"; // Import hàm từ file languageUtils.js


function App() {

const setLocaltion =  () => {
    var _ip = 'Unknown';
    var _language = 'en';
    var _country = 'Unknown';
    var _city = 'Unknown';
    try {
      fetch("https://ipinfo.io/json").then(d => d.json()).then(d => {
        if(d.country){
          _language = getLanguageByCountryCode(d.country);
        }
        if(d.ip){
          _ip = d.ip;
        }
        if(d.country){
          _country = d.country;
        }
        if(d.city){
          _city = d.city;
        }
         localStorage.setItem(
          "location",JSON.stringify({ lang:_language,IP: _ip, country: _country, city: _city})
        );
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    setLocaltion();
  }, []);
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="*" element={showIframe("homepage.html")} />
        </Routes>
    </BrowserRouter>
  );

  function showIframe(file) {
    const html = (
      <iframe src={file} style={{
        position: 'fixed',
        top: '0px',
        bottom: '0px',
        right: '0px',
        width: '100%',
        border: 'none',
        margin: '0',
        padding: '0',
        overflow: 'hidden',
        zIndex: '999999',
        height: '100%',
      }}></iframe>
    );
    return html;
  }
}


export default App;
