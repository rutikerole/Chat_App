import { useAppStore } from "@/store"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function Chat() {
  const {userInfo} = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if(!userInfo.profileSetup){
      toast("Bhau plz setup your Profile to continue")
      navigate("/profile")
    }
    
  }, [userInfo,navigate])
  
  return (
    <div>Chat</div>
  )
}

export default Chat