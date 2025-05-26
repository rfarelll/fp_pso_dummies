export type Transaction = {
  id?: string;
  type: string;
  amount: number;
  currency: string;
  countryFlag: string;
  desc?: string;
  date: Date | string;
};