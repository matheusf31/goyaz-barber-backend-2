type IWeekInfo = Array<{
  profitWithoutAdditionals: number;
  profitWithAdditionals: number;
  customers: number;
}>;

export default interface IAppointmentsInfo {
  totalAppointmentsInMonth: number;
  concludedAppointmentsInMonth: number;
  weekInfo: IWeekInfo;
  totalProfitInMonthWithoutAdditionals: number;
  totalProfitInMonthWithAdditionals: number;
  totalCustomersInMonth: number;
}
