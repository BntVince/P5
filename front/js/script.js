function displayProducts(items, conteneurSelector) {
    for (item of items) { // pour chaque élément du array que retourne l'API =>
        //On défini le lien et son href
        let itemLink = document.createElement('a');
        itemLink.href = "./product.html?id=" + item._id;
        //On défini l'article
        let itemArticle = document.createElement('article');
        //On défini l'image, ses attribut src et alt
        let itemImg = document.createElement('img');
        itemImg.src = item.imageUrl;
        itemImg.alt = item.altTxt;
        // On défini le titre, sa class et le texte qu'il contient
        let itemTitle = document.createElement('h3');
        itemTitle.classList = item.name;
        itemTitle.innerText = item.name;
        //On défini un Paragraphe, sa class et la description qui va contenir
        let itemParagraphe = document.createElement('p');
        itemParagraphe.classList = "productDescription";
        itemParagraphe.innerText = item.description;

        //On sélectionne l'élément dans le quel on créer un lien 
        document.querySelector(conteneurSelector).append(itemLink);
        //On créer un article ("itemArticle l15") dans le lien créer plus haut 
        itemLink.append(itemArticle);
        //On créer une Image, un Titre et un Paragraphe
        itemArticle.append(itemImg, itemTitle, itemParagraphe);

    }
}

function getProducts() { // On fait une requête à l'API pour quel nous retourne la liste des produits
    fetch("http://localhost:3000/api/products")
        .then(function (app) {
            if (app.ok) {
                return app.json();
            }
        })
        .then(function (items) {
            displayProducts(items, '#items') // On appel la fonction qui va afficher tous les produits (l1)
        })
}

//--------------------------------------------------------------------------------------------------//

getProducts();