export interface User {
  activeFlag: string;
  authProvider: string;
  createdBy?: number;
  creationDate?: Date;
  description: string;
  id: number;
  lastUpdatedBy?: number;
  lastUpdatedDate?: Date;
  locked: string;
  password: string;
  username: string;
}
