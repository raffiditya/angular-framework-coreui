export interface ApiLog {
  date: Date;
  method?: string;
  request?: string;
  response?: string;
  statusCode?: number;
  url?: string;
  userId: number;
}
