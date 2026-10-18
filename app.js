import { auth } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

const links = [["dashboard.html","Dashboard"],["certificates.html","Certificates"],["nptel.html","NPTEL courses"],["competitions.html","Competitions"]];

export function shell() {
  return new Promise(res => onAuthStateChanged(auth, u => {
    if (!u) { location.href = "login.html"; return; }
    const here = location.pathname.split("/").pop();
    document.getElementById("side").innerHTML =
      '<div class="brand">Achievement<br>Tracker</div><nav>' +
      links.map(l => '<a href="'+l[0]+'"'+(l[0]===here?' class="on"':'')+'>'+l[1]+'</a>').join("") +
      '</nav><div class="who"><span>'+esc(u.displayName||"Student")+'</span><small>'+esc(u.email)+'</small><button id="out">Log out</button></div>';
    document.getElementById("out").onclick = () => signOut(auth).then(() => location.href = "login.html");
    res(u);
  }));
}
export const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
