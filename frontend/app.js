const API = "hottps://recipe-app-3jmt.onrender.com";
let editId = null;

/* LOAD */
async function loadRecipes() {
  const res = await fetch(API + "/recipes");
  let data = await res.json();

  const search = document.getElementById("search").value.toLowerCase();
  const category = getCategoryFromURL();

  const normalize = str => (str || "").trim().toLowerCase();

  data = data.filter(r =>
    r.title.toLowerCase().includes(search) &&
    (category === "" || normalize(r.category) === normalize(category))
  );

  const list = document.getElementById("list");
  list.innerHTML = "";

  data.forEach(r => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <h3>${r.title}</h3>
      <div class="category">${r.category || ""}</div>
      <p>${r.content}</p>
      ${r.image ? `<img src="${r.image}">` : ""}
      <br><br>
      <button onclick="editRecipe('${r._id}', '${r.title}', '${r.content}', '${r.image}', '${r.category}')">Edit</button>
      <button onclick="deleteRecipe('${r._id}')">Delete</button>
    `;

    list.appendChild(div);
  });
}

/* ADD / UPDATE */
async function addOrUpdate() {
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;
  const image = document.getElementById("image").value;
  const category = document.getElementById("category").value;

  const data = { title, content, image, category };

  if (editId) {
    await fetch(API + "/recipes/" + editId, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    editId = null;
  } else {
    await fetch(API + "/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
  }

  clearForm();
  loadRecipes();
}

/* EDIT */
function editRecipe(id, title, content, image, category) {
  editId = id;

  document.getElementById("title").value = title;
  document.getElementById("content").value = content;
  document.getElementById("image").value = image;
  document.getElementById("category").value = category;
}

/* DELETE */
async function deleteRecipe(id) {
  await fetch(API + "/recipes/" + id, { method: "DELETE" });
  loadRecipes();
}

/* CLEAR */
function clearForm() {
  document.getElementById("title").value = "";
  document.getElementById("content").value = "";
  document.getElementById("image").value = "";
  document.getElementById("category").value = "";
}

/* CATEGORY FROM URL */
function getCategoryFromURL() {
  const path = window.location.pathname;

  if (path.includes("supi")) return "Супи";
  if (path.includes("predqstiq")) return "Предястия";
  if (path.includes("osnovni")) return "Основни";
  if (path.includes("deserti")) return "Десерти";
  if (path.includes("testeni")) return "Тестени";
  if (path.includes("salati")) return "Салати";

  return "";
}

/* START */
loadRecipes();
