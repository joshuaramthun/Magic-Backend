import express from 'express';
import CardsController from './cards.controller.js';
import DecksController from './decks.controller.js';

const router = express.Router(); // Gets access to express router

router.route('/').get(CardsController.apiGetCards);
router.route('/id/:id').get(CardsController.apiGetCardById);
router.route('/name/:name').get(CardsController.apiGetCardByName);
router.route('/deck').get(DecksController.apiGetDecks);
router.route('/deck/id/:id').get(DecksController.apiGetDeckById);

router.route('/deck').post(DecksController.apiCreateDeck);

router.route('/deck').put(DecksController.apiModifyDeck);

router.route('/deck').delete(DecksController.apiDeleteDeck);

export default router;