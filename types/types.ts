export interface IMessage {
  text: string;
  user: boolean;
}

export interface IGoal {
  id: string;
  user_id: string
  created_at: string;
  title: string;
  goal_amount: number;
  category_id: string
}