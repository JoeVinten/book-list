const booksContainer = document.querySelector('.books-container');
const addBookBtn = document.querySelector('.btn-add');
const removeFormBtn = document.querySelector('.btn-remove');
const form = document.querySelector('.form');
const myLibrary = db.collection('books');

// Writes data to the database

const addBookToLibrary = (book) => {
  myLibrary
    .add({
      author: book.author,
      title: book.title,
      pages: book.pages,
      read: book.read,
      image: book.image,
    })
    .then((docRef) => {
      console.log('Document written with ID: ', docRef.id);
      getRenderData();
    })
    .catch((error) => {
      console.log('Error adding document: ', error);
    });
};

/*
 DB QUERIES
*/
// Gets inital data from the DB and envokes render

const getRenderData = () => {
  myLibrary
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        render(doc.data(), doc.id);
      });
    })
    .catch((error) => {
      console.log('Error getting documents: ', error);
    });
};

// Constructor which creates the book

function Book(author, title, pages, read, image) {
  this.author = author;
  this.title = title;
  this.pages = pages;
  this.read = read;
  this.image = image;
  this.id = myLibrary.length + 1;
}

// renders data from a source (in this case the firebase db)
const render = (library, id) => {
  booksContainer.innerHTML += `
        <div class="col s12 m6" data-id="${id}">
        <div class="card">
          <div class="card-image">
            <img src="${library.image}">
            <span class="card-title">${library.title}</span>
            <a class="btn-delete btn-floating halfway-fab waves-effect waves-light red"><i class="material-icons">delete</i></a>

          </div>
          <div class="card-content">
            <ul>
              <li>Written by ${library.author}</li>
              <li>${library.pages} pages long</li>
            </ul>
          </div>
          <div class="card-action">
              <p>
                <label for="card-read-${id}">
                  <input class="read-toggle" type="checkbox" id="card-read-${id}" name="card-read-${id}"
                  ${library.read ? 'checked' : null}/>
                  <span>Read</span>
                </label>
              </p>
          </div>
        </div>
      </div>

  `;
};
booksContainer.addEventListener('load', getRenderData());

// Handles the button clicks
const openForm = () => {
  form.classList.remove('hide');
  addBookBtn.classList.add('hide');
  removeFormBtn.classList.remove('hide');
};

const hideForm = () => {
  form.classList.add('hide');
  removeFormBtn.classList.add('hide');
  addBookBtn.classList.remove('hide');
};

// Handle read toggle state change

// This part isn't working Need to work out how to properly update

booksContainer.addEventListener('click', (event) => {
  let toggle = event.target.classList.contains('read-toggle');
  if (toggle) {
    let bookID = event.target.parentElement.parentElement.parentElement.parentElement.parentElement.dataset.id;
    let selectedBook = myLibrary.doc(bookID);
    if (toggle.checked) {
      return selectedBook
        .update({
          read: false,
        })
        .then(() => {
          console.log('Document successfully updated');
        })
        .catch((error) => {
          console.error('Error updating document: ', error);
        });
    } else {
      return selectedBook
        .update({
          read: true,
        })
        .then(() => {
          console.log('Document successfully updated');
        })
        .catch((error) => {
          console.error('Error updating document: ', error);
        });
    }
  }
});

/* 
Uses the data attribute to find the current id. Using event target to get this.
Then checks this against the array to delete the right index item.
Once complete it removes the item from the DOM.
*/

const deleteBook = (event) => {
  console.log('hello');
  let bookID = event.target.parentElement.parentElement.parentElement.parentElement.dataset.id;
  myLibrary
    .doc(bookID)
    .delete()
    .then(function () {
      console.log('Document successfully deleted!');
    })
    .catch(function (error) {
      console.error('Error removing document: ', error);
    });

  booksContainer.childNodes.forEach((card) => {
    if (card.tagName == 'DIV') {
      if (card.dataset.id == bookID) {
        booksContainer.removeChild(card);
      }
    }
  });
};

addBookBtn.addEventListener('click', openForm);
removeFormBtn.addEventListener('click', hideForm);

// handle form submit and create new book object
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const title = form.title.value.trim();
  const author = form.author.value.trim();
  const pages = form.pages.value.trim();
  const image = form.image.value.trim();
  const read = form.read.checked;
  const book = new Book(author, title, pages, read, image);
  addBookToLibrary(book);
  form.reset();
  hideForm();
});

setTimeout(() => {
  const deleteBookBtn = document.querySelectorAll('.btn-delete');
  deleteBookBtn.forEach((btn) => {
    btn.addEventListener('click', deleteBook);
  });
}, 2000);
