import {useRef, useState} from 'react';
import Link from 'next/link';
import {Image} from 'cloudinary-react';
import ReactMapGL, {Marker, Popup, ViewState} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {useLocalState} from 'hooks/useLocalState';
import {HackafestsQuery_hackafests} from 'src/generated/HousesQuery';
import {SearchBox} from './SearchBox';

interface IProps {
  setDataBounds: (bounds: string) => void;
  hackafests: HackafestsQuery_hackafests[];
  highlightedId: string | null;
}

export default function Map({setDataBounds, hackafests, highlightedId}: IProps) {
  const [selected, setSelected] = useState<HackafestsQuery_hackafests | null>(null);
  const mapRef = useRef<ReactMapGL | null>(null);
  const [viewport, setViewport] = useLocalState<ViewState>('viewport', {
    latitude: 19.4326,
    longitude: 99.1332,
    zoom: 10,
  });

  return (
    <div>
      <ReactMapGL
        {...viewport}
        width="100%"
        height="100%"
        mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN}
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
        ref={(instance) => (mapRef.current = instance)}
        minZoom={5}
        maxZoom={15}
        onLoad={() => {
          if (mapRef.current) {
            const bounds = mapRef.current.getMap().getBounds();
            setDataBounds(JSON.stringify(bounds.toArray()));
          }
        }}
        onInteractionStateChange={(extra) => {
          if (!extra.isDragging && mapRef.current) {
            const bounds = mapRef.current.getMap().getBounds();
            setDataBounds(JSON.stringify(bounds.toArray()));
          }
        }}
      >
        <div>
          <SearchBox
            defaultValue=""
            onSelectAddress={(_address, latitude, longitude) => {
              if (latitude && longitude) {
                setViewport((old) => ({
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
                    '/home-color.svg' :
                    '/home-solid.svg'
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
              <Link href={`/houses/${selected.id}`}>
                <a>View House</a>
              </Link>
            </div>
          </Popup>
        )}
      </ReactMapGL>
    </div>
  );
}
