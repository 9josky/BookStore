export class store {
    static getBooks() {
        const books = localStorage.getItem("books")
          ? JSON.parse(localStorage.getItem("books"))
          : [];
    
        return books;
    }

    static saveBookToStore(data) {
        const books = store.getBooks();

        const copy = [...books];

        copy.push(data);

        localStorage.setItem("books", JSON.stringify(copy));
    }
}