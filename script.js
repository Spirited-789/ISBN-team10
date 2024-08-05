function myFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}

document.getElementById('isbnForm').addEventListener('submit', function(event) {
    event.preventDefault();
    validateISBN();
});

document.getElementById('isbn').addEventListener('input', function() {
    validateISBN();
});

document.getElementById('clearButton').addEventListener('click', function() {
    document.getElementById('isbn').value = '';
    document.getElementById('result').textContent = '';
    document.getElementById('loading').style.display = 'none';
    document.getElementById('searchButton').disabled = true;
});

document.getElementById('searchButton').addEventListener('click', function() {
    const isbnInput = document.getElementById('isbn').value;
    searchOnline(isbnInput);
});

function validateISBN() {
    const isbnInput = document.getElementById('isbn').value;
    const resultElement = document.getElementById('result');
    const loadingElement = document.getElementById('loading');
    const searchButton = document.getElementById('searchButton');

    if (isbnInput === '') {
        resultElement.textContent = '';
        loadingElement.style.display = 'none';
        searchButton.disabled = true;
        return;
    }

    loadingElement.style.display = 'block';

    setTimeout(() => {
        if (isValidISBN(isbnInput)) {
            resultElement.textContent = 'Valid ISBN';
            resultElement.style.color = 'green';
            searchButton.disabled = false;
        } else {
            resultElement.textContent = 'Invalid ISBN';
            resultElement.style.color = 'red';
            searchButton.disabled = true;
        }
        loadingElement.style.display = 'none';
    }, 500);
}

function isValidISBN(isbn) {
    isbn = isbn.replace(/[-\s]/g, '');

    const isbn10Pattern = /^\d{9}(\d|X)$/;
    const isbn13Pattern = /^\d{13}$/;

    if (isbn10Pattern.test(isbn)) {
        return isValidISBN10(isbn);
    }

    if (isbn13Pattern.test(isbn)) {
        return isValidISBN13(isbn);
    }

    return false;
}

function isValidISBN10(isbn) {
    isbn = isbn.replace(/[-\s]/g, '');

    if (isbn.length !== 10) {
        return false;
    }

    let sum = 0;
    for (let i = 0; i < 9; i++) {
        if (isNaN(parseInt(isbn[i]))) {
            return false;
        }
        sum += (10 - i) * parseInt(isbn[i]);
    }

    let check = isbn[9] === 'X' ? 10 : parseInt(isbn[9]);
    sum += check;

    return sum % 11 === 0;
}

function isValidISBN13(isbn) {
    isbn = isbn.replace(/[-\s]/g, '');

    if (isbn.length !== 13) {
        return false;
    }

    let sum = 0;
    for (let i = 0; i < 13; i++) {
        let digit = parseInt(isbn[i]);
        if (isNaN(digit)) {
            return false;
        }
        sum += (i % 2 === 0 ? 1 : 3) * digit;
    }

    return sum % 10 === 0;
}

function searchOnline(isbn) {
    if (isValidISBN(isbn)) {
        isbn = isbn.replace(/[-\s]/g, '');
        const searchURL = `https://www.google.com/search?&tbm=bks&q=isbn:${isbn}`;
        window.open(searchURL, '_blank');
    }
}
