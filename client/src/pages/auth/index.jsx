import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Background from "@/assets/draken.png";
import Victory from "@/assets/victory.svg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { useAppStore } from "@/store";

function Auth() {
  const navigate = useNavigate();

  const { setUserInfo } = useAppStore()

  // Separate state variables for login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Separate state variables for signup
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const validateLogin = () => {
    if (!loginEmail.length) {
      toast.error("Email is required.");
      return false;
    }
    if (!loginPassword.length) {
      toast.error("Password is required.");
      return false;
    }
    return true;
  };

  const validateSignup = () => {
    if (!signupEmail.length) {
      toast.error("Email is required.");
      return false;
    }
    if (!signupPassword.length) {
      toast.error("Password is required.");
      return false;
    }
    if (signupPassword !== confirmPassword) {
      toast.error("Password and Confirm Password should be the same.");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    try {
      if (validateLogin()) {
        const response = await apiClient.post(LOGIN_ROUTE,{ email: loginEmail, password: loginPassword },{ withCredentials: true });

        if (response.data.user.id) {
          setUserInfo(response.data.user)
          if (response.data.user.profileSetup) navigate("/chat");
          else navigate("/profile");
        }
        console.log("Login successful:", response.data);
      }
    } catch (error) {
      if (error.response) {
        console.error("Login failed:", error.response.data);
      } else if (error.request) {
        console.error("Login failed: No response received from server");
      } else {
        console.error("Login failed:", error.message);
      }}
  };

  const handleSignup = async () => {
    try {
      if (validateSignup()) {
        const response = await apiClient.post(SIGNUP_ROUTE,{ email: signupEmail, password: signupPassword },{ withCredentials: true });
        
        if (response.status === 201){
          setUserInfo(response.data.user)
          navigate("/profile");
        }
        console.log("Signup successful:", response.data);
      }
    } catch (error) {
      console.error("Signup failed:", error.response ? error.response.data : error.message);
    }    
  };

  return (
    <div className="flex items-center justify-center min-h-screen cursor-pointer m-auto xl:ml-52">
      <div className="h-[80vh]  bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
        <div className="flex flex-col gap-10 items-center justify-center">
          <div className="flex items-center justify-center flex-col">
            <div className="flex items-center justify-center">
              <h1 className="text-5xl md:text-6xl font-bold">Welcome</h1>
              <img src={Victory} className="h-[100px]" alt="Victory" />
            </div>
            <p className="font-medium text-center">
              Fill in the details to get started with the best chat app!
            </p>
          </div>
          <div className="flex items-center justify-center w-full">
            <Tabs defaultValue="login" className="w-3/4">
              <TabsList className="bg-transparent rounded-none w-full flex justify-center">
                <TabsTrigger
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black  data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                  value="login"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black  data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                  value="signup"
                >
                  Signup
                </TabsTrigger>
              </TabsList>

              <TabsContent className="flex flex-col gap-5 mt-10" value="login">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
                <Button className="rounded-full p-6" onClick={handleLogin}>
                  Login
                </Button>
              </TabsContent>

              <TabsContent className="flex flex-col gap-5" value="signup">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                />
                <Input
                  placeholder="Confirm Password"
                  type="password"
                  className="rounded-full p-6"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button className="rounded-full p-6" onClick={handleSignup}>
                  Sign Up
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="cursor-pointer hidden xl:flex justify-center items-center ">
          <img src={Background} className="h-[600px]" alt="Background" />
        </div>
      </div>
    </div>
  );
}

export default Auth;
