import { Menu } from './menu.model';
import { Role } from './role.model';

export interface RoleMenu {
  activeFlag: string;
  createdBy?: number;
  creationDate?: Date;
  endDate: string;
  id: number;
  lastUpdatedBy?: number;
  lastUpdatedDate?: Date;
  menu: Menu;
  role: Role;
  startDate: string;
}
