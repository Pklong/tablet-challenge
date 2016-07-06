const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

const bookmarksFileName = './bookmarks.json';
const bookmarksFile = require(bookmarksFileName);

const bodyParser = require('body-parser');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

let bookmarkCount = Object.keys(bookmarksFile).length;

// app.get('/', (req, res) => {
//   res.sendFile(path.join(`${__dirname}/../index.html`));
// });

app.get('/bookmarks', (req, res) => {
  fs.readFile(bookmarksFileName, (err, data) => {
    if (err) return console.error(err);
    return res.end(data);
  });
});

app.post('/bookmarks', (req, res) => {
  bookmarkCount++;
  const newBookmark = {
    title: req.body.bookmark_title,
    url: req.body.bookmark_url,
    id: bookmarkCount,
  };

  bookmarksFile[`bookmark${bookmarkCount}`] = newBookmark;

  const file = JSON.stringify(bookmarksFile, null, 2);

  fs.writeFile(bookmarksFileName, file, (err) => {
    if (err) return console.error(err);
    return res.end(JSON.stringify(newBookmark));
  });
});

app.delete('/bookmarks/:bookmarkId', (req, res) => {
  const bookmarkToRemove = `bookmark${req.params.bookmarkId}`;
  const bookmark = bookmarksFile[bookmarkToRemove];
  delete bookmarksFile[bookmarkToRemove];

  const file = JSON.stringify(bookmarksFile, null, 2);
  fs.writeFile(bookmarksFileName, file, (err) => {
    if (err) return console.error(err);
    return res.end(JSON.stringify(bookmark));
  });
});

const server = app.listen(3000, () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log(`Tablet challenge available at localhost:${port}`);
});
