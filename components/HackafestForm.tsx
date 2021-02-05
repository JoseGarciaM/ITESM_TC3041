import {useState, useEffect, ChangeEvent} from 'react';
import {useForm} from 'react-hook-form';
import {useMutation, gql} from '@apollo/client';
import {useRouter} from 'next/router';
import Link from 'next/link';
import {Image} from 'cloudinary-react';
import {SearchBox} from './SearchBox';
import {
  CreateHackafestMutation,
  CreateHackafestMutationVariables,
} from 'graphql/mutations/CreateHackafestMutation';
import {
  UpdateHackafestMutation,
  UpdateHackafestMutationVariables,
} from 'graphql/mutations/UpdateHackafestMutation';
// eslint-disable-next-line max-len
import {CreateSignatureMutation} from 'graphql/mutations/CreateSignatureMutation';

const SIGNATURE_MUTATION = gql`
  mutation CreateSignatureMutation {
    createImageSignature {
      signature
      timestamp
    }
  }
`;

const CREATE_HACKAFEST_MUTATION = gql`
  mutation CreateHackafestMutation($input: HackafestInput!) {
    createHackafest(input: $input) {
      id
    }
  }
`;

const UPDATE_HACKAFEST_MUTATION = gql`
  mutation UpdateHackafestMutation($id: String!, $input: HackafestInput!) {
    updateHackafest(id: $id, input: $input) {
      id
      image
      publicId
      latitude
      longitude
      time
      date
      title
      address
    }
  }
`;

interface UploadImageResponseInterface {
  // eslint-disable-next-line camelcase
  secure_url: string;
}

async function uploadImage(
    image: File,
    signature: string,
    timestamp: number,
): Promise<UploadImageResponseInterface> {
  const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;

  const formData = new FormData();
  formData.append('file', image);
  formData.append('signature', signature);
  formData.append('timestamp', timestamp.toString());
  formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_KEY ?? '');

  const response = await fetch(url, {
    method: 'post',
    body: formData,
  });
  return response.json();
}

interface FormDataInterface {
  address: string;
  latitude: number;
  longitude: number;
  time: string;
  date: string;
  title: string;
  image: FileList;
}

interface HackafestInterface {
  id: string;
  address: string;
  latitude: number;
  longitude: number;
  time: string;
  date: string;
  title: string;
  image: string;
  publicId: string;
}

interface PropsInterface {
  hackafest?: HackafestInterface;
}

