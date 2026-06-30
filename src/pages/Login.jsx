import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithCredential,
} from "firebase/auth";
import { SocialLogin } from "@capgo/capacitor-social-login";
import { Capacitor } from "@capacitor/core";

import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { createUserProfile } from "../services/profileService";

export default function Login() {
  const navigate = useNavigate();

  async function handleGoogleLogin() {
    try {
      // Native Android / iOS Login
      if (Capacitor.isNativePlatform()) {
        const result = await SocialLogin.login({
          provider: "google",
          options: {
            scopes: ["profile", "email"],
          },
        });

        console.log("Google Login Result:", result);

        const idToken = result.result.idToken;

        if (!idToken) {
          throw new Error("Google ID Token not received.");
        }

        console.log("ID Token:", idToken);

        const credential = GoogleAuthProvider.credential(idToken);

        const userCredential = await signInWithCredential(
          auth,
          credential
        );

        console.log("Firebase User:", userCredential.user);

        await createUserProfile(userCredential.user);

        navigate("/dashboard");
        return;
      }

      // Web Login
      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(auth, provider);

      await createUserProfile(result.user);

      navigate("/dashboard");
    } catch (error) {
      console.error("Login Error:", error);

      alert(
        error?.message ||
          JSON.stringify(error, null, 2)
      );
    }
  }

  return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden px-5 py-10">

    {/* Background Glow */}
    <div className="absolute w-72 h-72 sm:w-[450px] sm:h-[450px] bg-cyan-500/20 blur-3xl rounded-full -top-24 -left-24" />
    <div className="absolute w-72 h-72 sm:w-[400px] sm:h-[400px] bg-violet-500/20 blur-3xl rounded-full -bottom-24 -right-24" />

    {/* Login Card */}
    <div className="relative w-full max-w-md bg-slate-900/70 backdrop-blur-xl border border-slate-700 rounded-3xl shadow-2xl p-6 sm:p-10">

      {/* Logo */}
<div className="flex justify-center mb-6">
  <img
    src="/icon.png"
    alt="Last Minute Logo"
    className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
  />
</div>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-center bg-gradient-to-r from-cyan-400 to-violet-500 text-transparent bg-clip-text">
        Last Minute
      </h1>

      <p className="text-center text-slate-400 mt-3 text-sm sm:text-base">
        AI Productivity Assistant
      </p>

      <div className="my-8 h-px bg-slate-700" />

      {/* Google Button */}
      <button
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-3 bg-white text-black font-semibold py-3.5 rounded-2xl hover:scale-[1.02] active:scale-95 transition duration-200 shadow-lg"
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
          className="w-5 h-5"
        />
        Continue with Google
      </button>

      

    </div>

  </div>
);
}