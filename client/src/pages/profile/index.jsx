import { useAppStore } from "@/store"

function Profile() {

  const { userInfo } = useAppStore()
  return (
    <div>
      <h1>Profile</h1>
      <p>Email: {userInfo.email}</p>
    </div>
  )
}

export default Profile