export interface ItemListItem {
  name: string;
  image: string;
  link: string;
  badge: string | null;
  infoIcon: string | null;
}

export interface ItemList {
  title: string | null;
  items: ItemListItem[];
}

export interface Advantages {
  purchaseTitle: string;
  purchaseText: string;
  verificationTitle: string;
  verificationText: string;
  environmentTitle: string;
  environmentText: string;
  shippingTitle: string;
  shippingText: string;
}

export interface DataChecklist {
  title: string;
  description: string;
  image: string;
  buttonText: string;
  buttonLink: string;
}

export interface Options {
  title: string;
  description: string;
}

export interface HeroContent {
  title: string;
  coverImage: string;
  buttonText?: string | null;
  subtitle?: string | null;
  link?: string | null;
}

export interface HeadingSection {
  title: string;
  small: boolean;
  fullSpan: boolean;
}
export interface HtmlSection {
  html: string;
  avoidBreak: boolean;
}
export interface ImageGridSectionItem {
  src: string;
  title: string;
}
export interface ImageGridSection {
  items: ImageGridSectionItem[];
}
export interface BoxListSectionItem {
  title: string;
  html: string;
}
export interface BoxListSection {
  items: BoxListSectionItem[];
}
export interface ImageSection {
  src: string;
  alt: string | null;
  width: string | null;
  height: string | null;
  inline: boolean;
}

export type SectionType =
  | "heading"
  | "html"
  | "imageGrid"
  | "boxList"
  | "image";
export interface Section {
  id: number;
  type: SectionType;
  data:
    | HeadingSection
    | HtmlSection
    | ImageGridSection
    | BoxListSection
    | ImageSection;
}
export interface RichContent {
  columns: number;
  coloredBackground: boolean;
  sections: Section[];
}

export type PageTemplateContent =
  | ItemList
  | Advantages
  | DataChecklist
  | Options
  | HeroContent
  | RichContent;

export interface PageTemplateComponent {
  id: number;
  type: string;
  content: PageTemplateContent;
}

export interface PageTemplate {
  name: string;
  metaTitle: string;
  metaDescription: string;
  templateName: string;
  pageTemplateComponents: PageTemplateComponent[];
}
