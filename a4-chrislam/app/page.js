'use client';

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const msg = params.get('msg');
    const messageDiv = document.getElementById('message');
    if (msg && messageDiv) {
      messageDiv.textContent = msg;
      setTimeout(() => {
        messageDiv.textContent = '';
      }, 2000);
    }
  }, []);

  return (
      <div className="bg-white w-1/2 justify-center flex flex-col m-auto">
        <div className="pt-20">
          <div className="flex items-center m-auto gap-4 justify-center">
            <div className="flex gap-4 items-center m-auto">
              <img id="northstar" src="/northstar.jpg" alt="northstar" className="w-12 h-12" />
              <h1 className="font-bold text-2xl">Northstar Cafe</h1>
            </div>
          </div>
          <form className="w-1/2 m-auto pt-10" action="/login" method="POST">
            <label htmlFor="username" className="text-md mb-2 text-[#5E718E]">
              Username<span className="text-[#ef4444]"> *</span>
            </label>
            <input
                required
                name="username"
                type="text"
                id="username"
                placeholder="Enter username"
                className="w-full p-4 border border-[#ECEBEB] rounded bg-[#FCFCFC] focus:outline-none focus:border-[#5E718E]"
            />
            <br />
            <br />
            <label htmlFor="password" className="text-md mb-2 text-[#5E718E]">
              Password<span className="text-[#ef4444]"> *</span>
            </label>
            <input
                required
                name="password"
                type="password"
                id="password"
                placeholder="Enter password"
                className="w-full p-4 border border-[#ECEBEB] rounded bg-[#FCFCFC] focus:outline-none focus:border-[#5E718E]"
            />
            <br />
            <br />
            <button
                id="submitLogin"
                type="submit"
                className="text-white bg-black p-3 rounded-md hover:bg-[#161513] transition w-full m-auto"
            >
              Sign In
            </button>
          </form>
          <br />
          <br />
          <div
              id="message"
              className="mt-10 w-1/2 m-auto text-center text-red-600 flex justify-center"
          ></div>
        </div>
      </div>
  );
}
