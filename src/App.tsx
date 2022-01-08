import './App.css'
import React, { Suspense, useState, useMemo } from 'react'

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchData1(): Promise<string> {
  await sleep(1000);
  return `Hello, ${(Math.random() * 1000).toFixed(0)}`;
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

const RenderingNotifier: React.VFC<{
  name: string;
}> = ({ name }) => {
  console.log(`${name} is rendered`);

  return null;
};

let data: string | undefined;

function useData1(): string {
  // dataがまだ無ければローディングを開始する
  if (data === undefined) {
    throw fetchData1().then((d) => (data = d));
  }
  return data;
}

const DataLoader: React.VFC = () => {
  const data = useData1();
  return (
    <div>
      <div>Data is {data}</div>
    </div>
  );
};

function App() {
  return (
    <div className="text-center">
      <h1 className="text-2xl">React App!</h1>
      <RenderingNotifier name="outside-Suspense" />
      <Suspense fallback={<p>Loading...</p>}>
        <DataLoader />
      </Suspense>
    </div>
  )
}

export default App
