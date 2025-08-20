const app = require('./umair_index');
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
