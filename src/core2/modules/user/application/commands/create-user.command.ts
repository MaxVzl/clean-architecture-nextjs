export type CreateUserCommand = {
  name: string;
  email: string;
  money: {
    amount: number;
    currency: string;
  };
};
