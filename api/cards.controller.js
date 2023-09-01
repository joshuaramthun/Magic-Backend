import CardsDAO from '../dao/cardsDAO.js';

export default class CardsController {

    static async apiGetCards(req, res, next) {
        const cardsPerPage = req.query.cardsPerPage ?
          parseInt(req.query.cardsPerPage) : 20;
        const page = req.query.page ? parseInt(req.query.page) : 0;

        let filters = {}
        if (req.query.name) {
          filters.name = req.query.name;
        }

        const { cardsList, totalNumCards } = await CardsDAO.getCards({filters, page, cardsPerPage });

        let response = {
            cards: cardsList,
            page: page,
            filters: filters,
            entries_per_page: cardsPerPage,
            total_results: totalNumCards,
        };
        res.json(response);
    }

    static async apiGetCardById(req, res, next) {
      try {
        let id = req.params.id || {}
        let card = await CardsDAO.getCardById(id);
        if (!card) {
            res.status(404).json({ error: "not found card by id"});
            return;
        }
        res.json(card);
      } catch(e) {
          console.log(`API, ${e}`);
          res.status(500).json({ error: e });
      }
    }

    static async apiGetCardByName(req, res, next) {
        try {
          let name =req.params.name || {}
          let card = await CardsDAO.getCardByName(name);
          if (!card) {
            res.status(404).json({ error: "card not found by name"});
            return ;
          }
          res.json(card);
        } catch(e) {
          console.log(`API, ${e}`);
          res.status(500).json({ error: e });
        }
    }
}