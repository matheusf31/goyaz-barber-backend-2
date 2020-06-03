export default interface ICreateAppointmentDTO {
  provider_id: string;
  user_id: string;
  service:
    | 'corte'
    | 'corte e barba'
    | 'barba'
    | 'hot towel'
    | 'corte e hot towel';
  price: number;
  date: Date;
}
