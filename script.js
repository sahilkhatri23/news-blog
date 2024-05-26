const apiKey = '9b6aa1f687274b06b9e2dc7325fe9614';
let searchField, searchButton, dropdownSearchField, dropdownSearchButton;

document.addEventListener("DOMContentLoaded", async function() {
    searchField = document.getElementById('search-input');
    searchButton = document.getElementById('search-button');
    dropdownSearchField = document.getElementById('dropdown-search-input');
    dropdownSearchButton = document.getElementById('dropdown-search-button');

    if (!searchField || !searchButton || !dropdownSearchField || !dropdownSearchButton) {
        console.error("Search field or search button not found");
        return;
    }

    try {
        const articles = await fetchRandomNews();
        displayBlogs(articles);
    } catch(error) {
        console.error("Error fetching random news", error);
    }

    const menuButton = document.getElementById('menu-button');
    const dropdownMenu = document.getElementById('dropdown-menu');

    if (menuButton && dropdownMenu) {
        menuButton.addEventListener('click', function() {
            dropdownMenu.style.display = dropdownMenu.style.display === 'flex' ? 'none' : 'flex';
        });

        window.addEventListener('resize', function() {
            if (window.innerWidth > 500) {
                dropdownMenu.style.display = 'none';
            }
        });
    } else {
        console.error("Menu button or dropdown menu not found");
    }

    searchButton.addEventListener('click', async () => {
        const query = searchField.value.trim();

        if (query !== "") {
            try{
                const articles = await fetchNewsQuery(query);
                displayBlogs(articles);
            } catch(error) {
                console.log("Error fetching news by search", error);
            }
        }
    });

    dropdownSearchButton.addEventListener('click', async () => {
        const query = dropdownSearchField.value.trim();

        if (query !== "") {
            try{
                const articles = await fetchNewsQuery(query);
                displayBlogs(articles);
                dropdownMenu.style.display = 'none';
            } catch(error) {
                console.log("Error fetching news by search", error);
            }
        }
    });
});

async function fetchRandomNews() {
    try {
        const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&pageSize=15&apiKey=${apiKey}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.articles;
    } catch(error) {
        console.error("Error fetching random news", error);
        return [];
    }
}

async function fetchNewsQuery(query) {
    try {
        const apiUrl = `https://newsapi.org/v2/everything?q=${query}&pageSize=15&apiKey=${apiKey}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.articles;
    } catch(error) {
        console.error("Error fetching news by search", error);
        return [];
    }
}

function displayBlogs(articles) {
    const blogContainer = document.getElementById('blog-container');
    if (!blogContainer) {
        console.error("Blog container not found");
        return;
    }

    blogContainer.innerHTML = "";
    articles.forEach((article) => {
        const blogCard = document.createElement("div");
        blogCard.classList.add("blog-card");

        const img = document.createElement("img");
        img.src = article.urlToImage;
        img.alt = article.title;

        const title = document.createElement("h2");
        const truncatedTitle = article.title.length > 100 ? article.title.slice(0, 100) + "...." : article.title;
        title.textContent = truncatedTitle;

        const description = document.createElement("p");
        description.textContent = article.description;

        blogCard.appendChild(img);
        blogCard.appendChild(title);
        blogCard.appendChild(description);
        blogCard.addEventListener('click', () => { 
            window.open(article.url, '_blank');
        });
        blogContainer.appendChild(blogCard);
    });
}
