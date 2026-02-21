"use strict";
document.addEventListener('DOMContentLoaded', () => {
    const catalogLink = document.getElementById('catalogLink');
    const categoriesDiv = document.getElementById('categories');
    const contentDiv = document.getElementById('content');
    if (!catalogLink || !categoriesDiv || !contentDiv) {
        console.error('DOM elements not found');
        return;
    }
    loadHomePage(contentDiv);
    catalogLink.addEventListener('click', (e) => {
        e.preventDefault();
        loadCatalogButtons(categoriesDiv, contentDiv);
    });
});
function loadHomePage(contentDiv) {
    fetch('categories.json')
        .then((response) => response.json())
        .then((data) => {
        contentDiv.innerHTML = '<h2>Featured Products</h2>';
        const promises = data.categories.map((category) => fetch(`${category.shortname}.json`)
            .then((response) => response.json())
            .then((categoryData) => ({
            categoryName: category.name,
            item: categoryData.items[0]
        })));
        Promise.all(promises)
            .then((results) => {
            results.forEach((result) => {
                const { categoryName, item } = result;
                const card = document.createElement('div');
                card.className = 'col-md-4 mb-4';
                card.innerHTML = `
                            <div class="card">
                                <img src="${item.image || 'https://place-hold.it/200x200'}" class="card-img-top" alt="${item.name}">
                                <div class="card-body">
                                    <h5 class="card-title">${item.name}</h5>
                                    <p class="card-text">${item.description}</p>
                                    <p class="card-text"><strong>Price:</strong> $${item.price}</p>
                                    <p class="card-text"><small>Category: ${categoryName}</small></p>
                                </div>
                            </div>
                        `;
                contentDiv.appendChild(card);
            });
        })
            .catch((error) => {
            contentDiv.innerHTML = '<p>Error loading featured products.</p>';
            console.error('Error:', error);
        });
    })
        .catch((error) => {
        contentDiv.innerHTML = '<p>Error loading categories.</p>';
        console.error('Error:', error);
    });
}
function loadCatalogButtons(categoriesDiv, contentDiv) {
    fetch('categories.json')
        .then((response) => response.json())
        .then((data) => {
        categoriesDiv.innerHTML = '<h3>Categories</h3>';
        contentDiv.innerHTML = '';
        data.categories.forEach((category) => {
            const button = document.createElement('button');
            button.className = 'btn btn-primary category-btn';
            button.textContent = category.name;
            button.addEventListener('click', () => {
                loadCategory(category.shortname, category.name, categoriesDiv, contentDiv);
            });
            categoriesDiv.appendChild(button);
        });
        const specialsButton = document.createElement('button');
        specialsButton.className = 'btn btn-success category-btn';
        specialsButton.textContent = 'Specials';
        specialsButton.addEventListener('click', () => {
            const randomCategory = data.categories[Math.floor(Math.random() * data.categories.length)];
            loadCategory(randomCategory.shortname, randomCategory.name, categoriesDiv, contentDiv);
        });
        categoriesDiv.appendChild(specialsButton);
    })
        .catch((error) => {
        categoriesDiv.innerHTML = '<p>Error loading categories.</p>';
        console.error('Error:', error);
    });
}
function loadCategory(shortname, name, categoriesDiv, contentDiv) {
    fetch(`${shortname}.json`)
        .then((response) => response.json())
        .then((data) => {
        categoriesDiv.innerHTML = '';
        contentDiv.innerHTML = `<h2>${name}</h2>`;
        data.items.forEach((item) => {
            const card = document.createElement('div');
            card.className = 'col-md-4 mb-4';
            card.innerHTML = `
                    <div class="card">
                        <img src="${item.image || 'https://place-hold.it/200x200'}" class="card-img-top" alt="${item.name}">
                        <div class="card-body">
                            <h5 class="card-title">${item.name}</h5>
                            <p class="card-text">${item.description}</p>
                            <p class="card-text"><strong>Price:</strong> $${item.price}</p>
                        </div>
                    </div>
                `;
            contentDiv.appendChild(card);
        });
    })
        .catch((error) => {
        contentDiv.innerHTML = '<p>Error loading category.</p>';
        console.error('Error:', error);
    });
}
