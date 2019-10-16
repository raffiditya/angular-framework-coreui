import { Observable } from 'rxjs';
import { PagedApiResponse, PageRequest } from '../model';

export interface TableRelation<T> {

  relationColumn: string;

  getRowsFromRelation(page: PageRequest, relId: number): Observable<PagedApiResponse<T>>;
}
