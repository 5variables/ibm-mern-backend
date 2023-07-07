const express = require('express');
const database = require('./config/database');
const eventRoutes = require('./routes/eventRoutes');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/', eventRoutes);

const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
