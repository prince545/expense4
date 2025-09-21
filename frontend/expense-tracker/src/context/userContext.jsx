// import React, { createContext, useState } from "react";

// // Create context
// export const UserContext = createContext();

// // Provider component
// const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   // Function to update user data
//   const updateUser = (userData) => {
//     setUser(userData);
//   };

//   // Function to clear user data (e.g., on logout)
//   const clearUser = () => {
//     setUser(null);
//   };

//   return (
//     <UserContext.Provider value={{ user, updateUser, clearUser }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export default UserProvider;
import { createContext, useContext, useState } from "react";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const updateUser = (userData) => {
    setUser(userData);
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserAuth = () => useContext(UserContext);
