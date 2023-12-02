
const express = require('express');
const app = express();
const port = 3000;
const path = require('path');


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'build')));


/* GET home page. */
app.get('/', function(req, res, next) {
  res.sendFile(path.join(process.cwd(), "build/index.html"));
});

app.listen(port, () => {
    console.log(`Dalogic app listening at http://localhost:${port}`)
})




