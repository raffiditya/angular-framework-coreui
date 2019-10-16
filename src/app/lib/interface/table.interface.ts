import { Observable } from 'rxjs';
import { PagedApiResponse, PageRequest } from '../model';

export interface Table<T> {

  getTableRows(page: PageRequest): Observable<PagedApiResponse<T>>;
}
