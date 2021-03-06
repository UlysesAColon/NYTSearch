 
const searchPhrase = document.getElementById('searchTerm');
const numberArticles = document.getElementById('recordNumber');
const startYear = document.getElementById('startYear');
const endYear = document.getElementById('endYear');

const searchButton = document.getElementById('submit');
const clearButton = document.getElementById('clear');

const resultsDisplay = document.getElementById('topArticles');

var recordAmount = 10;


document.addEventListener("DOMContentLoaded", function() {
    searchButton.addEventListener('click', checkParameters);
    clearButton.addEventListener('click', clearPage);
});

function checkParameters(event) {
    console.log('Button pressed');
    console.log(event);
    event.preventDefault();
    let phrase = searchPhrase.value;
    if(!phrase) {
        alert('Enter search phrase');
        return;
    }

    let num = numberArticles.value;
    if (parseInt(num) === NaN) {
        alert('Article number is not a number');
        return;
    } else {
        recordAmount = num;
    }

    let start = startYear.value;
    if(start && (start.length !== 4 || parseInt(start) === NaN)) {
        alert('Start Year is not a four digit number');
        return;
    }

    let end = endYear.value;
    if(end && (end.length !== 4 || parseInt(end) === NaN)) {
        alert('End Year is not a four digit number');
        return;
    }

    getSearchResults(phrase, start, end);
}

function getSearchResults(phrase, start, end) {
    var xhr = new XMLHttpRequest();
    var url = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?';
    let apiKey = 'b9f91d369ff59547cd47b931d8cbc56b:0:74623931';
    url += 'api-key=' + apiKey;

    if(phrase) {
        url += '&q=' + phrase
    }

    if(start) {
        url += '&begin_date=' + start + '0101';
    }

    if(end) {
        url += '&end_date=' + end + '1231';
    }

    
    console.log(url);

    xhr.onreadystatechange = function() {
        if(xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200 ) {
                let result = JSON.parse(xhr.response);
                console.log(result);
                populatePageWithResults(result.response.docs);
            } else if (xhr.status === 200 && sessionToken) {
                getQuestions(difficultySelector.value, categorySelector.value, sessionToken);
            } else if(xhr.status === 400) {
                console.error('failed api request');
            }
        }
    }


    xhr.open('GET', url);
    xhr.responseType = "text";
    xhr.send();
}

function populatePageWithResults(results) {
    console.log(results);
    resultsDisplay.innerHTML = '';

    for(let i = 0; i < recordAmount; i++) {
        console.log(results[i]);
        let container = document.createElement('div');

        let title = document.createElement('p');
        title.innerHTML = (i+1) + ' <b>' + results[i].headline.main +'</b>';

        let byline = document.createElement('p');
        byline.textContent = results[i].byline.original;

        let published = document.createElement('p');
        published.textContent = results[i].pub_date;

        let hyperlink = document.createElement('a');
        hyperlink.setAttribute('href', results[i].web_url);
        hyperlink.textContent = results[i].web_url;

        container.appendChild(title);
        container.appendChild(byline);
        container.appendChild(published);
        container.appendChild(hyperlink);
        resultsDisplay.appendChild(container);
    }

    //resultsDisplay.textContent = JSON.stringify(results);
}

function clearPage() {
    $("#topArticles").empty()

    $(".form-control").val('')
}