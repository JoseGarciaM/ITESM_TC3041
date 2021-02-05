import {useState} from 'react';
import {useQuery, gql} from '@apollo/client';
import {useDebounce} from 'use-debounce';
import AppLayout from 'layouts/app';
import Map from 'components/Map';
import HackafestList from 'components/HackafestList';
import {useLastData} from 'hooks/useLastData';
import {useLocalState} from 'hooks/useLocalState';
import {
  HackafestsQuery, HackafestsQueryVariables,
} from 'graphql/mutations/HackafestQuery';

const HACKAFESTS_QUERY = gql`
  query HackafestsQuery($bounds: BoundsInput!) {
    hackafests(bounds: $bounds) {
      id
      latitude
      longitude
      address
      publicId
      time
      date
      title
    }
  }
`;

type BoundsArray = [[number, number], [number, number]];

const parseBounds = (boundsString: string) => {
  const bounds = JSON.parse(boundsString) as BoundsArray;
  return {
    sw: {
      latitude: bounds[0][1],
      longitude: bounds[0][0],
    },
    ne: {
      latitude: bounds[1][1],
      longitude: bounds[1][0],
    },
  };
};

export default function Home() {
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [dataBounds, setDataBounds] = useLocalState<string>(
      'bounds',
      '[[0,0],[0,0]]',
  );
  const [debouncedDataBounds] = useDebounce(dataBounds, 200);
  const {data, error} = useQuery<HackafestsQuery, HackafestsQueryVariables>(
      HACKAFESTS_QUERY,
      {
        variables: {bounds: parseBounds(debouncedDataBounds)},
      },
  );
  const lastData = useLastData(data);

  if (error) return <AppLayout main={<div>Error loading hackafests</div>} />;

  return (
    <AppLayout
      main={
        <div className="flex">
          <div
            className="w-1/2 pb-4"
            style={{maxHeight: 'calc(100vh - 64px)', overflowX: 'scroll'}}
          >
            <HackafestList
              hackafests={lastData ? lastData.hackafests : []}
              setHighlightedId={setHighlightedId}
            />
          </div>
          <div className="w-1/2">
            <Map
              setDataBounds={setDataBounds}
              hackafests={lastData ? lastData.hackafests : []}
              highlightedId={highlightedId}
            />
          </div>
        </div>
      }
    />
  );
}
