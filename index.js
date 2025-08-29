import 'dotenv/config';
import express from 'express';
import { initRoute } from './routes.js';
import cors from 'cors';

const bootstrap = () => {
  console.log('Bootstrapping the application...');
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(cors());
  app.use(express.json());
  app.use(express.static('public'));
  //   app.use(express.urlencoded({ extended: true }));
  initRoute(app);
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

bootstrap();
