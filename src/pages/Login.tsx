import { useState , useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useDispatch , useSelector  } from "react-redux";
import { setUser } from "../features/auth/authSlice"; 
import type { RootState } from "../app/store";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

 

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (user) {
      navigate("/BlogList");
    }
  }, [user, navigate]);
  

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    
 console.log(data);
    if (data.user) {
      dispatch(setUser({ id: data.user.id, email: data.user.email|| "" }));
    }

    setLoading(false);
    navigate("/BlogList");
  };

  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
<div className="flex flex-col max-w-md p-6 rounded-md sm:p-10 bg-gray-50 text-gray-800">
      <div className="mb-8 text-center">
        <h1 className="my-3 text-4xl font-bold">Sign in</h1>
        <p className="text-sm text-gray-600">Sign in to access your account</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-12">
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-2 text-sm">
              Email address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="leroy@jenkins.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md border-gray-300 bg-gray-50 text-gray-800"
              required
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label htmlFor="password" className="text-sm">
                Password
              </label>
              <a
                rel="noopener noreferrer"
                href="#"
                className="text-xs hover:underline text-gray-600"
              >
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="*****"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md border-gray-300 bg-gray-50 text-gray-800"
              required
            />
          </div>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <div className="space-y-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full px-8 py-3 font-semibold rounded-md bg-violet-600 text-gray-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <p className="px-6 text-sm text-center text-gray-600">
            Don't have an account yet?{" "}
            <a href="/register" className="hover:underline text-violet-600">
              Sign up
            </a>.
          </p>
        </div>
      </form>
    </div>
    </div>
    
  );
}

export default Login;
