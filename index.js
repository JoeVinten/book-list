const booksContainer = document.querySelector('.books-container');
const addBookBtn = document.querySelector('.btn-add');
const removeFormBtn = document.querySelector('.btn-remove');
const form = document.querySelector('.form');

let myLibrary = [
  {
    author: 'J.K.Rowling',
    title: 'Harry Potter and the Chamber of Secrets',
    pages: 400,
    read: true,
    image: 'https://img.srgcdn.com/e//alJUYzQzUG1ER09mNHlwSTExMDMuanBn.jpg',
    id: 0,
  },
  {
    author: 'J.K.Rowling',
    title: 'Harry Potter',
    pages: 400,
    read: true,
    image: 'https://img.srgcdn.com/e//alJUYzQzUG1ER09mNHlwSTExMDMuanBn.jpg',
    id: 1,
  },
  {
    author: 'J.K.Rowling',
    title: 'Harry Potter',
    pages: 400,
    read: false,
    image: 'https://img.srgcdn.com/e//alJUYzQzUG1ER09mNHlwSTExMDMuanBn.jpg',
    id: 2,
  },
];

function Book(author, title, pages, read, image) {
  this.author = author;
  this.title = title;
  this.pages = pages;
  this.read = read;
  this.image = image;
  this.id = myLibrary.length + 1;
}

const addBookToLibrary = (book) => {
  myLibrary.push(book);
  let item = [book];
  render(item);
};

const render = (library) => {
  library.forEach((element) => {
    booksContainer.innerHTML += `
      <div class="col s12 m6" data-id="${element.id}">
        <div class="card">
          <div class="card-image">
            <img src="${element.image}">
            <span class="card-title">${element.title}</span>
            <a class="btn-delete btn-floating halfway-fab waves-effect waves-light red"><i class="material-icons">delete</i></a>

          </div>
          <div class="card-content">
            <ul>
              <li>Written by ${element.author}</li>
              <li>${element.pages} pages long</li>
              <li>${element.read ? 'Read' : 'Not Read'}</li>
            </ul>
          </div>
        </div>
      </div>

`;
  });
};

// Renders all the books in the array on load (will changed once I implement firebase)
document.addEventListener('load', render(myLibrary));

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

const deleteBookBtn = document.querySelectorAll('.btn-delete');

/* 
Uses the data attribute to find the current id. Using event target to get this.
Then checks this against the array to delete the right index item.
Once complete it removes the item from the DOM.
*/

const deleteBook = (event) => {
  let bookID = event.target.parentElement.parentElement.parentElement.parentElement.dataset.id;
  myLibrary.forEach((book) => {
    if (book.id == bookID) {
      const currentIndex = myLibrary.indexOf(book);
      myLibrary.splice(currentIndex, 1);
    }
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

deleteBookBtn.forEach((btn) => {
  btn.addEventListener('click', deleteBook);
});

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
