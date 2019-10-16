import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Table } from '../interface';
import { PagedApiResponse, PageRequest } from '../model';
import { BaseCrudService } from './base-crud.service';

export abstract class BaseCrudTableService<T> extends BaseCrudService<T> implements Table<T> {

  protected constructor(http: HttpClient, url: string) {
    super(http, url);
  }

  getTableRows(page: PageRequest): Observable<PagedApiResponse<T>> {
    return this.http.get<PagedApiResponse<T>>(
      `${this.url}`,
      {
        params: page.requestParam
      }
    );
  }
}
