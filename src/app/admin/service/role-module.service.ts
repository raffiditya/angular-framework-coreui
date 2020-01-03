import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { constant } from '../../../environments/constant';
import { BaseCrudTableRelationService } from '../../lib/service';
import { AdminModule } from '../admin.module';
import { RoleModule } from '../model';

@Injectable({ providedIn: AdminModule })
export class RoleModuleService extends BaseCrudTableRelationService<RoleModule> {

  constructor(http: HttpClient) {
    super(http, `${constant.adminUrl}/role-module`);
  }
}
