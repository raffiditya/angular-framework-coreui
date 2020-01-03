import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { constant } from '../../../environments/constant';
import { BaseCrudTableRelationService } from '../../lib/service';
import { AdminModule } from '../admin.module';
import { UserRole } from '../model';

@Injectable({ providedIn: AdminModule })
export class UserRoleService extends BaseCrudTableRelationService<UserRole> {

  constructor(http: HttpClient) {
    super(http, `${constant.adminUrl}/user-role`);
  }
}
