import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { constant } from '../../../environments/constant';
import { BaseCrudTableService } from '../../lib/service';
import { AdminModule } from '../admin.module';
import { User } from '../model';

@Injectable({ providedIn: AdminModule })
export class UserService extends BaseCrudTableService<User> {

  constructor(http: HttpClient) {
    super(http, `${constant.adminUrl}/user`);
  }
}
