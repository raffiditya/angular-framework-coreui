import { HttpParams } from '@angular/common/http';

export class PageRequest {

  constructor(
    public size: number = 10,
    public page: number = 1,
    public searchTerm?: string,
    public sort?: string
  ) {}

  get requestParam(): HttpParams {
    return new HttpParams(
      {
        fromObject: {
          page: `${this.page}`,
          size: `${this.size}`,
          searchTerm: `${this.searchTerm ? this.searchTerm : ''}`,
          sort: `${this.sort ? this.sort : ''}`
        }
      }
    );
  }
}
