import DecksDAO from "../dao/decksDAO.js";


export default class DecksController {

    static async apiGetDeckById(req, res, next) {
        try {
            let id = req.params.id || {}
            let deck = await DecksDAO.getDeckById(id);
            if (!deck) {
                res.status(404).json({ error: "not found deck by id"});
                return;
            }
            res.json(deck);
          } catch(e) {
              console.log(`API, ${e}`);
              res.status(500).json({ error: e });
          }
    }

    static async apiGetDecks(req, res, next) {
        const decksPerPage = req.query.decksPerPage ?
          parseInt(req.query.decksPerPage) : 20;
        const page = req.query.page ? parseInt(req.query.page) : 0;

        let filters = {}
        if (req.query.userId) {
            filters.userId = req.query.userId;
        }

        const { decksList, totalNumDecks } = await
          DecksDAO.getDecks({ filters, page, decksPerPage});

          let response = {
            decks: decksList,
            page: page,
            filters: filters,
            entries_per_page: decksPerPage,
            total_results: totalNumDecks,
          };
          res.json(response);
    }

    static async apiCreateDeck(req, res, next) {
        try {
            const deckName = req.body.deck_name;
            const userInfo = {
                name: req.body.user_name,
                _id: req.body.user_id,
            }

            const date = new Date();

            const cards = req.body.cards;

            const decksResponse = await DecksDAO.addToDecks(
                deckName,
                userInfo,
                date,
                cards
            );

            var { error } = decksResponse;
            
            if (error) {
                res.status(500).json({ error: "Unable to create new deck in Decks." });
            } else {
                res.json({
                    status: "success",
                    response: decksResponse
                });
            }
        } catch (e) {
            res.status(500).json({ error: e });
        }
    }

    static async apiModifyDeck(req, res, next) {
        try {
            let data = {
                deck_name: req.body.deck_name,
                user_name: req.body.user_name,
                user_id: req.body.user_id,
                date: new Date(),
                cards: req.body.cards,

            }

            const deckResponse = await DecksDAO.updateDeck(data, req.body._id);

            var { error } = deckResponse;
            
            if (error) {
                res.status(500).json({ error: "Unable to update deck." });
            } else {
                res.json({
                    status: "success",
                    response: deckResponse
                });
            }
        } catch (e) {
            res.status(500).json({ error: e });
        }
    }

    static async apiDeleteDeck(req, res, next) {
        try {
            const deckId = req.body.deck_id;

            const deckResponse = await DecksDAO.deleteDeck(deckId);

            var { error } = deckResponse;
            
            if (error) {
                res.status(500).json({ error: "Unable to delete deck." });
            } else {
                res.json({
                    status: "success",
                    response: deckResponse
                });
            }
        } catch (e) {
            res.status(500).json({ error: e });
        }
    }

}