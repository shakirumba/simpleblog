import { useEffect } from "react";
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "./app/store";

import Login from "./pages/Login";
import Register from "./pages/Register";
import BlogList from "./pages/BlogList";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CreateBlog from "./pages/CreateBlog";
import EditBlog from "./pages/EditBlog";
import ViewBlog from "./pages/ViewBlog";


import { supabase } from "./lib/supabaseClient";
import { setUser, logout } from "./features/auth/authSlice";

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
   
  

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        dispatch(
          setUser({
            id: session.user.id,
            email: session.user.email ?? "",
          })
        );
      } else {
        dispatch(logout());
      }
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        dispatch(
          setUser({
            id: session.user.id,
            email: session.user.email ?? "",
          })
        );
      } else {
        dispatch(logout());
      }
    });

    return () => data.subscription.unsubscribe();
  }, [dispatch]);

  const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    return user ? children : <Navigate to="/login" replace />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/BlogList" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/CreateBlog" element={<CreateBlog />} />
        <Route path="/EditBlog/:id" element={<EditBlog />} />
        <Route path="/ViewBlog/:id" element={<ViewBlog />} />

        <Route
          path="/BlogList"
          element={
            <PrivateRoute>
              <Header />
              <BlogList />
              <Footer />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
