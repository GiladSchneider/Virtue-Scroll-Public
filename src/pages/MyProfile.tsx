import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { LoginCard, CompleteProfileForm } from "../components";
import { CircularProgress } from "@mui/material";
import { getIdFromSub, isProfileComplete } from "../helpers";

const MyProfile = () => {
  const { isAuthenticated, isLoading, user } = useAuth0();
  const [isProfileLoaded, setIsProfileLoaded] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  useEffect(() => {
    const checkProfileCompletion = async () => {
      if (user && user.sub) {
        const complete = await isProfileComplete(getIdFromSub(user.sub));
        setIsComplete(complete);
      }
      setIsProfileLoaded(true);
    };

    if (user) {
      checkProfileCompletion();
    } else {
      setIsProfileLoaded(true);
    }
  }, [user]);

  // if loading, display a loading spinner
  if (isLoading || !isProfileLoaded) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </div>
    );
  }

  // if not authenticated, display the login card
  if (!isAuthenticated) {
    return <LoginCard />;
  }

  // if no user, display a message
  if (!user || !user.sub) {
    return <div>There was an error loading your profile</div>;
  }

  // if profile is incomplete, display the complete profile form
  if (isComplete === false) {
    return <CompleteProfileForm />;
  }

  return (
    <div>Profile is complete</div>
  );
};

export default MyProfile;
