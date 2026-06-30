import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebase";

import { Capacitor } from "@capacitor/core";
import { App as CapacitorApp } from "@capacitor/app";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AIPlanner from "./pages/AIPlanner";
import CalendarPage from "./pages/Calendar";
import Analytics from "./pages/Analytics";
import AIChat from "./pages/AIChat";
import Profile from "./pages/Profile";

export default function App() {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ===========================
  // Firebase Authentication
  // ===========================

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();

  }, []);

  // ===========================
  // Android Back Button
  // ===========================

  useEffect(() => {

    if (!Capacitor.isNativePlatform()) return;

    const listener = CapacitorApp.addListener(
      "backButton",
      () => {

        const currentPath = window.location.pathname;

        if (
          currentPath === "/" ||
          currentPath === "/dashboard"
        ) {
          CapacitorApp.exitApp();
        } else {
          window.history.back();
        }

      }
    );

    return () => {
      listener.then((l) => l.remove());
    };

  }, []);

  // ===========================
  // Loading Screen
  // ===========================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white text-xl">
        Loading...
      </div>
    );
  }

  // ===========================
  // Routes
  // ===========================

  return (

    <Routes>

      <Route
        path="/"
        element={
          user
            ? <Navigate to="/dashboard" replace />
            : <Landing />
        }
      />

      <Route
        path="/login"
        element={
          user
            ? <Navigate to="/dashboard" replace />
            : <Login />
        }
      />

      <Route
        path="/dashboard"
        element={
          user
            ? <Dashboard />
            : <Navigate to="/login" replace />
        }
      />

      <Route
        path="/planner"
        element={
          user
            ? <AIPlanner />
            : <Navigate to="/login" replace />
        }
      />

      <Route
        path="/calendar"
        element={
          user
            ? <CalendarPage />
            : <Navigate to="/login" replace />
        }
      />

      <Route
        path="/analytics"
        element={
          user
            ? <Analytics />
            : <Navigate to="/login" replace />
        }
      />

      <Route
        path="/chat"
        element={
          user
            ? <AIChat />
            : <Navigate to="/login" replace />
        }
      />

      <Route
        path="/profile"
        element={
          user
            ? <Profile />
            : <Navigate to="/login" replace />
        }
      />

    </Routes>

  );

}