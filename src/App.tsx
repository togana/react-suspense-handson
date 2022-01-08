import './App.css'
import React from 'react'

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const AlwaysSuspend: React.VFC = () => {
  throw sleep(1000);
};

function App() {
  return (
    <div className="text-center">
      <h1 className="text-2xl">React App!</h1>
      <AlwaysSuspend />
    </div>
  )
}

export default App
