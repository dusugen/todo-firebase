import { Todo } from "./todo";

export type PatchTodo = Omit<Partial<Todo>, "id"> & Pick<Todo, "id">;
