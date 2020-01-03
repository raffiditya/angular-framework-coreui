import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { constant } from '../../../environments/constant';
import { PagedApiResponse, PageRequest } from '../../lib/model';
import { toIsoDateFormat } from '../../util';
import { AdminModule } from '../admin.module';
import { ApiLog } from '../model';

@Injectable({ providedIn: AdminModule })
export class ApiLogService {

  constructor(private http: HttpClient) {}

  getTableRows(dateMin: Date, dateMax: Date, page: PageRequest): Observable<PagedApiResponse<ApiLog>> {
    this.populatePageRequest(dateMin, dateMax, page);

    return this.http.get<PagedApiResponse<ApiLog>>(
      `${constant.appUrl}/api-log`,
      {
        params: page.requestParam
      }
    );
  }

  getTableRowsByUserId(userId: number, dateMin: Date, dateMax: Date, page: PageRequest)
    : Observable<PagedApiResponse<ApiLog>> {
    this.populatePageRequest(dateMin, dateMax, page);

    return this.http.get<PagedApiResponse<ApiLog>>(
      `${constant.appUrl}/api-log/userId/${userId}`,
      {
        params: page.requestParam
      }
    );
  }

  private populatePageRequest(dateMin: Date, dateMax: Date, page: PageRequest) {
    if (dateMin != null) {
      page.requestParam
        .append('dateMin', toIsoDateFormat(dateMin));
    }

    if (dateMax != null) {
      page.requestParam
        .append('dateMax', toIsoDateFormat(dateMax));
    }
  }
}
