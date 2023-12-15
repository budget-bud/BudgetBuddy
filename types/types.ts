export interface IMessage {
  text: string;
  user: boolean;
}

export interface Category {
  id: string;
  created_at: string;
  title: string;
  limit: number;
}

export interface EditCategoryProps {
  categoryId: string;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
}
