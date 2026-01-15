import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import logo from "../../assets/img/logo.png";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        // MOCK LOGIN
        if (email === "admin@gmail.com" && password === "1") {
            navigate("/admin");
        } else {
            setError("Sai tài khoản hoặc mật khẩu");
        }
    };

    return (
        <div className="min-h-screen bg-[#F5EBE0] flex items-center justify-center">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

                {/* Logo */}
                <div className="mb-6 flex justify-center">
                    <img
                        src={logo}
                        alt="Library Logo"
                        className="h-10 object-contain"
                    />
                </div>


                {/* Error */}
                {error && (
                    <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Email */}
                    <div>
                        <label className="text-sm text-gray-600 mb-1 block">Email</label>
                        <div className="flex items-center bg-gray-100 rounded-full px-4 py-3">
                            <Mail size={18} className="text-gray-400 mr-2" />
                            <input
                                type="email"
                                placeholder="Nhập email"
                                className="bg-transparent outline-none flex-1 text-sm text-gray-800 placeholder-gray-400"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="text-sm text-gray-600 mb-1 block">Password</label>
                        <div className="flex items-center bg-gray-100 rounded-full px-4 py-3">
                            <Lock size={18} className="text-gray-400 mr-2" />
                            <input
                                type="password"
                                placeholder="Nhập mật khẩu"
                                className="bg-transparent outline-none flex-1 text-sm text-gray-800 placeholder-gray-400"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        className="w-full bg-[#8B5E3C] text-white py-3 rounded-full font-medium hover:opacity-90 transition"
                    >
                        Đăng nhập
                    </button>
                </form>
            </div>
        </div>
    );
}
