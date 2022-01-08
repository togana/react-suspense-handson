import './App.css'
import React, { Suspense } from 'react'

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const AlwaysSuspend: React.VFC = () => {
  console.log("AlwaysSuspend is rendered");
  throw sleep(1000);
};

const SometimesSuspend: React.VFC = () => {
  if (Math.random() < 0.5) {
    throw sleep(1000);
  }
  return <p>Hello, world!</p>;
};

function App() {
  return (
    <div className="text-center">
      <h1 className="text-2xl">React App!</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <SometimesSuspend />
      </Suspense>
    </div>
  )
}

export default App
