import { Role } from './role.model';
import { User } from './user.model';

export interface UserRole {
  activeFlag: string;
  createdBy?: number;
  creationDate?: Date;
  endDate: string;
  id: number;
  lastUpdatedBy?: number;
  lastUpdatedDate?: Date;
  role: Role;
  startDate: string;
  user: User;
}
