import { SubscribeButton } from "@/components/stripe/subscribe-button";
import { fetch } from "@/lib/utils";
import { useEffect, useState } from "react";

type LoggedInResponse = {
  username: string;
};

export const LoggedInUser = () => {
  const [username, setUsername] = useState("");

  const getUsername = async () => {
    const response = await fetch<LoggedInResponse>("/requires-auth");

    if (response) {
      setUsername(response.username);
    }
  };

  useEffect(() => {
    getUsername();
  }, []);

  return (
    <div>
      Your logged in username is: {username}
      <SubscribeButton />
    </div>
  );
};
