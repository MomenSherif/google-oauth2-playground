import { useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

export default function App() {
  // set user with userinfo response
  const [user, setUser] = useState<null | Record<string, any>>(null);
  const [tokenResponse, setTokenResponse] = useState<TokenResponse | null>(
    null,
  );

  const scriptLoadedSuccessfully = useLoadGsiScript();
  const gsiClientRef = useRef<any>();

  // to be custom hook
  const hasGrantedAnyScope = (...scopes: string[]) => {
    if (!tokenResponse?.access_token) return false;

    return window?.google?.accounts.oauth2.hasGrantedAnyScope(
      tokenResponse,
      ...scopes,
    );
  };

  const hasGrantedAllScopes = (...scopes: string[]) => {
    if (!tokenResponse?.access_token) return false;

    return window?.google?.accounts.oauth2.hasGrantedAnyScope(
      tokenResponse,
      ...scopes,
    );
  };

  useEffect(() => {
    if (!scriptLoadedSuccessfully) return;

    const client = window.google?.accounts.oauth2.initTokenClient({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      scope: 'openid profile email',
      callback: tokenResponse => {
        if (tokenResponse.error)
          return console.log('ERROR', tokenResponse.error);
        setTokenResponse(tokenResponse);
      },
    });
    gsiClientRef.current = client;
  }, [scriptLoadedSuccessfully]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Hello, React!</h1>

        <If condition={!tokenResponse}>
          <button
            onClick={() =>
              gsiClientRef.current.requestAccessToken({
                hint: 'BABA',
                state: 'STATE',
              })
            }
          >
            Sign in
          </button>
        </If>

        <If
          condition={
            !hasGrantedAnyScope(
              'https://www.googleapis.com/auth/calendar.readonly',
            )
          }
        >
          <button
            onClick={() =>
              gsiClientRef.current.requestAccessToken({
                scope: 'https://www.googleapis.com/auth/calendar.readonly',
                // prompt: 'consent',
              })
            }
          >
            Request Calendar Access
          </button>
        </If>

        <If condition={!!tokenResponse}>
          <FetchInfoActions tokenResponse={tokenResponse!} />
        </If>

        <pre style={{ textAlign: 'left', fontSize: 12 }}>
          {JSON.stringify(tokenResponse, null, 2)}
        </pre>
      </header>
    </div>
  );
}

function useLoadGsiScript() {
  const [scriptLoadedSuccessfully, setScriptLoadedSuccessfully] =
    useState(false);

  useEffect(() => {
    const scriptTag = document.createElement('script');
    scriptTag.src = 'https://accounts.google.com/gsi/client';
    scriptTag.async = true;
    scriptTag.defer = true;
    scriptTag.onload = () => {
      setScriptLoadedSuccessfully(true);
      // TODO: props -> onScriptLoadSuccessfully
    };
    scriptTag.onerror = () => {
      setScriptLoadedSuccessfully(false);
      // TODO: props -> onScriptLoadFailure
    };

    document.body.appendChild(scriptTag);
  }, []);

  return scriptLoadedSuccessfully;
}

function FetchInfoActions({ tokenResponse }: { tokenResponse: TokenResponse }) {
  return (
    <>
      <button
        onClick={() => {
          axios
            .get('https://www.googleapis.com/oauth2/v3/tokeninfo', {
              headers: {
                Authorization: `Bearer ${tokenResponse.access_token!}`,
              },
            })
            .then(res => res.data)
            .then(console.log);
        }}
      >
        Fetch tokeninfo
      </button>
      <button
        onClick={() => {
          axios
            .get('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: {
                Authorization: `Bearer ${tokenResponse?.access_token}`,
              },
            })
            .then(res => res.data)
            .then(console.log);
        }}
      >
        Fetch userinfo
      </button>
    </>
  );
}

function If({
  condition,
  children,
}: {
  condition: boolean;
  children: React.ReactNode;
}) {
  return condition ? <>{children}</> : null;
}
