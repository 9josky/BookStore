import {store} from './store.js';

export class UI {

    static ready() {
        UI.displayBooks();

        const submitDataBtn = document.getElementsByClassName("btn-submit")[0];
        submitDataBtn.addEventListener('click', UI.submitFormDataHandler);

        const deleteBookBtn = document.querySelectorAll(".btn-delete");
        deleteBookBtn.forEach((btn) => {
            btn.addEventListener('click', UI.deleteBookBtnHandler)
        });

        const editBookBtn = document.querySelectorAll(".btn-edit");
        editBookBtn.forEach((btn) => {
            btn.addEventListener('click', UI.editBookBtnHandler)
        });

        const cancelEditBook = document.getElementsByClassName("btn-edit-cancel")[0];
        cancelEditBook.addEventListener('click', UI.cancelEditBookHandler);

        const btnEditSubmit = document.getElementsByClassName("btn-edit-submit")[0];
        btnEditSubmit.addEventListener('click', UI.btnEditSubmitHandler);

        //Event: search 
        const searchInput = document.getElementsByClassName("search")[0];
        searchInput.addEventListener('blur', UI.searchHandler);

        //Even: Light Mode
        const lightModeBtn = document.getElementsByClassName("light-mode-container")[0];
        lightModeBtn.addEventListener('click', UI.toggleLightMode)

        const moonIcon = document.getElementsByClassName("fa-moon")[0];
        moonIcon.addEventListener('click', UI.toggleLightMode);
    }

    static toggleLightMode(e){
        e.target.classList.toggle("light-mode-switch");

        const body = document.getElementsByTagName("body")[0];
        body.classList.toggle("lightModeEnabled");
    }

    static searchHandler(e){
        const search = e.target.value;

        UI.displayBooks(search)
    }

    static btnEditSubmitHandler(e) {
        e.preventDefault();

        const title = document.getElementsByClassName("input-title")[0].value;
        const author = document.getElementsByClassName("author")[0].value;
        const isbn = document.getElementsByClassName("isbn")[0].value;

        if (!title || !author || !isbn) {
            UI.alertBox("All field required");
            return;
        }

        const data = {
            id: author + "-" + isbn,
            title,
            author,
            isbn
        }
        
        const books = store.getBooks();

        const copy = [...books];

        console.log(copy, "copy");
        
        const changeData = copy.find((books) => books.isbn == isbn);
        const index = copy.indexOf(changeData);
        copy.splice(index, 1, data)
        
        localStorage.setItem("books", JSON.stringify(copy));

        //clear input field
        document.getElementsByClassName("input-title")[0].value = "";
        document.getElementsByClassName("author")[0].value = "";
        document.getElementsByClassName("isbn")[0].value = "";

        //alert success message
        UI.alertBox("Edited successfully", "success");

        UI.displayBooks();
        
        location.reload();
    }

    static cancelEditBookHandler(e) {
        e.preventDefault();

        //clear input field
        document.getElementsByClassName("input-title")[0].value = "";
        document.getElementsByClassName("author")[0].value = "";
        document.getElementsByClassName("isbn")[0].value = "";

        document.getElementsByClassName("btn-edit-actions")[0].classList.remove("show");
        document.getElementsByClassName("btn-submit")[0].classList.remove("hide");

        location.reload();
    }

    static editBookBtnHandler(e) {
        e.preventDefault();

        const grandParent = e.target.parentElement.parentElement;
        const isbn = grandParent.querySelector(".book-isbn").textContent;

        UI.editBookWithIsbn(+isbn);

        document.getElementsByClassName("btn-edit-actions")[0].classList.add("show");
        document.getElementsByClassName("btn-submit")[0].classList.add("hide");
    }

    static editBookWithIsbn(isbn) {
        const books = store.getBooks();

        const copy = [...books];

        const filteredEditBooks =  copy.find((book) => book.isbn == isbn);
        //const result = filteredEditBooks.find(book => book.title != "");

        console.log(filteredEditBooks);

        document.getElementsByClassName("input-title")[0].value = filteredEditBooks.title;

        document.getElementsByClassName("author")[0].value = filteredEditBooks.author;

        document.getElementsByClassName("isbn")[0].value = filteredEditBooks.isbn;
        document.getElementsByClassName("isbn")[0].disabled = true;
        
        
    }

