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

const DataLoader: React.VFC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<string | null>(null);

  const _ = useMemo(() => {
    if (loading) {
      console.log("loading is true");
    }
    return 1;
  }, [loading]);

  // ローディングフラグが立っていてdataがまだ無ければローディングを開始する
  if (loading && data === null) {
    throw fetchData1().then(setData);
  }
  // データがあればそれを表示
  return (
    <div>
      <div>Data is {data}</div>
      <button className="border p-1" onClick={() => setLoading(true)}>
        load
      </button>
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
