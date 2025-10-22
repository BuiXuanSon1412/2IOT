import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="w-full max-w-md p-8 m-4 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 items-center">
      <h2 className="text-3xl font-extrabold text-cyan-400 mb-6 text-center">Login</h2>
      <form className="space-y-4 m-10 items-center">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
          <input
            type="email"
            placeholder="user@example.com"
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
          <input
            type="password"
            placeholder="********"
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
          />
        </div>
        <Link to="/">
          <button
            type="button"
            className="w-full mt-4 py-2 bg-teal-600 rounded-lg text-white font-semibold hover:bg-teal-700 transition duration-200 shadow-md"
          >
              Sign In 
          </button>
        </Link>
      </form>
    </div>
  );
};
