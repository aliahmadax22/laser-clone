import type { LocationQuery } from "vue-router";

export interface Label {
  [key: string]: string;
}

export interface Labels {
  [category: string]: Label;
}

export type ImageProperty = "src" | "alt";

export interface Image {
  [key: string]: {
    [property in ImageProperty]: string;
  };
}

export interface Images {
  [category: string]: Image;
}

export interface Setting {
  [key: string]: string;
}
export interface Settings {
  [category: string]: Setting;
}

export interface MenuItemSubCategory {
  name: string;
  image?: string | null;
  link: string | LocationQuery;
  badge?: string | null;
  infoIcon?: string | null;
}

export interface MenuItem {
  name: string;
  link: string | null | LocationQuery;
  image: string | null;
  subCategories: MenuItemSubCategory[] | null;
}

export interface Menus {
  [category: string]: MenuItem[];
}

export interface Content {
  labels: Labels;
  images: Images;
  settings: Settings;
  menus: Menus;
}
