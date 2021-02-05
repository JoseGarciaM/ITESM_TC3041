import {useState, useEffect, ChangeEvent} from 'react';
import {useForm} from 'react-hook-form';
import {useMutation, gql} from '@apollo/client';
import {Router, useRouter} from 'next/router';
import Link from 'next/link';
import {Image} from 'cloudinary-react';
import {SearchBox} from './SearchBox';
import {
  CreateHackafestMutation,
  CreateHackafestMutationVariables,
} from 'src/generated/CreateHackafestMutation';
import {
  UpdateHackafestMutation,
  UpdateHackafestMutationVariables,
} from 'src/generated/UpdateHouseMutation';
import {CreateSignatureMutation} from 'src/generated/CreateSignatureMutation';

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
        time: hackafest.time.toString(),
        date: hackafest.date.toString(),
        title: hackafest.title.toString(),
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
            bedrooms: parseInt(data.bedrooms, 10),
          },
        },
      });

      if (hackafestData?.createHackafest) {
        router.push(`/hackafest/${hackafestData.createHackafest.id}`);
      }
    }
  };

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
          bedrooms: parseInt(data.bedrooms, 10),
        },
      },
    });

    if (hackafestData?.updateHackafest) {
      router.push(`/hackafest/${currentHackafest.id}`);
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1>
        {hackafest ? `Editing ${hackafest.address}` : 'Add a New House'}
      </h1>

      <div>
        <label htmlFor="search">
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
          <div>
            <label
              htmlFor="image"
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
              />
            ) : hackafest ? (
              <Image
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
            <label htmlFor="bedrooms" className="block">
              Beds
            </label>
            <input
              id="bedrooms"
              name="bedrooms"
              type="number"
              className="p-2"
              ref={register({
                required: 'Please enter the number of bedrooms',
                max: {value: 10, message: 'Wooahh, too big of a house'},
                min: {value: 1, message: 'Must have at least 1 bedroom'},
              })}
            />
            {errors.bedrooms && <p>{errors.bedrooms.message}</p>}
          </div>

          <div className="mt-4">
            <button
              type="submit"
              disabled={submitting}
            >
              Save
            </button>{' '}
            <Link href={hackafest ? `/hackafest/${hackafest.id}` : '/'}>
              <a>Cancel</a>
            </Link>
          </div>
        </>
      )}
    </form>
  );
}
