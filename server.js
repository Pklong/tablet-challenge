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

let bookmarkId;
const bookmarkEntries = Object.keys(bookmarksFile);

if (bookmarkEntries.length < 1) {
  bookmarkId = 0;
} else {
  const lastBookmarkEntry = bookmarkEntries.pop();
  bookmarkId = lastBookmarkEntry[lastBookmarkEntry.length - 1];
}

app.get('/bookmarks', (req, res) => {
  fs.readFile(bookmarksFileName, (err, data) => {
    if (err) return console.error(err);
    return res.end(data);
  });
});

app.post('/bookmarks', (req, res) => {
  bookmarkId++;
  const newBookmark = {
    title: req.body.bookmark_title,
    url: req.body.bookmark_url,
    id: bookmarkId,
  };

  bookmarksFile[`bookmark${bookmarkId}`] = newBookmark;

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
  const port = server.address().port;
  console.log(`Tablet challenge available at localhost:${port}`);
});
