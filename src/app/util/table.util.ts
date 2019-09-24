import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Page } from '../core/model/page.model';

export function sortTable(page: Page, event: any): void {
  page.pageNumber = 1;
  page.sort = `${event.column.prop},${event.newValue}`;
}

export function isSearchableTable(search: string, dataRows: any[], page: Page, datatable: DatatableComponent): boolean {
  if ((search.length > 0) && (search.length < 2)) {
    return false;
  }

  datatable.sorts = [];
  page.sort = '';
  // empty data row.
  dataRows.splice(0, dataRows.length);

  if (search.match(/[^-_ a-zA-Z]/g)) {
    return false;
  }

  page.searchTerm = search;
  return true;
}