    static deleteBookBtnHandler(e) {
        const isbn = e.target.parentElement.parentElement.getElementsByClassName("book-isbn")[0].textContent;

        const books = store.getBooks();

        const copy = [...books];

        const filteredBooks =  copy.filter((book) => book.isbn != +isbn);

        localStorage.setItem("books", JSON.stringify(filteredBooks));

        location.reload();

        //UI.removeBookWithIsbn(+isbn);
    }

    // static removeBookWithIsbn(isbn) {
    //     const books = store.getBooks();

    //     const copy = [...books];

    //     const filteredBooks =  copy.filter((book) => book.isbn != isbn);

    //     localStorage.setItem("books", JSON.stringify(filteredBooks));

    //     location.reload();
    // }

    static displayBooks(search = null) {
        const books = store.getBooks();
        let copy = [...books];

        if (search) {
            copy = copy.filter((book) => book.title.toLowerCase().startsWith(search.toLowerCase()) || book.author.toLowerCase().startsWith(search.toLowerCase()) || book.isbn == search);
        }
        const displayLists = document.getElementsByClassName("book-lists")[0];
        displayLists.innerHTML = "";
        copy.forEach((element) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${element.title}</td>
                <td>${element.author}</td>
                <td class='book-isbn'>${element.isbn}</td>
                <td>
                   <span class="btn btn-actions btn-edit">EDIT</span>
                   <span class="btn btn-actions btn-delete">DELETE</span>
                </td>
          `;
        displayLists.appendChild(tr);
        });
    }
    
    static submitFormDataHandler(e) {

        e.preventDefault();

        const title = document.getElementsByClassName("input-title")[0].value;
        const author = document.getElementsByClassName("author")[0].value;
        const isbn = document.getElementsByClassName("isbn")[0].value;
        document.getElementsByClassName("isbn")[0].disabled = false;

        if (!title || !author || !isbn) {
            UI.alertBox("All field required");
            return;
        }

        const isDigitError = UI.isbnIsDigit(isbn);

        if(isDigitError === "error-number"){
            UI.alertBox("Please enter a valid number");
            return;
        } else if(isDigitError === "error-digits") {
            UI.alertBox("ISBN must be exactly 6 digits");
            return;
        }

        const titleExistError = UI.isbnExist(isbn);
        //error handling
        if (titleExistError === "error") {
        UI.alertBox("Book with this isbn already exist");
        return;
        }

        const data = {
            id: author + "-" + isbn,
            title,
            author,
            isbn
        }

        store.saveBookToStore(data);

        //clear input field
        document.getElementsByClassName("input-title")[0].value = "";
        document.getElementsByClassName("author")[0].value = "";
        document.getElementsByClassName("isbn")[0].value = "";

        //alert success message
        UI.alertBox("Book created successfully", "success");

        UI.displayBooks();
    }

    static isbnIsDigit(isbn) {
        if(isNaN(+isbn)) {
            return "error-number";
        }

        if (isbn.toString().length !== 6){
            return "error-digits";
        }
    }

    static isbnExist (isbn) {
        const books = store.getBooks();
        const foundBooks = books.find((book) => book.isbn === isbn);

        if(foundBooks) {
            return "error";
        }

    }

    static alertBox(message, msgClass) {
        const bgColor = msgClass == "success" ? "green" : "red";
        const div = document.createElement("div");
        div.style.position = "fixed";
        div.style.top = 0;
        div.style.right = 0;
        div.style.zIndex = 999;
        div.style.width = "200px";
        div.style.height = "80px";
        div.style.borderRadius = "5px";
        div.style.backgroundColor = `${bgColor}`;
        div.style.color = "#fff";
        div.style.display = "flex";
        div.style.alignItems = "center";
        div.style.justifyContent = "center";
        div.textContent = `${message}`;
        const body = document.getElementsByTagName("body")[0];
        body.appendChild(div);
    
        //make the box disappear after 5sec
        setTimeout(() => {
          div.style.display = "none";
        }, 5000);
    }
}