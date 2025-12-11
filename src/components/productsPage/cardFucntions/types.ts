export type Product = {
  id: number | string;
  title: string;
  price?: number;
  image?: string;
  shortDescription?: string;
  long_description?: string;
  features?: string[];
  year?: number;
  ram?: string;
  warranty?: string;
};

export type RouterLike = {
  push: (path: string) => void;
};
