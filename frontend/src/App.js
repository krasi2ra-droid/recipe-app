import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";

const API = "https://recipe-app-3jmt.onrender.com";

function RecipeList({ category }) {
  const [recipes, setRecipes] = useState([]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [cat, setCat] = useState("");
  const [image, setImage] = useState("");

  const [editingId, setEditingId] = useState(null);

  const load = () => {
    fetch(API + "/recipes")
      .then(res => res.json())
      .then(data => {
        let filtered = data;

        if (category) {
          filtered = filtered.filter(r =>
            r.category.toLowerCase() === category.toLowerCase()
          );
        }

        setRecipes(filtered);
      });
  };

  useEffect(() => {
    load();
  }, [category]);

  async function addRecipe(e) {
    e.preventDefault();

    await fetch(API + "/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        content,
        category: cat,
        image
      })
    });

    clearForm();
    load();
  }

  async function updateRecipe(e) {
    e.preventDefault();

    await fetch(API + "/recipes/" + editingId, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        content,
        category: cat,
        image
      })
    });

    clearForm();
    load();
  }

  async function deleteRecipe(id) {
    await fetch(API + "/recipes/" + id, {
      method: "DELETE"
    });
    load();
  }

  function editRecipe(r) {
    setEditingId(r._id);
    setTitle(r.title);
    setContent(r.content);
    setCat(r.category);
    setImage(r.image);
  }

  function clearForm() {
    setEditingId(null);
    setTitle("");
    setContent("");
    setCat("");
    setImage("");
  }

  return (
    <div className="container">

      {/* ФОРМА */}
      <form onSubmit={editingId ? updateRecipe : addRecipe}>
        <input placeholder="Заглавие" value={title} onChange={e => setTitle(e.target.value)} />
        <input placeholder="Описание" value={content} onChange={e => setContent(e.target.value)} />
        <input placeholder="Категория (supi, salati...)" value={cat} onChange={e => setCat(e.target.value)} />
        <input placeholder="Снимка URL" value={image} onChange={e => setImage(e.target.value)} />

        <button type="submit">
          {editingId ? "Обнови" : "Добави"}
        </button>
      </form>

      {/* СПИСЪК */}
      {recipes.map(r => (
        <div key={r._id} className="card">
          <h3>{r.title}</h3>
          <p>{r.content}</p>
          {r.image && <img src={r.image} alt="" />}
          <div>{r.category}</div>

          <button onClick={() => editRecipe(r)}>✏️ Edit</button>
          <button onClick={() => deleteRecipe(r._id)}>🗑 Delete</button>
        </div>
      ))}
    </div>
  );
}

function App() {
  return (
    <Router>
      <h1 style={{ textAlign: "center" }}>🍲 Recipe App</h1>

      <nav className="nav">
        <Link to="/">Всички</Link>
        <Link to="/supi">Супи</Link>
        <Link to="/salati">Салати</Link>
        <Link to="/osnovni">Основни</Link>
        <Link to="/testeni">Тестени</Link>
        <Link to="/deserti">Десерти</Link>
      </nav>

      <Routes>
        <Route path="/" element={<RecipeList />} />
        <Route path="/supi" element={<RecipeList category="supi" />} />
        <Route path="/salati" element={<RecipeList category="salati" />} />
        <Route path="/osnovni" element={<RecipeList category="osnovni" />} />
        <Route path="/testeni" element={<RecipeList category="testeni" />} />
        <Route path="/deserti" element={<RecipeList category="deserti" />} />
      </Routes>
    </Router>
  );
}

export default App;
