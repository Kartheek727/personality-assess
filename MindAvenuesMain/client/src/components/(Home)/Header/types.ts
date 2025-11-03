// components/Header/types.ts
export interface NavItemChildType {
    label: string;
    href: string;
  }
  
  export interface NavItemType {
    label: string;
    href: string;
    children?: NavItemChildType[];
  }