export default function HackafestForm({hackafest}: PropsInterface) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>();
  const {register, handleSubmit, setValue, errors, watch} = useForm<
    FormDataInterface
  >({
    defaultValues: hackafest ?
      {
        address: hackafest.address,
        latitude: hackafest.latitude,
        longitude: hackafest.longitude,
        time: hackafest.time,
        date: hackafest.date,
        title: hackafest.title,
      } :
      {},
  });
  const address = watch('address');
  const [createSignature] = useMutation<CreateSignatureMutation>(
      SIGNATURE_MUTATION,
  );
  const [createHackafest] = useMutation<
    CreateHackafestMutation,
    CreateHackafestMutationVariables
  >(CREATE_HACKAFEST_MUTATION);
  const [updateHackafest] = useMutation<
    UpdateHackafestMutation,
    UpdateHackafestMutationVariables
  >(UPDATE_HACKAFEST_MUTATION);

  useEffect(() => {
    register({name: 'address'}, {required: 'Please enter your address'});
    register({name: 'latitude'}, {required: true, min: -90, max: 90});
    register({name: 'longitude'}, {required: true, min: -180, max: 180});
  }, [register]);

  const handleCreate = async (data: FormDataInterface) => {
    const {data: signatureData} = await createSignature();
    if (signatureData) {
      const {signature, timestamp} = signatureData.createImageSignature;
      const imageData = await uploadImage(data.image[0], signature, timestamp);

      const {data: hackafestData} = await createHackafest({
        variables: {
          input: {
            address: data.address,
            image: imageData.secure_url,
            coordinates: {
              latitude: data.latitude,
              longitude: data.longitude,
            },
            time: data.time,
            date: data.date,
            title: data.title,
          },
        },
      });

      if (hackafestData?.createHackafest) {
        router.push(`/hackafests/${hackafestData.createHackafest.id}`);
      }
    }
  };

  // eslint-disable-next-line max-len
  const handleUpdate = async (currentHackafest: HackafestInterface, data: FormDataInterface) => {
    let image = currentHackafest.image;

    if (data.image[0]) {
      const {data: signatureData} = await createSignature();
      if (signatureData) {
        const {signature, timestamp} = signatureData.createImageSignature;
        const imageData = await uploadImage(
            data.image[0],
            signature,
            timestamp,
        );
        image = imageData.secure_url;
      }
    }

    const {data: hackafestData} = await updateHackafest({
      variables: {
        id: currentHackafest.id,
        input: {
          address: data.address,
          image: image,
          coordinates: {
            latitude: data.latitude,
            longitude: data.longitude,
          },
          time: data.time,
          date: data.date,
          title: data.title,
        },
      },
    });

    if (hackafestData?.updateHackafest) {
      router.push(`/hackafests/${currentHackafest.id}`);
    }
  };

  const onSubmit = (data: FormDataInterface) => {
    setSubmitting(false);
    if (hackafest) {
      handleUpdate(hackafest, data);
    } else {
      handleCreate(data);
    }
  };

  return (
    <form className="mx-auto max-w-xl py-4" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl">
        {hackafest ? `Editing ${hackafest.address}` : 'Add a New Hackafest'}
      </h1>

      <div className="mt-4">
        <label htmlFor="search" className="block">
          Search for your address
        </label>
        <SearchBox
          onSelectAddress={(address, latitude, longitude) => {
            setValue('address', address);
            setValue('latitude', latitude);
            setValue('longitude', longitude);
          }}
          defaultValue={hackafest ? hackafest.address : ''}
        />
        {errors.address && <p>{errors.address.message}</p>}
      </div>

      {address && (
        <>
          <div className="mt-4">
            <label
              htmlFor="image"
              className="p-4 border-dashed border-4 border-gray-600 block cursor-pointer"
            >
              Click to add image (16:9)
            </label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              style={{display: 'none'}}
              ref={register({
                validate: (fileList: FileList) => {
                  if (hackafest || fileList.length === 1) return true;
                  return 'Please upload one file';
                },
              })}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                if (event?.target?.files?.[0]) {
                  const file = event.target.files[0];
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setPreviewImage(reader.result as string);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            {previewImage ? (
              <img
                src={previewImage}
                className="mt-4 object-cover"
                style={{width: '576px', height: `${(9 / 16) * 576}px`}}
              />
            ) : hackafest ? (
              <Image
                className="mt-4"
                cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
                publicId={hackafest.publicId}
                alt={hackafest.address}
                secure
                dpr="auto"
                quality="auto"
                width={576}
                height={Math.floor((9 / 16) * 576)}
                crop="fill"
                gravity="auto"
              />
            ) : null}
            {errors.image && <p>{errors.image.message}</p>}
          </div>

          <div className="mt-4">
            <label htmlFor="title" className="block">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              ref={register({
                required: 'Please enter the title',
              })}
            />
            {errors.title && <p>{errors.title.message}</p>}
          </div>

          <div className="mt-4">
            <label htmlFor="time" className="block">
              Time
            </label>
            <input
              id="time"
              name="time"
              type="text"
              ref={register({
                required: 'Please enter the time',
              })}
            />
            {errors.time && <p>{errors.time.message}</p>}
          </div>

          <div className="mt-4">
            <label htmlFor="date" className="block">
              Date
            </label>
            <input
              id="date"
              name="date"
              type="text"
              ref={register({
                required: 'Please enter the date',
              })}
            />
            {errors.date && <p>{errors.date.message}</p>}
          </div>

          <div className="mt-4">
            <button
              className="bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded"
              type="submit"
              disabled={submitting}
            >
              Save
            </button>{' '}
            <Link href={hackafest ? `/hackafests/${hackafest.id}` : '/'}>
              <a>Cancel</a>
            </Link>
          </div>
        </>
      )}
    </form>
  );
}
