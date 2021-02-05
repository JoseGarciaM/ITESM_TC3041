/* eslint-disable max-len */
import {useRouter} from 'next/router';
import {Image} from 'cloudinary-react';
import {useQuery, gql} from '@apollo/client';
import AppLayout from 'layouts/app';
import HackafestNav from 'components/HackafestNav';
import SingleMap from 'components/SingleMap';
import {
  ShowHackafestQuery,
  ShowHackafestQueryVariables,
} from 'graphql/mutations/ShowHackafestQuery';

const SHOW_HACKAFEST_QUERY = gql`
  query ShowHackafestQuery($id: String!) {
    hackafest(id: $id) {
      id
      userId
      address
      publicId
      title
      time
      date
      latitude
      longitude
      nearby {
        id
        latitude
        longitude
      }
    }
  }
`;

export default function ShowHackafest() {
  const {
    query: {id},
  } = useRouter();

  if (!id) return null;
  return <HackafestData id={id as string} />;
}

function HackafestData({id}: { id: string }) {
  const {data, loading} = useQuery<ShowHackafestQuery, ShowHackafestQueryVariables>(
      SHOW_HACKAFEST_QUERY,
      {variables: {id}},
  );

  if (loading || !data) return <AppLayout main={<div>Loading...</div>} />;
  if (!data.hackafest) {
    return <AppLayout main={<div>Unable to load hackafest {id}</div>} />;
  }

  const {hackafest} = data;

  return (
    <AppLayout
      main={
        <div className="sm:block md:flex">
          <div className="sm:w-full md:w-1/2 p-4">
            <HackafestNav hackafest={hackafest} />

            <h1 className="text-3xl my-2">{hackafest.address}</h1>

            <Image
              className="pb-2"
              cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
              publicId={hackafest.publicId}
              alt={hackafest.address}
              secure
              dpr="auto"
              quality="auto"
              width={900}
              height={Math.floor((9 / 16) * 900)}
              crop="fill"
              gravity="auto"
            />

            <p>{hackafest.title}</p>
          </div>
          <div className="sm:w-full md:w-1/2">
            <SingleMap hackafest={hackafest} nearby={hackafest.nearby} />
          </div>
        </div>
      }
    />
  );
}
