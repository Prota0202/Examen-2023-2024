import Model from './Model.js';

export default class Task extends Model {
    static table = "users6.Table";
    static primary = ["id"];

    // Ajoutez la méthode getRandom
    static async getRandom() {
        // La requête SQL pour obtenir un mot aléatoire
        const query = `SELECT * FROM ${this.table} ORDER BY RAND() LIMIT 1`;
        const rows = await this.loadMany();
        return rows.length > 0 ? rows[0] : null;

        
    }

    static async create({ word, correctAnswer }) {
      const query = `INSERT INTO ${this.table} (word, correctAnswer) VALUES (?, ?)`;
      await Model.query(query, [word, correctAnswer]); 
  }
}
