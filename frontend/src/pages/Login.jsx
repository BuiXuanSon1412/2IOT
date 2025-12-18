import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = async (e) => {
    e.preventDefault();

    // TODO: Authentication logic from API
    console.log(email, " ", password);

    const success = true;
    if (success) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="w-full max-w-md p-8 bg-slate-800 rounded-xl shadow-2xl border border-slate-700">
        <h2 className="text-3xl font-extrabold text-cyan-400 mb-8 text-center">
          Login
        </h2>

        <form className="space-y-5" onSubmit={signIn}>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="
                w-full px-4 py-2
                bg-slate-900
                border border-slate-700
                rounded-lg
                text-white
                focus:outline-none
                focus:ring-2
                focus:ring-cyan-500
                placeholder-slate-500
                placeholder-opacity-50
                placeholder:italic
              "
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="
                w-full px-4 py-2
                bg-slate-900
                border border-slate-700
                rounded-lg
                text-white
                focus:outline-none
                focus:ring-2
                focus:ring-cyan-500
                placeholder-slate-500
                placeholder-opacity-50
              "
            />
          </div>

          <button
            type="submit"
            className="
              w-full mt-6 py-2
              bg-teal-600
              rounded-lg
              text-white
              font-semibold
              hover:bg-teal-700
              transition-colors
              duration-200
              shadow-md
            "
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};
