(() => {
  function ajax(options) {
    const request = new XMLHttpRequest();
    const requestParams = Object.assign({}, options);

    request.open(requestParams.method, requestParams.url, true);

    if (options.method.toUpperCase() === 'POST') {
      request.setRequestHeader('Content-Type', 'application/json');
    }

    request.onload = () => {
      if (request.status === 200) {
        options.success(request.response);
      } else {
        options.error(request.response);
      }
    };

    request.send(requestParams.data);
  }

  function removeBookmark(bookmarkId) {
    const bookmark = document.querySelector(`[data-id=${bookmarkId}]`);
    bookmark.parentNode.removeChild(bookmark);
  }
  function deleteBookmark(bookmarkId) {
    ajax({
      method: 'DELETE',
      url: `http://localhost:3000/bookmarks/${bookmarkId}`,
      success: (bmId) => {
        removeBookmark(bmId);
      },
      error: () => {
        console.error('Failure removing bookmark');
      },
    });
  }

  function bindBookmarkDeletion(btn, id) {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      deleteBookmark(id);
    });
  }

  function createDeleteBtn(bookmarkElement) {
    const bookmarkId = bookmarkElement.dataset.id;
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    bindBookmarkDeletion(deleteBtn, bookmarkId);
    bookmarkElement.appendChild(deleteBtn);
  }

  function addBookmark(bookmark) {
    const tag = document.createElement('li');
    const title = bookmark.title;
    const url = bookmark.url;
    tag.innerHTML = `<a href='${url}'>${title}</a>`;
    tag.dataset.id = bookmark.id;
    createDeleteBtn(tag);
    document.getElementById('bookmark-container').appendChild(tag);
  }


  function populatePage(bookmarks) {
    Object.keys(bookmarks).forEach((bookmark) => {
      addBookmark(bookmarks[bookmark]);
    });
  }

  function clearInputFields() {
    const inputFields = document.getElementById('bookmark-form')
                                .querySelectorAll('input');
    inputFields.forEach((inputField) => {
      const clearField = inputField;
      clearField.value = '';
    });
  }

  function fetchBookmarks() {
    ajax({
      method: 'GET',
      url: 'http://localhost:3000/bookmarks',
      success: (bookmarks) => {
        populatePage(JSON.parse(bookmarks));
      },
      error: () => {
        console.error('Failure fetching bookmarks');
      },
    });
  }

  function createNewBookmark(newBookmark) {
    ajax({
      method: 'POST',
      url: 'http://localhost:3000/bookmarks',
      data: JSON.stringify(newBookmark),
      success: (bm) => {
        clearInputFields();
        addBookmark(JSON.parse(bm));
      },
      error: () => {
        console.error('Failure adding bookmark');
      },
    });
  }

  function bindFormSubmission() {
    const btn = document.getElementById('button');
    const form = document.getElementById('bookmark-form');

    btn.addEventListener('click', (e) => {
      e.preventDefault();

      const title = form.querySelectorAll('input')[0].value;
      const url = form.querySelectorAll('input')[1].value;

      const newBookmark = {
        bookmark_title: title,
        bookmark_url: url,
      };
      createNewBookmark(newBookmark);
    });
  }

  function initialize() {
    fetchBookmarks();
    bindFormSubmission();
  }

  document.addEventListener('DOMContentLoaded', initialize);
})();
