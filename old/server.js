const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://Brooke:preslikrisi99@ac-dksmkfx-shard-00-00.opyc2e6.mongodb.net:27017,ac-dksmkfx-shard-00-01.opyc2e6.mongodb.net:27017,ac-dksmkfx-shard-00-02.opyc2e6.mongodb.net:27017/recipes?ssl=true&replicaSet=atlas-d0l1p4-shard-0&authSource=admin&retryWrites=true&w=majority")
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ Mongo error:", err));

const Recipe = mongoose.model('Recipe', {
  title: String,
  content: String,
  category: String,
  image: String
});

app.get('/recipes', async (req, res) => {
  const data = await Recipe.find();
  res.json(data);
});

app.post('/recipes', async (req, res) => {
  const recipe = new Recipe(req.body);
  await recipe.save();
  res.json(recipe);
});

app.put('/recipes/:id', async (req, res) => {
  const updated = await Recipe.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

app.delete('/recipes/:id', async (req, res) => {
  await Recipe.findByIdAndDelete(req.params.id);
  res.send('Deleted');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
