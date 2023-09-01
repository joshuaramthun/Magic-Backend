import mongodb from 'mongodb';
const ObjectId = mongodb.ObjectId;

let cards;

export default class CardsDAO {
    static async injectDB(conn) {
        if (cards) {
            return;
        }
        try {
            cards = await conn.db(
                process.env.COLLECTION)
                .collection('ScryfallCards');
        } catch (e) {
            console.error(`Unable to connect to cardsDAO: ${e}`);
        }
    }

    static async getCards({
        filters = null,
        page = 0,
        cardsPerPage = 20,
    } = {}) {

        let query;
        if(query) {
            if ('name' in filters) {
                query = {$text: {$search: filters['name']}};
            }
        }
        
        let cursor;
        try {
            cursor = await cards.find(query)
                                .limit(cardsPerPage)
                                .skip(cardsPerPage * page);
            const cardsList = await cursor.toArray();
            const totalNumCards = await cards.countDocuments(query);
            return { cardsList, totalNumCards};
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`);
            return { cardsList: [], totalNumCards: 0};
        }
    }

    static async getCardById(id) {
        try {
          return await cards.aggregate([
            {
              $match: {
                  _id: new ObjectId(id),
              }
            }]).next();
        } catch (e) {
          console.error(`unable to get card by id: ${e}`);
          throw e;
        }
      }

    static async getCardByName(name) {
        try {
            return await cards.aggregate([
                {
                    $match: {
                        name: name
                    }
                }]).next();
        } catch (e) {
            console.error(`unable to get card by name: ${e}`);
            throw e;
        }
    }
}