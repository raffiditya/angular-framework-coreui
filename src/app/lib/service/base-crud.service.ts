import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Crud } from '../interface';

export abstract class BaseCrudService<T> implements Crud<T> {

  protected constructor(protected http: HttpClient, protected url: string) {}

  search(searchTerm: string): Observable<Array<T>> {
    return this.http.get<Array<T>>(
      `${this.url}/searchSuggestion`,
      {
        params: {
          searchTerm: searchTerm
        }
      }
    );
  }

  get(id: number): Observable<T> {
    return this.http.get<T>(`${this.url}/${id}`);
  }

  add(newData: any): Observable<T> {
    return this.http.post<T>(`${this.url}`, newData);
  }

  edit(id: number, edited: any): Observable<T> {
    return this.http.put<T>(`${this.url}/${id}`, edited);
  }

  delete(id: number): Observable<T> {
    return this.http.delete<T>(`${this.url}/${id}`);
  }
}
