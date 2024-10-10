export interface ProductPage {
  id: number;
  name: string;
  slug: string;
  fullPath: string;
  images: string[];
  title: string;
  active: boolean;
  hasQuantity: boolean;
  metaTitle: string;
  metaDescription: string;
}
