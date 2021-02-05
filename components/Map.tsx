/* eslint-disable camelcase */
import {useRef, useState} from 'react';
import Link from 'next/link';
import {Image} from 'cloudinary-react';
import ReactMapGL, {Marker, Popup} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {useLocalState} from 'hooks/useLocalState';
import {HackafestsQuery_hackafests} from 'graphql/mutations/HackafestQuery';
import {SearchBox} from './SearchBox';

interface PropsInterface {
  setDataBounds: (bounds: string) => void;
  hackafests: HackafestsQuery_hackafests[];
  highlightedId: string | null;
}

// eslint-disable-next-line max-len
export default function Map({setDataBounds, hackafests, highlightedId}: PropsInterface) {
  // eslint-disable-next-line max-len
  const [selected, setSelected] = useState<HackafestsQuery_hackafests | null>(null);
  const mapRef = useRef<ReactMapGL | null>(null);
  const [viewport, setViewport] = useLocalState('viewport', {
    latitude: 43,
    longitude: -79,
    zoom: 10,
  });

  return (
    <div className="text-black relative">
      <ReactMapGL
        {...viewport}
        width="100%"
        height="calc(100vh - 64px)"
        mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onViewportChange={(nextViewport:any) => setViewport(nextViewport)}
        ref={(instance) => (mapRef.current = instance)}
        minZoom={5}
        maxZoom={15}
        onLoad={() => {
          if (mapRef.current) {
            const bounds = mapRef.current.getMap().getBounds();
            setDataBounds(JSON.stringify(bounds.toArray()));
          }
        }}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onInteractionStateChange={(extra: any) => {
          if (!extra.isDragging && mapRef.current) {
            const bounds = mapRef.current.getMap().getBounds();
            setDataBounds(JSON.stringify(bounds.toArray()));
          }
        }}
      >
        <div className="absolute top-0 w-full z-10 p-4">
          <SearchBox
            defaultValue=""
            onSelectAddress={(_address, latitude, longitude) => {
              if (latitude && longitude) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                setViewport((old: any) => ({
                  ...old,
                  latitude,
                  longitude,
                  zoom: 12,
                }));
                if (mapRef.current) {
                  const bounds = mapRef.current.getMap().getBounds();
                  setDataBounds(JSON.stringify(bounds.toArray()));
                }
              }
            }}
          />
        </div>

        {hackafests.map((hackafest) => (
          <Marker
            key={hackafest.id}
            latitude={hackafest.latitude}
            longitude={hackafest.longitude}
            offsetLeft={-15}
            offsetTop={-15}
            className={highlightedId === hackafest.id ? 'marker-active' : ''}
          >
            <button
              style={{width: '30px', height: '30px', fontSize: '30px'}}
              type="button"
              onClick={() => setSelected(hackafest)}
            >
              <img
                src={
                  highlightedId === hackafest.id ?
                    '/svg/marker-color.svg' :
                    '/svg/marker-solid.svg'
                }
                alt="hackafest"
                className="w-8"
              />
            </button>
          </Marker>
        ))}

        {selected && (
          <Popup
            latitude={selected.latitude}
            longitude={selected.longitude}
            onClose={() => setSelected(null)}
            closeOnClick={false}
          >
            <div className="text-center">
              <h3 className="px-4">{selected.address.substr(0, 30)}</h3>
              <Image
                className="mx-auto my-4"
                cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
                publicId={selected.publicId}
                secure
                dpr="auto"
                quality="auto"
                width={200}
                height={Math.floor((9 / 16) * 200)}
                crop="fill"
                gravity="auto"
              />
              <Link href={`/hackafests/${selected.id}`}>
                <a>View Hackafest</a>
              </Link>
            </div>
          </Popup>
        )}
      </ReactMapGL>
    </div>
  );
}
