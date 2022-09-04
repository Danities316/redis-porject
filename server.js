// const winston = require('winston')
const app = require('./app');

// Connecting to servers
const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}...`);
    // winston.info(`Server started and running on http://${host}:${port}`);
});

