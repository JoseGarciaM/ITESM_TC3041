import {FunctionComponent, ReactNode} from 'react';
import Link from 'next/link';
import {useAuth} from 'context/user';

interface IProps {
  main: ReactNode;
}

const AppLayout: FunctionComponent<IProps> = ({main}) => {
  const {logout, authenticated} = useAuth();

  return (
    <div className="bg-gray-900 max-w-screen-2xl mx-auto text-white">
      <nav className="bg-gray-800" style={{height: '64px'}}>
        <div className="px-6 flex items-center justify-between h-16">
          <Link href="/">
            <a>
              Hacka
            </a>
          </Link>
          {authenticated ? (
            <>
              <Link href="/hackafests/add">
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
      <main style={{minHeight: 'calc(100vh - 64px)'}}>{main}</main>
    </div>
  );
};

export default AppLayout;
