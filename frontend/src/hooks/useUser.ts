import { RootState } from "@/store";
import { User } from "@/types/user.types";
import { clearUser, setUser } from "@/userSlice";
import { useDispatch, useSelector } from "react-redux";

const useUser = () => {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const updateUser = (userData: Partial<User>) => {
    dispatch(setUser(userData));
  };

  const clearUserData = () => {
    dispatch(clearUser());
  };

  return {
    user,
    updateUser,
    clearUserData,
  };
};

export default useUser;
