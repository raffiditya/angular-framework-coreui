import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { constant } from '../../../environments/constant';
import { BaseCrudTableService } from '../../lib/service';
import { AdminModule } from '../admin.module';
import { Organization } from '../model';

@Injectable({ providedIn: AdminModule })
export class OrganizationService extends BaseCrudTableService<Organization> {

  constructor(http: HttpClient) {
    super(http, `${constant.adminUrl}/organization`);
  }
}
