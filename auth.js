import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { ref, set } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";

const form = document.getElementById("authForm");
const msg = document.getElementById("msg");
const mode = form.dataset.mode;

onAuthStateChanged(auth, u => { if (u && mode === "login") location.href = "dashboard.html"; });

form.addEventListener("submit", async e => {
  e.preventDefault();
  const email = form.email.value.trim(), password = form.password.value;
  const btn = form.querySelector("button"); btn.disabled = true; msg.textContent = "";
  try {
    if (mode === "register") {
      const name = form.name.value.trim();
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName: name });
      await set(ref(db, "users/" + user.uid + "/profile"),
        { name, email, department: form.department.value.trim(), createdAt: Date.now() });
    } else {
      await signInWithEmailAndPassword(auth, email, password);
    }
    location.href = "dashboard.html";
  } catch (err) {
    msg.textContent = err.code === "auth/invalid-credential" ? "Email or password is incorrect."
      : err.code === "auth/email-already-in-use" ? "This email already has an account. Log in instead."
      : err.code === "auth/weak-password" ? "Use a password with at least 6 characters."
      : err.message;
    btn.disabled = false;
  }
});
