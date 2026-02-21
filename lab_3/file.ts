interface Category {
    id: number;
    name: string;
    shortname: string;
    notes: string;
}

interface CategoriesData {
    categories: Category[];
}

interface Item {
    id: number;
    name: string;
    shortname: string;
    description: string;
    price: number;
    image?: string;
}

interface CategoryData {
    category: string;
    items: Item[];
}

document.addEventListener('DOMContentLoaded', () => {
    const catalogLink = document.getElementById('catalogLink') as HTMLAnchorElement | null;
    const categoriesDiv = document.getElementById('categories') as HTMLDivElement | null;
    const contentDiv = document.getElementById('content') as HTMLDivElement | null;

    if (!catalogLink || !categoriesDiv || !contentDiv) {
        console.error('DOM elements not found');
        return;
    }

    loadHomePage(contentDiv);

    catalogLink.addEventListener('click', (e: Event) => {
        e.preventDefault();
        loadCatalogButtons(categoriesDiv, contentDiv);
    });
});

function loadHomePage(contentDiv: HTMLDivElement): void {
    fetch('categories.json')
        .then((response: Response) => response.json() as Promise<CategoriesData>)
        .then((data: CategoriesData) => {
            contentDiv.innerHTML = '<h2>Featured Products</h2>';
            const promises: Promise<{ categoryName: string; item: Item }>[] = data.categories.map((category: Category) =>
                fetch(`${category.shortname}.json`)
                    .then((response: Response) => response.json() as Promise<CategoryData>)
                    .then((categoryData: CategoryData) => ({
                        categoryName: category.name,
                        item: categoryData.items[0]
                    }))
            );

            Promise.all(promises)
                .then((results: { categoryName: string; item: Item }[]) => {
                    results.forEach((result: { categoryName: string; item: Item }) => {
                        const { categoryName, item } = result;
                        const card: HTMLDivElement = document.createElement('div');
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
                .catch((error: unknown) => {
                    contentDiv.innerHTML = '<p>Error loading featured products.</p>';
                    console.error('Error:', error);
                });
        })
        .catch((error: unknown) => {
            contentDiv.innerHTML = '<p>Error loading categories.</p>';
            console.error('Error:', error);
        });
}

function loadCatalogButtons(categoriesDiv: HTMLDivElement, contentDiv: HTMLDivElement): void {
    fetch('categories.json')
        .then((response: Response) => response.json() as Promise<CategoriesData>)
        .then((data: CategoriesData) => {
            categoriesDiv.innerHTML = '<h3>Categories</h3>';
            contentDiv.innerHTML = ''; 
            data.categories.forEach((category: Category) => {
                const button: HTMLButtonElement = document.createElement('button');
                button.className = 'btn btn-primary category-btn';
                button.textContent = category.name;
                button.addEventListener('click', () => {
                    loadCategory(category.shortname, category.name, categoriesDiv, contentDiv);
                });
                categoriesDiv.appendChild(button);
            });

            const specialsButton: HTMLButtonElement = document.createElement('button');
            specialsButton.className = 'btn btn-success category-btn';
            specialsButton.textContent = 'Specials';
            specialsButton.addEventListener('click', () => {
                const randomCategory: Category = data.categories[Math.floor(Math.random() * data.categories.length)];
                loadCategory(randomCategory.shortname, randomCategory.name, categoriesDiv, contentDiv);
            });
            categoriesDiv.appendChild(specialsButton);
        })
        .catch((error: unknown) => {
            categoriesDiv.innerHTML = '<p>Error loading categories.</p>';
            console.error('Error:', error);
        });
}

function loadCategory(shortname: string, name: string, categoriesDiv: HTMLDivElement, contentDiv: HTMLDivElement): void {
    fetch(`${shortname}.json`)
        .then((response: Response) => response.json() as Promise<CategoryData>)
        .then((data: CategoryData) => {
            categoriesDiv.innerHTML = ''; 
            contentDiv.innerHTML = `<h2>${name}</h2>`;
            data.items.forEach((item: Item) => {
                const card: HTMLDivElement = document.createElement('div');
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
        .catch((error: unknown) => {
            contentDiv.innerHTML = '<p>Error loading category.</p>';
            console.error('Error:', error);
        });
}