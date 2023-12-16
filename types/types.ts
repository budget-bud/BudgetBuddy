export interface IMessage {
  text: string;
  user: boolean;
}

export interface IGoal {
  id: string;
  user_id: string;
  created_at: string;
  title: string;
  goal_amount: number;
  category_id: string;
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

export interface IEditGoalProps {
  goalId: string;
  goals: IGoal[];
  setGoals: React.Dispatch<React.SetStateAction<IGoal[]>>;
}
