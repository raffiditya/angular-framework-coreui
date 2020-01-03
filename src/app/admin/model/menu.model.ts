export interface Menu {
  activeFlag?: string;
  children?: Array<Menu>;
  createdBy?: number;
  creationDate?: Date;
  description?: string;
  icon: string;
  id: number;
  lastUpdatedBy?: number;
  lastUpdatedDate?: Date;
  moduleId?: number;
  name: string;
  orderNo: number;
  parentId: any;
  titleFlag: string;
  url: string;
}
