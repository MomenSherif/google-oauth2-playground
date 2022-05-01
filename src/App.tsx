import { useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import CustomButton from './examples/CustomButton';
import PersonalizedButtonAndPrompt from './examples/PersonalizedButtonAndPrompt';
import { If } from './Utils';
import { Route, Routes } from 'react-router-dom';
import AuthCallback from './pages/AuthCallback';
import AuthorizationCodeFlow from './examples/AuthorizationCodeFlow';

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

  // Use Context in real implementation | it's just a demo

  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <div className="App">
              <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <h1>Hello, React!</h1>
                {/* <CustomButton
                  gsiClientRef={gsiClientRef}
                  tokenResponse={tokenResponse}
                  hasGrantedAnyScope={hasGrantedAnyScope}
                  hasGrantedAllScopes={hasGrantedAllScopes}
                />

                <If condition={!user}>
                  <PersonalizedButtonAndPrompt
                    scriptLoadedSuccessfully={scriptLoadedSuccessfully}
                    hasOneTap
                    onSignIn={setUser}
                  />
                </If>

                <If condition={!!user}>
                  <button
                    onClick={() => {
                      window.google?.accounts.id.disableAutoSelect();
                      setUser(null);
                    }}
                  >
                    Logout
                  </button>
                </If> */}

                <AuthorizationCodeFlow
                  scriptLoadedSuccessfully={scriptLoadedSuccessfully}
                />

                <pre style={{ textAlign: 'left', fontSize: 12 }}>
                  {JSON.stringify(tokenResponse, null, 2)}
                </pre>
              </header>
            </div>
          </>
        }
      />
      <Route path="/auth/callback" element={<AuthCallback />} />
    </Routes>
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
