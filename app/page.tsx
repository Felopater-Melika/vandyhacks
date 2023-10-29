'use client';

import { Survey } from "@/components/ui/survey";
import 'app/globals.css';
import Stats from "app/stats";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAccessToken } from '@auth0/nextjs-auth0';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';


function Home() {
  const { user, isLoading } = useUser();
  
  return (
    <>
    <body className="bg-[#e5e5e5] h-[150vh]">
    {user && (
      <>
      <div className="m-8 flex justify-end">
        <a className="w-[120px] bg-[#14213d] text-[#e5e5e5] text-center p-4 rounded-lg text-md hover:bg-[#fca311] duration-150" href="/api/auth/logout">Logout</a>
      </div>
        <h1 className="text-5xl font-bold text-center m-16 text-[#14213d] underline decoration-[#fca311]">ElderBytes</h1>
        <Survey></Survey>
        <Stats></Stats>
      </>
    )}
    </body>
    </>
  );
};

export default withPageAuthRequired(Home, {
  onError: error => <ErrorMessage>{error.message}</ErrorMessage>
});