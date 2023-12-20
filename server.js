import express from 'express';
import Task from './models/Task.js';
import UserResponse from './models/UserResponse.js';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Route pour l'écran principal
app.get("/", async function (req, res) {
  try {
      const randomTask = await Task.getRandom(); // Récupérer un mot aléatoire

      if (randomTask) {
          // Si un mot aléatoire est trouvé, affichez-le
          res.render('main.ejs', { randomTask });
      } else {
          // Si aucun mot n'est trouvé, redirigez vers /results
          res.redirect('/results');
      }
  } catch (error) {
      console.error("Erreur : ", error);
      res.status(500).send("Erreur interne du serveur");
  }
});

// Route pour traiter la réponse de l'utilisateur
app.post("/answer", async function (req, res) {
      const { taskId, userAnswer } = req.body;
      const task = await Task.findById(taskId);

      const isCorrect = task.correctAnswer === userAnswer;
      // Enregistrer la réponse de l'utilisateur et si elle est correcte
      await UserResponse.create({ taskId, userAnswer, isCorrect });

      res.redirect('/');
});


// Route pour les résultats
app.get("/results", async function (req, res) {
  const userResponses = await UserResponse.getAll(); // Récupérer toutes les réponses de l'utilisateur
  const successPercentage = calculateSuccessPercentage(userResponses); // Calculer le pourcentage de succès

  res.render('results.ejs', { userResponses, successPercentage });
});

// Route pour ajouter un nouveau mot
app.post("/addWord", async function (req, res) {
      const { word, correctAnswer } = req.body;
      await Task.create({ word, correctAnswer });

      res.redirect('/results');
});

// Fonction pour calculer le pourcentage de succès
function calculateSuccessPercentage(responses) {
  const total = responses.length;
  const correct = responses.filter(response => response.isCorrect).length;
  return total > 0 ? (correct / total) * 100 : 0;
}

app.listen(4000)
