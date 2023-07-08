const express = require('express');
const database = require('./config/database');
const eventRoutes = require('./routes/eventRoutes');
const registerRoutes = require('./routes/registerRoutes');

const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/events', eventRoutes);

app.use('/register', registerRoutes);

const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
