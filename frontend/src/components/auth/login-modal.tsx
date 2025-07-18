import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useUser from "@/hooks/useUser";
import { Plan } from "@/types/user.types";
import { getSession, signIn } from "next-auth/react";
import { useState } from "react";
import { toast } from "react-toastify";

export type AuthModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export default function AuthModal({ isOpen, setIsOpen }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const { updateUser } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      const res = await signIn("credentials", {
        redirect: false,
        username,
        password,
      });

      if (res?.error) {
        if (res.error === "Invalid credentials") {
          toast.error("Invalid credentials");
        } else {
          toast.error("Something went wrong. Try again.");
        }
      } else {
        const session = await getSession();

        if (!session?.user) {
          toast.error("Failed to login");
        }

        updateUser({
          username,
          id: Number(session?.user.id),
          creditBalance: session?.user?.startingCredits as number,
          email: session?.user.email as string,
          plan: session?.user.plan as Plan,
        });

        setIsOpen(false);
        setUsername("");
        setPassword("");
      }
    } else {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, email }),
      });

      const data = await response.json();

      if (response.status >= 400) {
        toast.error(data.error);
        return;
      }

      toast.success(data.message);
      setIsLogin(true);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-black">
            {isLogin ? "Login" : "Register"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-black">
              Username
            </Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="email" className="text-black">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="password" className="text-black">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-between">
            <Button type="submit">{isLogin ? "Login" : "Register"}</Button>
            <Button
              type="button"
              variant="link"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Need an account?" : "Already have an account?"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
