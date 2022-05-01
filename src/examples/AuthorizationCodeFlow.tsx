import axios from 'axios';
import { useEffect, useRef } from 'react';

export default function AuthorizationCodeFlow({
  scriptLoadedSuccessfully,
}: any) {
  const gsiClientRef = useRef<any>();

  useEffect(() => {
    if (!scriptLoadedSuccessfully) return;

    const client = window.google?.accounts.oauth2.initCodeClient({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      scope: 'openid profile email',
      // callback: async ({ code }) => {
      //   const { data } = await axios.post(
      //     'http://localhost:3001/auth/google',
      //     {
      //       code,
      //     },
      //     { withCredentials: true },
      //   );
      //   console.log(data);
      // },
      ux_mode: 'redirect',
      redirect_uri: 'http://localhost:3001/oauth2callback',
    });

    gsiClientRef.current = client;
  }, [scriptLoadedSuccessfully]);

  return (
    <div>
      <button onClick={() => gsiClientRef.current.requestCode()}>Login</button>
      <button
        onClick={async () => {
          const { data } = await axios.post(
            'http://localhost:3001/auth/google/refresh-token',
            {
              refreshToken: '<refresh token stored in data>',
            },
          );
          console.log(data);
        }}
      >
        Refresh
      </button>
    </div>
  );
}
