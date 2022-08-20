import type {NextPage} from 'next';
import Head from 'next/head';
import Image from 'next/image';

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Polkadot Anti-scam Dashboard</title>
        <meta name="Created by Polkadot anti-scam team" content="Anti-scam dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Welcome to Polkadot Anti-scam Dashboard!</h1>
      </main>
    </div>
  );
};

export default Home;
