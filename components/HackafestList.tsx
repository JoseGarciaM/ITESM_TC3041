/* eslint-disable camelcase */
import Link from 'next/link';
import {Image} from 'cloudinary-react';
import {HackafestsQuery_hackafests} from 'graphql/mutations/HackafestQuery';

interface IProps {
  hackafests: HackafestsQuery_hackafests[];
  setHighlightedId: (id: string | null) => void;
}

export default function HackafestList({hackafests, setHighlightedId}: IProps) {
  return (
    <>
      {hackafests.map((hackafest) => (
        <Link key={hackafest.id} href={`/hackafests/${hackafest.id}`}>
          <div
            className="px-6 pt-4 cursor-pointer flex flex-wrap"
            onMouseEnter={() => setHighlightedId(hackafest.id)}
            onMouseLeave={() => setHighlightedId(null)}
          >
            <div className="sm:w-full md:w-1/2">
              <Image
                cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
                publicId={hackafest.publicId}
                alt={hackafest.address}
                secure
                dpr="auto"
                quality="auto"
                width={350}
                height={Math.floor((9 / 16) * 350)}
                crop="fill"
                gravity="auto"
              />
            </div>
            <div className="sm:w-full md:w-1/2 sm:pl-0 md:pl-4">
              <h2>{hackafest.title}</h2>
              <p>{hackafest.address}</p>
              <p>{hackafest.date}</p>
              <p>{hackafest.time}</p>
            </div>
          </div>
        </Link>
      ))}
    </>
  );
}
