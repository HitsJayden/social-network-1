import Head from 'next/head'
import React from 'react';

import HomePage from '../components/HomePage';

export default function Home() {
  return (
    <>
    <Head>
      <title>social network</title>
      <meta name="description" content="Generated by create next app" />
    </Head>

    <HomePage />
    </>
  )
};