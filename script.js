let form_button = document.querySelector("#form_subBtn");
let book_div = document.querySelector("#book_table")

form_button.addEventListener("click", () => {

    let author_info = document.querySelector("#author").value;
    let title_info = document.querySelector("#title").value;
    let genre = document.querySelector("#genre").value;
    searchBooks(author_info, title_info, genre);    
});


// This function is used to fetch the books from Google Books
function searchBooks(authorInfo, title_info, genre){
    // We add the search parameters and such to the "query" -variable. Its contents will depend on the information provided by the user.
    let query = "";
    if (authorInfo){
        query += `inauthor:${authorInfo}`;
    }
    if (title_info){
        query += `+intitle:${title_info}`;
    }
    if (genre){
        query += `+subject:${genre}`;
    }
    // We place the API itself to a constant variable, since we have no intention of changing the URL later on, merely modifying the query variable as needed. Plus, easier on the eyes. 
    // Notice the "encodeURIcomponent", this was recommended to me by an acquaintance and although esoteric and resembling some deep magic, its purpose is to encode special special characters in a URL, so that the query is formatted in a correct and "understandable" manner. Special chars can be things like ä, ö, #, &, ?, /, and even the ever faithful " " -space.
    const apiURL = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=10&printType=books`;

    // I decided to use fetch with this, since it is a more modern method and seemed more intuitive.
    fetch (apiURL)
        .then(response => response.json())
        .then(data => {
            const books = data.items;
            displayBooks(books);
        })
        .catch(error => console.error('Error fetching books:', error));
}

//TO DO
//      ADD MORE INFORMATION TO publication_date's CELL. BOOK LENGTH, USER RATING, ETC??
//Growing fond of using "?" as a ternary operator.
function displayBooks(books){
    const book_table = document.createElement("table");
    books.forEach(book => {
        //As one can see, we are accessing the "volumeInfo" portion of the information we've just received for each individual book. 
        const title = book.volumeInfo.title;
        const author = book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown Author';
        const publication_date = book.volumeInfo.publishedDate ? book.volumeInfo.publishedDate: 'Unknown';
        const genres = book.volumeInfo.categories ? book.volumeInfo.categories.join(', '): 'Unknown Genre';
        //Some of the fetched books might be missing a cover and if we do not use a placeholder image in their place, the script will encounter an error.
        const image = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'assets/placeholder_cover.jpg';
        const publisher = book.volumeInfo.publisher;

        const row = document.createElement("tr");
        row.innerHTML = `<td><img src="${image}"></td><td>${title}</td><td>${author}</td><td>${genres}</td><td>${publication_date}<br>${publisher}</td>`;
        book_table.appendChild(row);
    });
    book_div.innerHTML = ''; // This ensures that possible previous entries will be removed.
    book_div.appendChild(book_table);
}


// function displayBooks(books){
//     const book_table = document.createElement("div");
//     books.forEach(book => {
//         const title = book.volumeInfo.title;
//         const author = book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown Author';
//         console.log(`Title: ${title}, Author(s): ${author}`)
//     });
// }