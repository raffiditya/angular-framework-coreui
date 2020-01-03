import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { constant } from '../../../environments/constant';
import { BaseCrudTableRelationService } from '../../lib/service';
import { AdminModule } from '../admin.module';
import { RolePrivilege } from '../model';

@Injectable({ providedIn: AdminModule })
export class RolePrivilegeService extends BaseCrudTableRelationService<RolePrivilege> {

  constructor(http: HttpClient) {
    super(http, `${constant.adminUrl}/role-privilege`);
  }
}
