import { db } from "./firebase-config.js";
import { ref, push, set, update, remove, onValue } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";
import { shell, esc } from "./app.js";

export async function init(cfg) {
  const u = await shell();
  const base = "users/" + u.uid + "/" + cfg.node;
  const form = document.getElementById("rec"), body = document.getElementById("rows");
  const search = document.getElementById("q"), title = document.getElementById("formTitle");
  const cancel = document.getElementById("cancel");
  let data = {}, editId = null;

  form.querySelector(".fields").innerHTML = cfg.fields.map(f => {
    const req = f.req ? " required" : "";
    const input = f.type === "select"
      ? '<select name="'+f.k+'"'+req+'><option value="">Choose…</option>'+f.options.map(o=>'<option>'+o+'</option>').join("")+'</select>'
      : '<input name="'+f.k+'" type="'+(f.type||"text")+'"'+req+(f.type==="number"?' min="0" max="100"':'')+(f.ph?' placeholder="'+f.ph+'"':'')+'>';
    return '<label>'+f.label+input+'</label>';
  }).join("");
  document.getElementById("head").innerHTML = cfg.fields.map(f => "<th>"+f.label+"</th>").join("") + "<th></th>";
  title.textContent = cfg.addLabel;

  function render() {
    const q = search.value.toLowerCase();
    const items = Object.entries(data).filter(([,r]) => JSON.stringify(r).toLowerCase().includes(q))
      .sort((a,b) => b[1].createdAt - a[1].createdAt);
    document.getElementById("count").textContent = items.length;
    body.innerHTML = items.length ? items.map(([id,r]) => "<tr>" + cfg.fields.map(f => {
      const v = r[f.k] || "";
      return "<td>" + (f.type === "url" && /^https?:/.test(v) ? '<a href="'+esc(v)+'" target="_blank" rel="noopener">Open</a>' : esc(v)) + "</td>";
    }).join("") + '<td class="act"><button data-e="'+id+'">Edit</button><button class="del" data-d="'+id+'">Delete</button></td></tr>').join("")
      : '<tr><td colspan="'+(cfg.fields.length+1)+'" class="empty">'+(q ? "Nothing matches your search." : cfg.empty)+"</td></tr>";
  }
  onValue(ref(db, base), s => { data = s.val() || {}; render(); });
  search.addEventListener("input", render);

  function reset() { form.reset(); editId = null; title.textContent = cfg.addLabel; cancel.hidden = true; }
  cancel.onclick = reset;

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const rec = {};
    cfg.fields.forEach(f => rec[f.k] = form.elements[f.k].value.trim());
    if (editId) await update(ref(db, base + "/" + editId), rec);
    else await set(push(ref(db, base)), { ...rec, createdAt: Date.now() });
    reset();
  });

  body.addEventListener("click", async e => {
    const id = e.target.dataset.e, did = e.target.dataset.d;
    if (id) {
      editId = id; cfg.fields.forEach(f => form.elements[f.k].value = data[id][f.k] || "");
      title.textContent = cfg.editLabel; cancel.hidden = false; form.scrollIntoView({ behavior: "smooth" });
    }
    if (did && confirm("Delete this record? This cannot be undone.")) { await remove(ref(db, base + "/" + did)); if (editId === did) reset(); }
  });
}
