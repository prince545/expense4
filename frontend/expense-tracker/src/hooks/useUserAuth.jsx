import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const useUserAuth = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const checkUserAuth = () => {
      try {
        const userData = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (isMounted && userData && token) {
          setUser(JSON.parse(userData));
        } else if (isMounted) {
          navigate("/login");
        }
      } catch (error) {
        console.error("Failed to check user auth:", error);
        if (isMounted) {
          navigate("/login");
        }
      }
    };

    checkUserAuth();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  return user;
};
