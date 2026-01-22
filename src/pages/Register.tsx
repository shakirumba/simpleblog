import { useState , useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import type { RootState } from "../app/store";
import { useSelector } from "react-redux";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.auth.user);
 
  useEffect(() => {
    if (user) {
      navigate("/BlogList");
    }
  }, [user, navigate]);

  const handleRegister = async () => {	
    setLoading(true);
    setError("");

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    const { data: userData, error: userError } = await supabase
      .from("users")
      .insert([
        {
          auth_id: authData.user?.id,
          username,
          email,
          role: "user",
        },
      ]);
    
    if (userError) {
      setError(userError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    navigate("/login"); 
  };

  return (
	<div className="min-h-screen flex items-center justify-center bg-gray-900">
		<div className="flex flex-col max-w-md p-6 rounded-md sm:p-10 bg-gray-50 text-gray-800">
      <div className="mb-8 text-center">
        <h1 className="my-3 text-4xl font-bold">Sign up</h1>
        <p className="text-sm text-gray-600">Create a new account</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleRegister();
        }}
        className="space-y-12"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="block mb-2 text-sm">
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded-md border-gray-300 bg-gray-50 text-gray-800"
              required
            />
          </div>
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
            <label htmlFor="password" className="text-sm block mb-2">
              Password
            </label>
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
            {loading ? "Signing up..." : "Sign up"}
          </button>
          <p className="px-6 text-sm text-center text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="hover:underline text-violet-600"
            >
              Sign in
            </a>
          </p>
        </div>
      </form>
    </div>
	</div>
    
  );
}

export default Register;
