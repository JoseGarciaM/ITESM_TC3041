import {FunctionComponent, ReactNode} from 'react';
import Link from 'next/link';
import {useAuth} from 'context/user';

interface IProps {
  main: ReactNode;
}

const AppLayout: FunctionComponent<IProps> = ({main}) => {
  const {logout, authenticated} = useAuth();

  return (
    <div>
      <nav>
        <div>
          <Link href="/">
            <a>
              Hacka
            </a>
          </Link>
          {authenticated ? (
            <>
              <Link href="/houses/add">
                <a>Hackweets</a>
              </Link>
              <Link href="/houses/add">
                <a>Hackfests</a>
              </Link>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <Link href="/auth">
              <a>Login / Signup</a>
            </Link>
          )}
        </div>
      </nav>
      <main>
        {main}
      </main>
    </div>
  );
};

export default AppLayout;
