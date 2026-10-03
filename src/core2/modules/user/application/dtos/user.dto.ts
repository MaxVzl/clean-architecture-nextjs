export type UserDto = {
  id: string;
  name: string;
  email: string;
  money: {
    amount: number;
    currency: string;
  };
};
