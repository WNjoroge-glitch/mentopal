import './App.css';
import React,{useState,useEffect} from 'react';
import { Routes } from './Routes/routes';
import {AuthProvider} from './context/auth';



function App() {
  
  return (
    <div>
      <AuthProvider>
      <Routes/>
      </AuthProvider>
      
      
      </div>
  );
}

export default App;
