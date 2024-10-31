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
            let error = document.querySelector("#error_message");
            if (error){
                error.remove();
            }
            resetFields();
        })
        
        .catch(error => {
            console.error('Error fetching books:', error);
            ErrorMessages();
        });
}


//Growing fond of using "?" as a ternary operator.
function displayBooks(books){
    const book_table = document.createElement("table");
    books.forEach(book => {
        //As one can see, we are accessing the "volumeInfo" portion of the information we've just received for each individual book. 
        const title = book.volumeInfo.title;
        const title_link = book.volumeInfo.infoLink;
        //Some of the fetched books might be missing a cover or other requested information and if we do not use a placeholder image or string in their place, the script will encounter an error.
        const author = book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown Author';
        const publication_date = book.volumeInfo.publishedDate ? book.volumeInfo.publishedDate: 'Unknown';
        const genres = book.volumeInfo.categories ? book.volumeInfo.categories.join(', '): 'Unknown Genre';
        const image = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'assets/placeholder_cover.jpg';
        const publisher = book.volumeInfo.publisher;
        const rating = book.volumeInfo.averageRating ? book.volumeInfo.averageRating : "-";
        const ratingCount = book.volumeInfo.ratingsCount ? book.volumeInfo.ratingsCount : "-";
        // This creates the rows filled with all the fetched information and possible placeholders in case of errors or missing information and adds them to the "book_table" element, which will eventually be appended to the book_div.
        const row = document.createElement("tr");

        row.innerHTML = `<td><img src="${image}"></td><td><a href="${title_link}" target="_blank">${title}</a></td><td>${author}</td><td>${genres}</td><td>${publication_date}<br>${publisher}<br>Rating: ${rating}<br>Reviews: ${ratingCount}</td>`;

        book_table.appendChild(row);
    });
    book_div.innerHTML = ''; // This ensures that possible previous entries are removed.
    book_div.appendChild(book_table);
}

// We'll use this function to monitor the process and inform the user in case something kicks the bucket during the query. For example, if they use an invalid search term.
function ErrorMessages() {
    const inputFields = document.querySelectorAll("#author, #title, #genre");
    inputFields.forEach(field =>{
        field.style.borderColor = "red";
    });
    const error_message = document.createElement("p");
    error_message.id = "error_message";
    error_message.textContent = "Error fetching books. Maybe another search term might do the trick?";
    error_message.style.color = "red";
    error_message.style.fontweight = "bold";
    document.querySelector("#search_form").appendChild(error_message);
    inputFields.textContent = "";
}

// This simply goes through the input fields and turns their styles back to the defaults after the user has given an acceptable search term.
function resetFields(){
    const inputFields = document.querySelectorAll("#author, #title, #genre");
    inputFields.forEach(field => {
        field.style.borderColor = "";
    });
}