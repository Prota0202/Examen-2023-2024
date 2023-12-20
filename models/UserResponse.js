// UserResponse.js
import Model from './Model.js';

export default class UserResponse extends Model {
    static table = "users6.Table2";
    static primary = ["id"];

    // Méthode pour obtenir toutes les réponses
    static async getAll() {
        return await this.loadMany();
    }
}
