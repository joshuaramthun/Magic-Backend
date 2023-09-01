import express from 'express';
import cors from 'cors';
import magic from './api/magic.route.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1/magic', magic);
app.use('*', (req, res) => {
    res.status(404).json({ error: 'not found unknown url' });
}); 

export default app;