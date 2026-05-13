
export interface Product {
  title: string;
  reviews: number;
  price: number;
  discountedPrice: number;
  images: string[];
  id: number;
  imgs: {
    thumbnails: string[];
    previews: string[];
  };
  category?: string; //  optional
}
