export type IServices = Array<{
  description: string;
  quantity: number;
}>;

export interface IDayOfWeekInfo {
  clients: number;
  date: Date;
  services: IServices;
}

export type IWeekInfo = {
  [key: string]: IDayOfWeekInfo;
} & {
  profitWithoutAdditionals: number;
  profitWithAdditionals: number;
};

interface IAppointmentsDailyInfo {
  [key: string]: IWeekInfo;
}

export type IAppointmentExtraDailyInfo = IAppointmentsDailyInfo & {
  totalClientsInMonth: number;
  totalProfitInMonthWithoutAdditionals: number;
  totalProfitInMonthWithAdditionals: number;
};
