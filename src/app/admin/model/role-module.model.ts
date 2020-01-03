import { Module } from './module.model';
import { Role } from './role.model';

export interface RoleModule {
  activeFlag: string;
  createdBy?: number;
  creationDate?: Date;
  endDate: string;
  id: number;
  lastUpdatedBy?: number;
  lastUpdatedDate?: Date;
  module: Module;
  role: Role;
  startDate: string;
}
