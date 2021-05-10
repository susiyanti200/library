function Book(title, author, pages, isRead) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.isRead = isRead;
}

Book.prototype.toggleRead = function () {
  this.isRead = !this.isRead;
};

function ActionButton(text, handler, id, c) {
  this.text = text;
  this.handler = handler;
  this.id = id;
  this.class = c;
}

const addBookToLibrary = (e) => {
  const form = document.querySelector("form");
  if (form.checkValidity()) {
    e.preventDefault();
    const title = document.querySelector("#title").value;
    const author = document.querySelector("#author").value;
    const pages = document.querySelector("#pages").value;
    const isRead = document.querySelector("#isRead").checked;
    const book = new Book(title, author, pages, isRead);
    myLibrary.push(book);
    form.reset();
    localStorage.setItem("library", JSON.stringify(myLibrary));
    displayBook();
  }
};

const deleteBook = (e) => {
  let bookIndex = parseInt(e.target.parentNode.parentNode.dataset.index);
  myLibrary.splice(bookIndex, 1);
  localStorage.setItem("library", JSON.stringify(myLibrary));
  displayBook();
};

const toggleBook = (e) => {
  let bookIndex = parseInt(e.target.parentNode.parentNode.dataset.index);
  myLibrary[bookIndex].toggleRead();
  localStorage.setItem("library", JSON.stringify(myLibrary));
  displayBook();
};

const createTableHeader = (table, headerText, lastCellText = "", actions = []) => {
  const header = table.createTHead();
  const headerRow = header.insertRow(0);
  for (const text of headerText) {
    const cell = document.createElement("th");
    cell.textContent = text;
    headerRow.appendChild(cell);
  }
  if (actions) {
    const lastCell = document.createElement("th");
    lastCell.textContent = lastCellText;
    lastCell.colSpan = actions.length;
    headerRow.appendChild(lastCell);
  }
};

const createTableBody = (table, data, key, actions = []) => {
  const tbody = table.createTBody();
  for (let i = 0; i < data.length; i++) {
    const tr = tbody.insertRow(i);
    tr.dataset.index = i;
    for (let j = 0; j < key.length; j++) {
      let td = tr.insertCell(j);
      td.textContent = data[i][key[j]];
    }
    td = tr.insertCell(-1);
    for (const action of actions) {
      const btn = document.createElement("button");
      btn.textContent = action.text;
      btn.id = action.id;
      btn.className = action.class;
      btn.addEventListener("click", action.handler);
      td.appendChild(btn);
    }
  }
};

const displayBook = () => {
  const bookTable = document.createElement("table");
  const noBookText = document.createElement("p");
  if (myLibrary.length > 0) {
    const headerText = ["title", "author", "pages", "finished"];
    const displayData = myLibrary.map((book) => {
      return { ...book, finished: book.isRead ? "Yes" : "No" };
    });
    const actions = [
      new ActionButton("Toggle", toggleBook, "toggle", "action"),
      new ActionButton("Remove", deleteBook, "remove", "action"),
    ];
    bookTable.createCaption().textContent = "Book Collection";
    createTableHeader(bookTable, headerText, "action", actions);
    createTableBody(bookTable, displayData, headerText, actions);
  } else {
    noBookText.textContent = "No book in library. Add some!"
  }
  document.querySelector("table").replaceWith(bookTable);
  document.querySelector("p").replaceWith(noBookText);
};

const overlay = document.querySelector('.overlay');

const btnSave = document.querySelector(".btn-save");
btnSave.addEventListener("click", addBookToLibrary);

const btnFab = document.querySelector(".fab");
btnFab.addEventListener("click", () => {
  overlay.style.display = "block";
});

const closeOverlay = document.querySelector('.close');
closeOverlay.addEventListener("click", () => {
  overlay.style.display = "none";
});

document.addEventListener("click", (e) => {
  if (e.target === overlay) {
    overlay.style.display = "none";
  }
})

let myLibrary = JSON.parse(localStorage.getItem("library") || "[]")
  .map(book => Object.assign(new Book(), book));

displayBook();