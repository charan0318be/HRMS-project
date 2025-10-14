// ProfileContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profileName, setProfileName] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("userName") || "";
    setProfileName(name);
  }, []);

  return (
    <ProfileContext.Provider value={{ profileName, setProfileName }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
