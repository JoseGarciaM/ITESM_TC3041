import {useState} from 'react';
import Link from 'next/link';
import ReactMapGL, {Marker, NavigationControl} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface HackafestInterface {
  id: string;
  latitude: number;
  longitude: number;
}

interface PropsInterface {
  hackafest: HackafestInterface;
  nearby: HackafestInterface[];
}

export default function SingleMap({hackafest, nearby}: PropsInterface) {
  const [viewport, setViewport] = useState({
    latitude: hackafest.latitude,
    longitude: hackafest.longitude,
    zoom: 13,
  });

  return (
    <div className="text-black">
      <ReactMapGL
        {...viewport}
        width="100%"
        height="calc(100vh - 64px)"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onViewportChange={(nextViewport: any) => setViewport(nextViewport)}
        mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN}
        scrollZoom={false}
        minZoom={8}
      >
        <div className="absolute top-0 left-0 p-4">
          <NavigationControl showCompass={false} />
        </div>

        <Marker
          latitude={hackafest.latitude}
          longitude={hackafest.longitude}
          offsetLeft={-15}
          offsetTop={-15}
        >
          <button
            type="button"
            style={{width: '30px', height: '30px', fontSize: '30px'}}
          >
            <img src="/svg/marker-color.svg" className="w-8" alt="selected hackafest" />
          </button>
        </Marker>

        {nearby.map((near) => (
          <Marker
            key={near.id}
            latitude={near.latitude}
            longitude={near.longitude}
            offsetLeft={-15}
            offsetTop={-15}
          >
            <Link href={`/hackafests/${near.id}`}>
              <a style={{width: '30px', height: '30px', fontSize: '30px'}}>
                <img src="/svg/marker-solid.svg" className="w-8" alt="nearby hackafest" />
              </a>
            </Link>
          </Marker>
        ))}
      </ReactMapGL>
    </div>
  );
}
