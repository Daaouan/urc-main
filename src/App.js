import './App.css';
import AppRouter from './principal/AppRouter';
import { useEffect } from 'react';
import { Client as PusherClient, TokenProvider } from '@pusher/push-notifications-web';

function App() {

  useEffect(() => {

    const token = sessionStorage.getItem('token');
    const user_id=sessionStorage.getItem('externalId');
    if(!token || !user_id)return;
  
  
    const beamsClient = new PusherClient({
      instanceId: "d119df2c-f7bd-4788-9562-9bd8ed920f5c",
    });

    const beamsTokenProvider = new TokenProvider({
      url: '/api/beams',
      headers: {
        Authentication: "Bearer " + token, // Headers your auth endpoint needs
      },

    });

    beamsClient.start()
      .then(() => beamsClient.addDeviceInterest('global'))
      .then(() => beamsClient.setUserId(user_id, beamsTokenProvider))
      .then(() => {
        beamsClient.getDeviceId().then(deviceId => console.log("Push id : " + deviceId));
      })
      .catch(console.error);
    // Clean up when component is unmounted
    return () => {
      beamsClient.stop().catch(console.error);
    };
  }, []);

  return (
    <AppRouter />
  );
}

export default App;




