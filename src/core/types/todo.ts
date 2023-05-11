export interface Todo {
  id: string;
  title: string;
  isDone: boolean;
  created: {
    nanoseconds: number;
    seconds: number;
  };
  deadline: string;
}
