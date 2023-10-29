'use client';

import 'app/globals.css';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import Stats from "@/components/stats";
import {Survey} from "@/components/survey";
import { useState, useEffect } from 'react';
import axios from 'axios';



function Home() {
  const { user } = useUser();
  const [careTaker, setCareTaker] = useState<any>(null);

  useEffect(() => {
    if (user) {
      axios.post('/api/retrieve', {email: user.email}).then(res => {
        setCareTaker(res.data.careTaker)
      });
    }
  }, [user]);

  return (
    <>
    <body className="h-auto m-16">
    {user && (
      <>
      <div className="m-8 flex justify-end">
        <a className="w-[120px] text-center p-4 rounded-lg text-md duration-150" href="/api/auth/logout">Logout</a>
      </div>
        <h1 className="text-5xl font-bold text-center m-16  underline ">ElderBytes</h1>
      {!careTaker && <Survey email={user.email ? user.email : ""}></Survey>}
      {careTaker && <Stats careTaker={careTaker}></Stats>}
      </>
    )}
    </body>
    </>
  );
};

export default withPageAuthRequired(Home, {
  onError: error => <div>{error.message}</div>,
});