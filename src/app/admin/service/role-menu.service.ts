import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { constant } from '../../../environments/constant';
import { BaseCrudTableRelationService } from '../../lib/service';
import { AdminModule } from '../admin.module';
import { RoleMenu } from '../model';

@Injectable({ providedIn: AdminModule })
export class RoleMenuService extends BaseCrudTableRelationService<RoleMenu> {

  constructor(http: HttpClient) {
    super(http, `${constant.adminUrl}/role-menu`);
  }
}
