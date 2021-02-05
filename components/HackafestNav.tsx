import {useMutation, gql} from '@apollo/client';
import {useRouter} from 'next/router';
import Link from 'next/link';
import {useAuth} from 'context/user';
import {
  DeleteHackafest, DeleteHackafestVariables,
} from 'graphql/mutations/DeleteHackafest';

const DELETE_MUTATION = gql`
  mutation DeleteHackafest($id: String!) {
    deleteHackafest(id: $id)
  }
`;

interface IProps {
  hackafest: {
    id: string;
    userId: string;
  };
}

export default function HackafestNav({hackafest}: IProps) {
  const router = useRouter();
  const {user} = useAuth();
  const canManage = !!user && user.uid === hackafest.userId;
  const [deleteHackafest, {loading}] = useMutation<
    DeleteHackafest,
    DeleteHackafestVariables
  >(DELETE_MUTATION);

  return (
    <>
      <Link href="/">
        <a>map</a>
      </Link>
      {canManage && (
        <>
          {' | '}
          <Link href={`/hackafests/${hackafest.id}/edit`}>
            <a>edit</a>
          </Link>
          {' | '}
          <button
            disabled={loading}
            type="button"
            onClick={async () => {
              if (confirm('Are you sure?')) {
                await deleteHackafest({variables: {id: hackafest.id}});
                router.push('/');
              }
            }}
          >
            delete
          </button>
        </>
      )}
    </>
  );
}
