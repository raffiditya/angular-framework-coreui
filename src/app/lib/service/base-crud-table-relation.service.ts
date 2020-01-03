import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { TableRelation } from '../interface';
import { PagedApiResponse, PageRequest } from '../model';
import { BaseCrudTableService } from './base-crud-table.service';

export abstract class BaseCrudTableRelationService<T> extends BaseCrudTableService<T> implements TableRelation<T> {

  protected constructor(http: HttpClient, url: string, public relationColumn: string = 'relationId') {
    super(http, url);
  }

  getTableRows(page: PageRequest): Observable<PagedApiResponse<T>> {
    throw throwError({ message: `Relation id required.` });
  }

  getRowsFromRelation(page: PageRequest, relId: number): Observable<PagedApiResponse<T>> {
    return this.http.get<PagedApiResponse<T>>(
      `${this.url}`,
      {
        params: page.requestParam
          .append(this.relationColumn, relId.toString())
      }
    );
  }
}
