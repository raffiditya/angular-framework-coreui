import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { constant } from '../../../environments/constant';
import { BaseCrudTableRelationService } from '../../lib/service';
import { AdminModule } from '../admin.module';
import { UserOrg } from '../model';

@Injectable({ providedIn: AdminModule })
export class UserOrganizationService extends BaseCrudTableRelationService<UserOrg> {

  constructor(http: HttpClient) {
    super(http, `${constant.appUrl}/admin/user-org`, 'userId');
  }
}
