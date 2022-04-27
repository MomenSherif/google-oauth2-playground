import { useState } from 'react';
import {
  GoogleLogin,
  GoogleLogout,
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from 'react-google-login';

import logo from './logo.svg';
import './App.css';

function App() {
  const [user, setUser] = useState<null | Record<string, any>>(null);

  const handleLoginSuccess = (
    response: GoogleLoginResponse | GoogleLoginResponseOffline,
  ) => {
    setUser((response as GoogleLoginResponse).profileObj);
  };

  const handleLoginFailure = (response: any) => {
    console.log(response);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {user ? (
          <GoogleLogout clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID} />
        ) : (
          <GoogleLogin
            clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
            onSuccess={handleLoginSuccess}
            onFailure={handleLoginFailure}
            cookiePolicy="single_host_origin"
            isSignedIn
          />
        )}
        <div style={{ textAlign: 'left' }}>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
      </header>
    </div>
  );
}

export default App;
