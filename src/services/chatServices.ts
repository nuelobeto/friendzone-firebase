import { ref as dbRef, set, child, get, onValue } from "firebase/database";
import { auth, database, storage } from "../config/firebase";
import { UserT } from "../types/types";

const getUsers = async () => {
  const allUsers = dbRef(database, "users");
  let array: any[] = [];

  onValue(
    allUsers,
    (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val();
        array.push(childData);
      });
    },
    {
      onlyOnce: true,
    }
  );

  return array;
};

const chatServices = {
  getUsers,
};

export default chatServices;
