export interface ApiResponse<T> {
  content?: T | Array<T>;
  message?: string;
}
