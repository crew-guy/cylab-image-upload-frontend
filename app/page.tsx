"use client"
import './page.module.css';
import { Provider } from 'react-redux';
import { AppDispatch, store } from './src/store';
import { Toaster } from 'react-hot-toast';
import App from './src/components/Dashboard';
import { Auth0Provider } from '@auth0/auth0-react';
import Dashboard from './src/components/Dashboard';


export default function Home() {


  return (
    <Auth0Provider
      domain="dev-54vh7efulm7mwdr8.us.auth0.com"
      clientId="P0BqA8aECdq02i6uYWOU1pexqGkfaI7h"
      authorizationParams={{
        redirect_uri: process.env.NEXT_PUBLIC_DOMAIN
      }}
    >
      <Provider store={store}>
        <Toaster />
        <div>
          <nav style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60px', backgroundColor: '#000' }}>
            <img src="https://cylab-temp-testing-bucket.s3.amazonaws.com/images/ultron-logo.svg" alt="Logo" style={{ height: '50px' }} />
          </nav>
          <div className='app-container' style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-around',
            height: 'calc(100vh - 60px)',
          }}>
            <Dashboard />
          </div>
        </div>
      </Provider>
    </Auth0Provider>
  );
}





