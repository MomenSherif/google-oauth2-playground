import axios from 'axios';
import { If } from '../Utils';

export default function CustomButton({
  gsiClientRef,
  tokenResponse,
  hasGrantedAnyScope,
  hasGrantedAllScopes,
}: any) {
  return (
    <>
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
    </>
  );
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
