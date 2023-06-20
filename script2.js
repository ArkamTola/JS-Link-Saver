const linkCategory = document.querySelector("#linkCategory");
const submitButton = document.querySelector("#submitButton");
const addBtn = document.querySelector('#addBtn');
const cancelBtn = document.querySelector('#cancelButton');
const addLinkPanel = document.querySelector('#addLinkPanel');
const linksList = document.querySelector('#linksList');
const addedCategories = document.querySelector('#addedCategories');
const addlinkContainer = document.querySelector('#addLinkContainer');

let editIndex = -1;

let linkCategories = [];
let links = [];

displayLinks();

addBtn.addEventListener('click', () => {
    showFormPanel();
});

cancelBtn.addEventListener('click', (e) => {
    e.preventDefault();

    clearForm();
    hideFormPanel();
});

function showFormPanel() {
    addlinkContainer.classList.remove('hidden');
    displayLinkcategories();
}

function hideFormPanel() {
    addlinkContainer.classList.add('hidden');
}

linkCategory.addEventListener('keydown', (e) => {
    if (e.keyCode === 188) {
        e.preventDefault();

        linkCategories.push(linkCategory.value);

        linkCategory.value = '';

        // Display the updated categories
        displayLinkcategories();
    }
});

function displayLinkcategories() {
    console.log(linkCategories);
    addedCategories.innerHTML = '';

    for (let category of linkCategories) {
        var categoryHTMLString = `<span class="category">${category}</span>`;
        addedCategories.innerHTML += categoryHTMLString;
    }
}

function clearForm() {
    linkTitle.value = '';
    linkUrl.value = '';
    linkCategory.value = '';
    linkCategories = [];
    addedCategories.innerHTML = '';
}

submitButton.addEventListener('click', (e) => {
    e.preventDefault();

    const title = linkTitle.value;
    const url = linkUrl.value;
    const categories = linkCategories;

    const newLink = {
        title: title,
        url: url,
        categories: categories,
        date: new Date()
    };

    if (editIndex === -1) {
        // Push newLink to array
        links.unshift(newLink);
    } else {
        links[editIndex] = newLink;
        editIndex = -1;
    }

    // Clear out the form
    clearForm();
    displayLinkcategories();
    hideFormPanel();
    displayLinks();
    storeLinks();
});

function displayLinks() {
    linksList.innerHTML = '';

    let index = 0;
    for (let link of links) {
        let linkHTMLString = `
            <div class="flex-item">
                <div class="link panel">
                    <div class="link-options">
                        <button class="btn-sm" onclick="deleteLink(${index})">Delete</button>
                        <button class="btn-sm" onclick="editLink(${index})">Edit</button>
                    </div>
                    <a href="${link.url}" target="_blank"><h1 class="header">${link.title}</h1></a>
                    <p class="link-date">${formatDate(link.date)}</p>
                    <div class="categories">    
                        Categories:`;
        for (let category of link.categories) {
            linkHTMLString += `<span class="category">${category}</span>`;
        }
        linkHTMLString += `
                    </div>
                </div>
            </div>
        `;

        linksList.innerHTML += linkHTMLString;
        index++;
    }
}

function deleteLink(index) {
    links.splice(index, 1);
    displayLinks();
    storeLinks();
}

function editLink(index) {
    console.log("Editing Link at index", index);

    editIndex = index;

    linkTitle.value = links[index].title;
    linkUrl.value = links[index].url;
    linkCategories = links[index].categories;

    showFormPanel();
}

function formatDate(date) {
    return `${("0" + (date.getMonth() + 1)).slice(-2)}/
    ${("0" + date.getDate()).slice(-2)}/
    ${date.getFullYear()}`;
}

function storeLinks() {
    localStorage.setItem('links', JSON.stringify(links));
}

function retrieveLinks() {
    const storedLinks = localStorage.getItem('links');
    if (storedLinks) {
        links = JSON.parse(storedLinks);
        for (let link of links) {
            link.date = new Date(link.date); // Convert date strings to Date objects
        }
    } else {
        links = [];
    }
}

// Retrieve links from local storage on page load
retrieveLinks();

// Display retrieved links
displayLinks();
