import type {AppProps} from 'next/app';
import Head from 'next/head';
import 'styles/global.css';
import {ApolloProvider} from '@apollo/client';
import {useApollo} from 'apollo/client';
import {AuthProvider} from 'context/user';

export default function MyApp({Component, pageProps}: AppProps) {
  const client = useApollo();

  return (
    <AuthProvider>
      <ApolloProvider client={client}>
        <Head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta
            name="viewport"
            content="
            width=device-width,
            initial-scale=1,
            viewport-fit=cover
          "
          />
          <link
            rel="preload"
            href="/fonts/inter-var-latin.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <link rel="manifest" href="/manifest.webmanifest" />
          <meta content="#ffffff" name="theme-color" />
          <meta content="#ffffff" name="msapplication-TileColor" />
        </Head>
        <Component {...pageProps} />
      </ApolloProvider>
    </AuthProvider>
  );
}
