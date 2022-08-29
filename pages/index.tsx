import type {NextPage} from 'next';
import Head from 'next/head';
import {useRouter} from 'next/router';

const Home: NextPage = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push('/dashboard');
  };

  return (
    <div>
      <Head>
        <title>Polkadot Anti-scam Dashboard</title>
        <meta name="Created by Polkadot anti-scam team" content="Anti-scam dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex justify-center">
        <div className="m-0 absolute top-[50%] -translate-y-2/4 flex flex-col justify-center items-center">
          <h1>Welcome to Polkadot Anti-scam Dashboard!</h1>
          <button onClick={() => handleClick()}>Go to dashboard</button>
        </div>
      </main>
    </div>
  );
};

export default Home;
