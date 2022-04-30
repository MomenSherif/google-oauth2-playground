import { useEffect, useRef } from 'react';
import { decodeJwt } from '../Utils';

export default function PersonalizedButtonAndPrompt({
  scriptLoadedSuccessfully,
  hasOneTap = false,
  onSignIn,
}: any) {
  const btnContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scriptLoadedSuccessfully) return;

    window.google?.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: tokenResponse => {
        if (!tokenResponse.clientId || !tokenResponse.credential) return;
        console.log('🚀 tokenResponse', tokenResponse);
        console.log('🚀 decodedJwt', decodeJwt(tokenResponse.credential));
        onSignIn(tokenResponse);
        // expires in: exp - iat
      },
      auto_select: true, // auto sign in
      // login_uri: '<backend login with google handler>', // post request
      // ux_mode: 'redirect',
    });

    window.google?.accounts.id.renderButton(
      btnContainerRef.current!,
      { type: 'standard', theme: 'outline', size: 'medium' }, // customization attributes
    );

    if (hasOneTap) window.google?.accounts.id.prompt();

    return () => {
      window.google?.accounts.id.cancel();
    };
  }, [scriptLoadedSuccessfully]);

  // Add height to container to prevent layout shifting { large: 40, medium: 32, small: 20}
  return <div ref={btnContainerRef} style={{ height: 40 }}></div>;
}

// Logout call window.google.accounts.id.disableAutoSelect()
