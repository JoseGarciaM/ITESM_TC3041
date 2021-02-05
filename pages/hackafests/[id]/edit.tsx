/* eslint-disable max-len */
/* eslint-disable react/no-unescaped-entities */
import {GetServerSideProps, NextApiRequest} from 'next';
import {useRouter} from 'next/router';
import {useQuery, gql} from '@apollo/client';
import {loadIdToken} from 'lib/firebase/admin';
import AppLayout from 'layouts/app';
import HackafestForm from 'components/HackafestForm';
import {useAuth} from 'context/user';
import {
  EditHackafestQuery,
  EditHackafestQueryVariables,
} from 'graphql/mutations/EditHackafestQuery';

const EDIT_HACKAFEST_QUERY = gql`
  query EditHackafestQuery($id: String!) {
    hackafest(id: $id) {
      id
      userId
      address
      image
      publicId
      bedrooms
      latitude
      longitude
    }
  }
`;

export default function EditHackafest() {
  const {
    query: {id},
  } = useRouter();

  if (!id) return null;
  return <HackafestData id={id as string} />;
}

function HackafestData({id}: { id: string }) {
  const {user} = useAuth();
  const {data, loading} = useQuery<EditHackafestQuery, EditHackafestQueryVariables>(
      EDIT_HACKAFEST_QUERY,
      {variables: {id}},
  );

  if (!user) return <AppLayout main={<div>Please login</div>} />;
  if (loading) return <AppLayout main={<div>loading...</div>} />;
  if (data && !data.hackafest) {
    return <AppLayout main={<div>Unable to load hackafest</div>} />;
  }
  if (user.uid !== data?.hackafest?.userId) {
    return <AppLayout main={<div>You don't have permission</div>} />;
  }

  return <AppLayout main={<HackafestForm hackafest={data.hackafest} />} />;
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
