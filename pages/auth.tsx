import AppLayout from 'layouts/app';
import FirebaseAuth from 'components/FirebaseAuth';
import {GetServerSideProps, NextApiRequest} from 'next';
import {loadIdToken} from 'firebase/admin';

export default function Auth() {
  return <AppLayout main={<FirebaseAuth />} />;
}

export const getServerSideProps: GetServerSideProps = async ({req, res}) => {
  const uid = await loadIdToken(req as NextApiRequest);

  if (uid) {
    res.setHeader('location', '/');
    res.statusCode = 302;
    res.end();
  }

  return {props: {}};
};
