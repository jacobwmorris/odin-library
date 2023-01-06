const myLibrary = [];
const tableBody = document.querySelector("tbody");
const Form = {
    title: document.getElementById("bookTitle"),
    author: document.getElementById("bookAuthor"),
    pages: document.getElementById("bookPages"),
    read: document.getElementById("bookRead"),
};

function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

Book.prototype.toggleRead = function() {
    this.read = !this.read;
}

function addBookToLibrary(title, author, pages, read) {
    myLibrary.push(new Book(title, author, pages, read));
}

//Callback functions for book action buttons
function toggleReadStatus(event) {
    const row = event.target.parentElement.parentElement;
    const bookId = row.getAttribute("data-bookId");
    myLibrary[bookId].toggleRead();

    const readData = row.children[3];
    readData.textContent = readData.textContent === "true" ? "false" : "true";
}

function removeFromList(event) {
    const row = event.target.parentElement.parentElement;
    const bookId = row.getAttribute("data-bookId");
    myLibrary.splice(bookId, 1);

    row.parentElement.removeChild(row);
    displayBooks();
}

//Display books in myLibrary
function makeTableData(data) {
    const dataElem = document.createElement("td");
    dataElem.textContent = data.toString();
    return dataElem;
}

function makeActionData() {
    const dataElem = document.createElement("td");
    const readButton = document.createElement("button");
    const removeButton = document.createElement("button");

    readButton.textContent = "Toggle read";
    removeButton.textContent = "Remove";

    readButton.addEventListener("click", toggleReadStatus);
    removeButton.addEventListener("click", removeFromList);

    dataElem.appendChild(readButton);
    dataElem.appendChild(removeButton);

    return dataElem;
}

function makeTableRow(book, bookId) {
    rowElem = document.createElement("tr");
    rowElem.setAttribute("data-bookId", bookId);

    rowElem.appendChild(makeTableData(book.title));
    rowElem.appendChild(makeTableData(book.author));
    rowElem.appendChild(makeTableData(book.pages));
    rowElem.appendChild(makeTableData(book.read));
    rowElem.appendChild(makeActionData());

    return rowElem;
}

function displayBooks() {
    while (tableBody.childNodes.length > 0) {
        tableBody.removeChild(tableBody.firstChild);
    }

    let bookId = 0;
    for (const book of myLibrary) {
        tableBody.appendChild(makeTableRow(book, bookId));
        bookId++;
    }
}

//Validation functions
function setTitleError(event) {
    console.log("changed");
    const errorSpan = document.querySelector("#bookTitle + .error");

    if (this.checkValidity()) {
        errorSpan.textContent = "";
        return;
    }

    if (this.validity.valueMissing) {
        errorSpan.textContent = "A title is required";
    }
}

function setAuthorError(event) {
    const errorSpan = document.querySelector("#bookAuthor + .error");

    if (this.checkValidity()) {
        errorSpan.textContent = "";
        return;
    }

    if (this.validity.valueMissing) {
        errorSpan.textContent = "An author is required";
    }
}

function setPagesError(event) {
    const errorSpan = document.querySelector("#bookPages + .error");

    if (this.checkValidity()) {
        errorSpan.textContent = "";
        return;
    }

    if (this.validity.valueMissing) {
        errorSpan.textContent = "Page number is required";
    }
}

Form.title.addEventListener("input", setTitleError);
Form.title.addEventListener("focusout", setTitleError);

Form.author.addEventListener("input", setAuthorError);
Form.author.addEventListener("focusout", setAuthorError);

Form.pages.addEventListener("input", setPagesError);
Form.pages.addEventListener("focusout", setPagesError);

function validate() {
    return Form.title.validity.valid && Form.author.validity.valid && Form.pages.validity.valid;
}

//Handle add book form
function bookForm(event) {
    event.preventDefault();
    if (!validate()) {
        setTitleError.call(Form.title);
        setAuthorError.call(Form.author);
        setPagesError.call(Form.pages);
        return;
    }
    
    const bookId = myLibrary.length;
    addBookToLibrary(Form.title.value, Form.author.value, Form.pages.value, Form.read.checked);
    tableBody.appendChild(makeTableRow(myLibrary[bookId], bookId));

    Form.title.value = "";
    Form.author.value = "";
    Form.pages.value = "";
    Form.read.checked = false;
    document.querySelector("form").classList.add("no-display");
}

document.getElementById("newButton").addEventListener("click", event => {
    document.querySelector("form").classList.remove("no-display");
});
document.getElementById("addBookButton").addEventListener("click", bookForm);
