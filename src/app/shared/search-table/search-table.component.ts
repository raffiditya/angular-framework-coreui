import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Page } from '../../core/model/page.model';

const pattern: RegExp = /[^-_ a-zA-Z]/;

@Component({
  selector: 'app-search-table',
  templateUrl: './search-table.component.html',
  styleUrls: ['./search-table.component.scss']
})
export class SearchTableComponent {

  @Output() onSearch: EventEmitter<any> = new EventEmitter<any>();
  @Input() page: Page;
  @Input() rows: any[];
  @Input() table: DatatableComponent;

  onKeyPress($event: KeyboardEvent) {
    if ($event.key.match(pattern)) {
      $event.preventDefault();
    }
  }

  onInput(search: string, dataRows: any[], page: Page, datatable: DatatableComponent): void {
    if ((search.length > 0) && (search.length < 2)) {
      return;
    }

    datatable.sorts = [];
    page.sort = '';
    // empty data row.
    dataRows.splice(0, dataRows.length);

    if (search.match(pattern)) {
      return;
    }

    page.searchTerm = search;
    this.onSearch.emit();
  }
}
