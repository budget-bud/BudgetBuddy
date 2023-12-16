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

export interface IGoals {
  id: number;
  user_id: number;
  title: string;
  description: string;
  goal_amount: number;
  category_id: number;
  created_at: string;
}

export interface ICategory2 {
  id: number;
  title: string;
  description: string;
  type: string;
  created_at: string;
}

export interface ITransaction {
  id: number;
  user_id: number;
  goal_id: number;
  category_id: number;
  origin: string;
  place: string;
  movement: number;
  description: string;
  created_at: string;
}

export interface IEditCategoryProps {
  categoryId: string;
  categories: ICategory[];
  setCategories: React.Dispatch<React.SetStateAction<ICategory[]>>;
}
