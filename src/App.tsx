import './App.css'
import React, { Suspense, useState, useMemo } from 'react'

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchData1(): Promise<string> {
  const count = Math.random() * 1000;
  await sleep(count);
  return `Hello, ${(count).toFixed(0)}`;
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

const dataMap: Map<string, unknown> = new Map();

function useData<T>(cacheKey: string, fetch: () => Promise<T>): T {
  const cachedData = dataMap.get(cacheKey) as T | undefined;
  if (cachedData === undefined) {
    throw fetch().then((d) => dataMap.set(cacheKey, d));
  }
  return cachedData;
}

const DataLoader1: React.VFC = () => {
  const data = useData("DataLoader1", fetchData1);
  return (
    <div>
      <div>Data is {data}</div>
    </div>
  );
};

const DataLoader2: React.VFC = () => {
  const data = useData("DataLoader2", fetchData1);
  return (
    <div>
      <div>Data is {data}</div>
    </div>
  );
};

type LoadableState<T> =
  | {
      status: "pending";
      promise: Promise<T>;
    }
  | {
      status: "fulfilled";
      data: T;
    }
  | {
      status: "rejected";
      error: unknown;
    };

export class Loadable<T> {
  #state: LoadableState<T>;
  constructor(promise: Promise<T>) {
    this.#state = {
      status: "pending",
      promise: promise.then(
        (data) => {
          this.#state = {
            status: "fulfilled",
            data,
          };
          return data;
        },
        (error) => {
          this.#state = {
            status: "rejected",
            error,
          };
          throw error;
        }
      ),
    };
  }
  getOrThrow(): T {
    switch (this.#state.status) {
      case "pending":
        throw this.#state.promise;
      case "fulfilled":
        return this.#state.data;
      case "rejected":
        throw this.#state.error;
    }
  }
}

const DataLoader: React.VFC<{
  data: Loadable<string>;
}> = ({ data }) => {
  const value = data.getOrThrow();
  return (
    <div>
      <div>Data is {value}</div>
    </div>
  );
};

function App() {
  const [data1] = useState(() => new Loadable(fetchData1()));
  const [data2] = useState(() => new Loadable(fetchData1()));
  const [data3] = useState(() => new Loadable(fetchData1()));
  return (
    <div className="text-center">
      <h1 className="text-2xl">React App!</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <DataLoader data={data1} />
      </Suspense>
      <Suspense fallback={<p>Loading...</p>}>
        <DataLoader data={data2} />
      </Suspense>
      <Suspense fallback={<p>Loading...</p>}>
        <DataLoader data={data3} />
      </Suspense>
    </div>
  );
}

export default App
