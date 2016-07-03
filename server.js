const express = require('express');
const app = express();
const fs = require('fs');
const bookmarksFileName = './bookmarks.json';
const bookmarksFile = require(bookmarksFileName);

const bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

let bookmarkCount = Object.keys(bookmarksFile).length;

app.get('/bookmarks', (req, res) => {
  fs.readFile(bookmarksFileName, (err, data) => {
    if (err) return console.err(err);
    return res.end(data);
  });
});

app.post('/bookmarks', (req, res) => {
  bookmarkCount++;
  const newBookmark = {
    title: req.body.title,
    url: req.body.url,
    id: bookmarkCount,
  };

  bookmarksFile[`bookmark${bookmarkCount}`] = newBookmark;

  const file = JSON.stringify(bookmarksFile, null, 2);

  fs.writeFile(bookmarksFileName, file, (err) => {
    if (err) return console.err(err);
    return res.end(file);
  });
});

app.delete('/bookmarks', (req, res) => {
  const bookmarkToRemove = `bookmark${req.body.id}`;
  delete bookmarksFile[bookmarkToRemove];

  const file = JSON.stringify(bookmarksFile, null, 2);
  fs.writeFile(bookmarksFileName, file, (err) => {
    if (err) return console.err(err);
    return res.end(file);
  });
});

const server = app.listen(3000, () => {
  const host = server.address().address;
  const port = server.address().port;
});
