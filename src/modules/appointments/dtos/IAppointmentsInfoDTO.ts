export type IWeekServices = Array<{
  description: string;
  quantity: number;
}>;

type IWeekInfo = Array<{
  profitWithoutAdditionals: number;
  profitWithAdditionals: number;
  customers: number;
  services: IWeekServices;
}>;

export default interface IAppointmentsInfo {
  totalAppointmentsInMonth: number;
  concludedAppointmentsInMonth: number;
  weekInfo: IWeekInfo;
  totalProfitInMonthWithoutAdditionals: number;
  totalProfitInMonthWithAdditionals: number;
  totalCustomersInMonth: number;
  totalBarberProfit: number;
}
