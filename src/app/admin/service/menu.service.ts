import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { constant } from '../../../environments/constant';
import { BaseCrudTableService } from '../../lib/service';
import { AdminModule } from '../admin.module';
import { Menu } from '../model';

@Injectable({ providedIn: AdminModule })
export class MenuService extends BaseCrudTableService<Menu> {

  constructor(http: HttpClient) {
    super(http, `${constant.adminUrl}/menu`);
  }
}
