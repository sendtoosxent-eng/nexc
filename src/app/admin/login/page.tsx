"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Mail,
  Lock,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch(
        "/api/admin/login",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (data.success) {
        localStorage.setItem(
          "admin",
          JSON.stringify(data.admin)
        );

        router.push("/admin/dashboard");
      } else {
        alert(data.message);
      }

    } catch (error) {
      console.log(error);

      alert("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-sky-400 via-sky-500 to-black flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8">

        <div className="flex justify-center mb-6">
          <div className="bg-sky-500 p-4 rounded-2xl shadow-lg">
            <ShieldCheck
              className="text-white"
              size={38}
            />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white text-center">
          Admin Login
        </h1>

        <p className="text-white/70 text-center mt-2 mb-8">
          Sign in to manage your store
        </p>

        <form
          onSubmit={handleLogin}
          className="space-y-6"
        >

          <div>
            <label className="text-white text-sm mb-2 block">
              Email Address
            </label>

            <div className="relative">
              <Mail
                className="absolute left-4 top-3.5 text-sky-200"
                size={18}
              />

              <input
                type="email"
                name="email"
                placeholder="admin@nexcell.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="
                  w-full
                  bg-white/10
                  border border-white/20
                  rounded-xl
                  py-3
                  pl-12
                  pr-4
                  text-white
                  placeholder:text-white/50
                  outline-none
                  focus:border-sky-400
                  focus:ring-2
                  focus:ring-sky-400/30
                "
              />
            </div>
          </div>

          <div>
            <label className="text-white text-sm mb-2 block">
              Password
            </label>

            <div className="relative">
              <Lock
                className="absolute left-4 top-3.5 text-sky-200"
                size={18}
              />

              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="
                  w-full
                  bg-white/10
                  border border-white/20
                  rounded-xl
                  py-3
                  pl-12
                  pr-4
                  text-white
                  placeholder:text-white/50
                  outline-none
                  focus:border-sky-400
                  focus:ring-2
                  focus:ring-sky-400/30
                "
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              bg-sky-500
              hover:bg-sky-600
              text-white
              font-semibold
              py-3
              rounded-xl
              transition-all
              duration-300
              shadow-lg
            "
          >
            {loading
              ? "Signing In..."
              : "Login"}
          </button>

        </form>
      </div>
    </section>
  );
}