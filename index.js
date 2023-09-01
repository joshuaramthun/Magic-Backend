import mongodb from 'mongodb';
import dotenv from 'dotenv';
import app from './server.js';
import CardsDAO from './dao/cardsDAO.js';
import DecksDAO from './dao/decksDAO.js';

async function main() {
    dotenv.config();

    const client = new mongodb.MongoClient(
        process.env.DB_URI
    );
    const port = process.env.PORT || 8000;

    try {
        //Connect to MongoDB server
        await client.connect();
        await CardsDAO.injectDB(client);
        await DecksDAO.injectDB(client);

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

main().catch(console.error);

export default app;