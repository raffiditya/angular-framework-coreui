import { Organization } from './organization.model';
import { User } from './user.model';

export interface UserOrg {
  activeFlag: string;
  createdBy?: number;
  creationDate?: Date;
  endDate: string;
  id: number;
  lastUpdatedBy?: number;
  lastUpdatedDate?: Date;
  organization: Organization;
  startDate: string;
  user: User;
}
