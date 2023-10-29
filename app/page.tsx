'use client';

import 'app/globals.css';

import React from 'react';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import Stats from "@/components/stats";
import {Survey} from "@/components/survey";
import { useState, useEffect } from 'react';
import axios from 'axios';


function Home() {
  const { user } = useUser();
  const { firstTime, setFirstTime } = useState(false);

  useEffect(() => {
    if (user) {
      axios.post('/api/retrieve', {email: user.email}).then(res => {
        if (res.status == 200) {
          console.log(res.data);
          setFirstTime(false);
        } else {
          setFirstTime(true);
        }
      });

    }
  }, [user]);

  return (
    <>
    <body className="bg-[#e5e5e5] h-[150vh]">
    {user && (
      <>
      <div className="m-8 flex justify-end">
        <a className="w-[120px] bg-[#14213d] text-[#e5e5e5] text-center p-4 rounded-lg text-md hover:bg-[#635dff] hover:text-[#14213d] duration-150" href="/api/auth/logout">Logout</a>
      </div>
        <h1 className="text-5xl font-bold text-center m-16 text-[#14213d] underline decoration-[#635dff]">ElderBytes</h1>
        {!firstTime && <Survey></Survey>}
        <Stats></Stats>
      </>
    )}
    </body>
    </>
  );
};

export default withPageAuthRequired(Home, {
  onError: error => <div>{error.message}</div>,
});