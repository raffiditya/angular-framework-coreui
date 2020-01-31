import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { PagedApiResponse, PageRequest } from '../../lib/model';

@Component({
  selector: 'app-search-table',
  templateUrl: './search-table.component.html',
  styleUrls: ['./search-table.component.scss']
})
export class SearchTableComponent {

  @Output() onSearch: EventEmitter<any> = new EventEmitter<any>();
  @Input() data: PagedApiResponse<any>;
  @Input() page: PageRequest;
  @Input() table: DatatableComponent;
  private readonly pattern: RegExp = /[^-_ a-zA-Z]/;

  onKeyPress($event: KeyboardEvent) {
    if ($event.key.match(this.pattern)) {
      $event.preventDefault();
    }
  }

  onInput(search: string, data: PagedApiResponse<any>, page: PageRequest, datatable: DatatableComponent): void {
    if ((search.length > 0) && (search.length < 2)) {
      return;
    }

    datatable.sorts = [];
    page.sort = '';
    data.totalElements = 0;
    data.totalPages = 0;
    data.number = 0;
    data.empty = true;
    data.content = [];

    if (search.match(this.pattern)) {
      return;
    }

    page.searchTerm = search;
    this.onSearch.emit();
  }
}
