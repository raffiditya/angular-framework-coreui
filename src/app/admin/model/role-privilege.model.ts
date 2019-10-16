import { Privilege } from './privilege.model';
import { Role } from './role.model';

export interface RolePrivilege {
  canCreate: string;
  canDelete: string;
  canRead: string;
  canUpdate: string;
  createdBy?: number;
  creationDate?: Date;
  id: number;
  lastUpdatedBy?: any;
  lastUpdatedDate?: Date;
  privilege: Privilege
  role: Role;
}
