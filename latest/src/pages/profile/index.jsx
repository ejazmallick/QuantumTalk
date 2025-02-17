import { useAppStore } from '../../store'; // Import the useAppStore function

const Profile = () => {
  const { userInfo } = useAppStore();
  return (
    <div>
      profile
      {userInfo ? (
        <div> Email: {userInfo.email} </div>
      ) : (
        <div>No user info available</div>
      )}
    </div>
  );
};

export default Profile;