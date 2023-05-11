import { onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect } from "react";
import { todosCollection } from "../../firebase";
import { saveTodos } from "../store/slices/todosSlice";
import { useThunkDispatch } from "../store/store";

export const useUpdateData = () => {
  const dispatch = useThunkDispatch();
  useEffect(() => {
    const q = query(todosCollection, orderBy("created", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      dispatch(
        saveTodos(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
      );
    });
    return () => unsubscribe();
  }, [dispatch]);
  return null;
};
