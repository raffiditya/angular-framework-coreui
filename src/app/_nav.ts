interface NavAttributes {
  [propName: string]: any;
}

interface NavWrapper {
  attributes: NavAttributes;
  element: string;
}

interface NavBadge {
  text: string;
  variant: string;
}

interface NavLabel {
  class?: string;
  variant: string;
}

export interface NavData {
  attributes?: NavAttributes;
  badge?: NavBadge;
  children?: NavData[];
  class?: string;
  divider?: boolean;
  icon?: string;
  label?: NavLabel;
  name?: string;
  title?: boolean;
  url?: string;
  variant?: string;
  wrapper?: NavWrapper;
}
