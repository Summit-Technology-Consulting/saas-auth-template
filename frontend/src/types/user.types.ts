export type User = {
  id: number | null;
  username: string;
  email: string;
  creditBalance: number;
  plan: Plan;
};

export type Plan = {
  name: string;
  subscription_id: string | null;
  expires_at: number | null;
};
