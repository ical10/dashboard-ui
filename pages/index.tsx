import type {NextPage, GetServerSidePropsContext} from 'next';
import {getSession} from 'next-auth/react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import {useRouter} from 'next/router';

const ExtensionAccounts = dynamic(
  () => import('src/components/ExtensionAccounts/ExtensionAccounts'),
  {
    ssr: false,
  },
);

const Home: NextPage = () => {
  const router = useRouter();

  const handleGoToDashboard = () => {
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
          <ExtensionAccounts onLoginSuccess={handleGoToDashboard} />
        </div>
      </main>
    </div>
  );
};

export default Home;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    };
  }

  return {
    props: {session},
  };
}
