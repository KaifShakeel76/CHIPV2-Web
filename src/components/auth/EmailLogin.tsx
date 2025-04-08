// src/components/auth/EmailLogin.tsx
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"; // ✅ ShadCN toast
import { useNavigate } from "react-router-dom";
//import { RegisterDrawer } from "../auth/register-drawer";

export default function EmailLogin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [registerDrawerOpen, setRegisterDrawerOpen] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in both fields");
      return;
    }
    toast.success("Logged in successfully!");
    console.log("Email:", email, "Password:", password);
  };

  return (
    <><form className="space-y-6" onSubmit={handleLogin}>
      <div className="space-y-2">
        <label htmlFor="email" className="text-[#606060] block">Email</label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-[#f3f3f3]" />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-[#606060] block">Password</label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-[#f3f3f3] pr-10" />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b8b8b]"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="text-right">
        <button
          type="button"
          className="text-[#156f85] hover:underline text-sm"
          onClick={() => navigate("/forgot-password")}
        >
          Forget Password?
        </button>
      </div>

      <Button className="w-full bg-[#183966] text-white" type="submit">Login</Button>

      {/* <div className="text-center text-[#606060]">
        Don't have an account?{" "}
        <button className="text-[#156f85] hover:underline" onClick={() => setRegisterDrawerOpen(true)}>
          Register
        </button>
      </div> */}

    </form>
    {/* <RegisterDrawer open={registerDrawerOpen} onOpenChange={setRegisterDrawerOpen} /> */}
    </>
  );
}
