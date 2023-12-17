export interface IMessage {
  text: string;
  user: boolean;
}

export interface IGoal {
  id: string;
  user_id?: string;
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

export interface ITransactionWithFK {
  id: number;
  user_id: number;
  category_id: ICategory;
  goal_id: IGoal;
  origin: string;
  place: string;
  movement: number;
  description: string;
  created_at: string;
}
export interface ITransaction {
  id: number;
  user_id: number;
  category_id: number;
  goal_id: number;
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

export interface IEditGoalProps {
  goalId: string;
  goals: IGoal[];
  setGoals: React.Dispatch<React.SetStateAction<IGoal[]>>;
}

export interface IExpenseForm {
  goal: string;
  category: string;
  origin: string;
  place: string;
  movement: string;
  description: string;
}

export interface ISidemenuParams {
  name: string;
  profileImage?: string;
  balance: number;
  chats: {
    name: string;
    id: string;
  }[];
}

export interface IKPI {
  allTransCount: number;
  allUsersCount: number;
  allChatsCount: number;
  weeklyKPI: {
    active_users_count: number;
    average_actions: number;
  }[];
  dailyKPI: {
    event_date: string;
    active_users_per_day: number;
    average_events_per_day_per_user: number;
    events_per_day: number;
  }[];
}
