import { Observable } from 'rxjs';

export interface Crud<T> {

  get(id: number): Observable<T>;

  add(id: number, newData: any): Observable<T>;

  edit(id: number, edited: any): Observable<T>;

  delete(id: number): Observable<T>;

  search(searchTerm: string): Observable<Array<T>>;
}
