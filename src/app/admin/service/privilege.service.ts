import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { constant } from '../../../environments/constant';
import { BaseCrudService } from '../../lib/service';
import { AdminModule } from '../admin.module';
import { Privilege } from '../model';

@Injectable({ providedIn: AdminModule })
export class PrivilegeService extends BaseCrudService<Privilege> {

  constructor(http: HttpClient) {
    super(http, `${constant.adminUrl}/privilege`);
  }
}
