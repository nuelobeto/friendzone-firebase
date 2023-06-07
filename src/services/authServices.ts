import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  sendPasswordResetEmail,
  updatePassword,
  signOut,
} from "firebase/auth";
import { ref as dbRef, set, child, get } from "firebase/database";
import { auth, database, storage } from "../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { LoginT, SignupT } from "../types/types";
import { BASE_URL } from "./../config/baseUrl";

const provider = new GoogleAuthProvider();

const signup = async ({ email, password, username, avatar }: SignupT) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;
  const token = await user.getIdToken();

  if (user) {
    const actionCodeSettings = {
      url: `${BASE_URL}/login`,
      handleCodeInApp: true,
    };
    await sendEmailVerification(user, actionCodeSettings);
  }

  const storageRef = ref(storage, `${user.uid}`);
  await uploadBytes(storageRef, avatar);

  const url = await getDownloadURL(storageRef);

  const userToreturn = {
    id: user.uid,
    token,
    username,
    email,
    avatar: url,
  };

  set(dbRef(database, "users/" + user.uid), userToreturn);

  return userToreturn;
};

const login = async ({ email, password }: LoginT) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;

  const existingUser = await get(child(dbRef(database), `users/${user.uid}`));

  if (existingUser.exists()) {
    localStorage.setItem("user", JSON.stringify(existingUser.val()));
    return existingUser.val();
  }
};

const sendPasswordResetLink = async (email: string) => {
  const actionCodeSettings = {
    url: `${BASE_URL}/reset-password`,
    handleCodeInApp: true,
  };
  await sendPasswordResetEmail(auth, email, actionCodeSettings);
};

const resetPassword = async (password: string) => {
  const user = auth.currentUser;

  if (user) {
    await updatePassword(user, password);
  }
};

const googleAuth = async () => {
  const result = await signInWithPopup(auth, provider);
  const credential = GoogleAuthProvider.credentialFromResult(result);
  const user = result.user;

  const userToreturn = {
    id: user.uid,
    token: credential?.accessToken,
    username: user.displayName,
    email: user.email,
    avatar: user.photoURL,
  };

  const existingUser = await get(child(dbRef(database), `users/${user.uid}`));

  if (existingUser.exists()) {
    localStorage.setItem("user", JSON.stringify(existingUser.val()));
    return existingUser.val();
  } else {
    set(dbRef(database, "users/" + user.uid), userToreturn);
    localStorage.setItem("user", JSON.stringify(userToreturn));
    return userToreturn;
  }
};

const logout = async () => {
  await signOut(auth);
  localStorage.removeItem("user");
  localStorage.removeItem("chat");
};

const authServices = {
  signup,
  login,
  sendPasswordResetLink,
  resetPassword,
  googleAuth,
  logout,
};
export default authServices;
