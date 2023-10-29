'use client';

import 'app/globals.css';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import Stats from "@/components/stats";
import {Survey} from "@/components/survey";
import { useState, useEffect } from 'react';
import axios from 'axios';
import {Button} from "@/components/ui/button";



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
        <div className="flex justify-end w-full">
      <Button className="">
        <a className=" text-center p-2 rounded-lg text-md" href="/api/auth/logout">Logout</a>
      </Button>
    </div>
        <h1 className="text-5xl text-center m-16">ElderBytes</h1>
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