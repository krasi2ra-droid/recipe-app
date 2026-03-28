const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://Brooke:preslikrisi99@cluster0.cb3cklz.mongodb.net/recipes");

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

app.delete('/recipes/:id', async (req, res) => {
  await Recipe.findByIdAndDelete(req.params.id);
  res.send('Deleted');
});

app.listen(3000, () => console.log('Server running on 3000'));
