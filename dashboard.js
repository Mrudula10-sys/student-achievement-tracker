import { db } from "./firebase-config.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";
import { shell, esc } from "./app.js";

const u = await shell();
document.getElementById("hello").textContent = "Welcome, " + (u.displayName || "Student");
const nodes = { certificates: ["certTotal","Certificate","title"], nptel: ["nptelTotal","NPTEL","course"], competitions: ["compTotal","Competition","event"] };
const all = {};
Object.entries(nodes).forEach(([n,[id,label,key]]) => {
  onValue(ref(db, "users/"+u.uid+"/"+n), s => {
    const d = s.val() || {};
    document.getElementById(id).textContent = Object.keys(d).length;
    all[n] = Object.values(d).map(r => ({ t: r[key], label, at: r.createdAt, extra: r.date || (r.score ? r.score + "%" : "") || r.result || "" }));
    const list = Object.values(all).flat().sort((a,b) => b.at - a.at).slice(0,6);
    document.getElementById("recent").innerHTML = list.length
      ? list.map(r => "<li><b>"+esc(r.t)+"</b><span>"+r.label+(r.extra?" · "+esc(r.extra):"")+"</span></li>").join("")
      : '<li class="empty">Nothing recorded yet. Add your first certificate to get started.</li>';
  });
});
