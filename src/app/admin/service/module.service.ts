import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { constant } from '../../../environments/constant';
import { BaseCrudTableService } from '../../lib/service';
import { AdminModule } from '../admin.module';
import { Module } from '../model';

@Injectable({ providedIn: AdminModule })
export class ModuleService extends BaseCrudTableService<Module> {

  constructor(http: HttpClient) {
    super(http, `${constant.adminUrl}/module`);
  }
}
