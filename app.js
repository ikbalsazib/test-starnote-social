//Install express server
const express = require('express');
const path = require('path');

const app = express();

// Serve only the static files form the dist directory
// Replace the '/dist/<to_your_project_name>'
app.use(express.static(__dirname + '/www'));

app.get('*', function (req, res) {
    // Replace the '/dist/<to_your_project_name>/index.html'
    res.sendFile(path.join(__dirname + '/www/index.html'));
});

// For Main Server..
const port = process.env.PORT || 8200;
app.listen(port, () => console.log(`Server is running at port:${port}`));
