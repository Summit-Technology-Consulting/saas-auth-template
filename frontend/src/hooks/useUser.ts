import { RootState } from "@/store";
import { User } from "@/types/user.types";
import { clearUser, setUser } from "@/userSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const useUser = () => {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const [isCanceled, setIsCanceled] = useState(user.plan.name === "canceled");

  const updateUser = (userData: Partial<User>) => {
    dispatch(setUser(userData));
  };

  const clearUserData = () => {
    dispatch(clearUser());
  };

  useEffect(() => {
    setIsCanceled(user.plan.name === "canceled");
  }, [user]);

  return {
    user,
    updateUser,
    clearUserData,
    isCanceled,
  };
};

export default useUser;
