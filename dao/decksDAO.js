import mongodb from 'mongodb';
const ObjectId = mongodb.ObjectId;

let decks;

export default class DecksDAO {
    static async injectDB(conn) {
        if (decks) {
            return;
        }
        try {
            decks = await conn.db(
                process.env.COLLECTION)
                .collection('Decks');
        } catch (e) {
            console.error(`Unable to connect to decksDAO: ${e}`);
        }
    }

    static async getDeckById(id) {
        try {
            return await decks.aggregate([
              {
                $match: {
                    _id: new ObjectId(id),
                }
              }]).next();
          } catch (e) {
            console.error(`unable to get deck by id: ${e}`);
            throw e;
          }
    }

    static async getDecks({
        filters = null,
        page = 0,
        decksPerPage = 20,
    } = {}) {// empty object as defalut value
        let query;
        if(filters) {
            if ('userId' in filters) {
                query = {"user_id": filters['userId']};
            }
        }

        let cursor;
        try {
            cursor = await decks.find(query)
                                .limit(decksPerPage)
                                .skip(decksPerPage * page);
            const decksList = await cursor.toArray();
            const totalNumDecks = await decks.countDocuments(query);
            return { decksList, totalNumDecks};
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`);
            return { decksList: [], totalNumDecks: 0};
        }
    }
    

    static async addToDecks(deckName, user, date, cards) {
        try {
            const newDeckDoc = {
                deck_name: deckName,
                user_name: user.name,
                user_id: user._id,
                date: date,
                cards: cards
            }
            return await decks.insertOne(newDeckDoc);
        } catch (e) {
            console.error(`Unable to add to Decks: ${e}`);
            return { error: e};
        }
    }

    static async deleteDeck(deckId) {
        try {
            return await decks.deleteOne(
                {_id: new ObjectId(deckId)},
            )
        } catch (e) {
            console.error(`Unable to delete deck: ${e}`);
            return { error: e };
        }
    }

    static async updateDeck(data, id) {
        try {
        return await decks.updateOne(
            {_id: new ObjectId(id)},
            [
                {$set: data}
            ]
        );
        } catch (e) {
            console.error(`Unable to update deck: ${e}`);
            return { error:e };
        }
    }
}