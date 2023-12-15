export interface IMessage {
  text: string;
  user: boolean;
}

export interface ICategory {
  id: string;
  created_at: string;
  title: string;
  limit: number;
}

export interface IEditCategoryProps {
  categoryId: string;
  categories: ICategory[];
  setCategories: React.Dispatch<React.SetStateAction<ICategory[]>>;
}
