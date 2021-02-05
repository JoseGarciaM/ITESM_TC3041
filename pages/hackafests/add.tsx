import {GetServerSideProps, NextApiRequest} from 'next';
import {loadIdToken} from 'firebase/admin';
import AppLayout from 'layouts/app';
import HackafestForm from 'components/HackafestForm';

export default function Add() {
  return <AppLayout main={<HackafestForm />} />;
}

export const getServerSideProps: GetServerSideProps = async ({req, res}) => {
  const uid = await loadIdToken(req as NextApiRequest);

  if (!uid) {
    res.setHeader('location', '/auth');
    res.statusCode = 302;
    res.end();
  }

  return {props: {}};
};
