fetch("http://localhost:3000/api/products")
.then(function (app) {
    if (app.ok) {
        return app.json();
    }
})
.then(function (items) {
    //console.log(items);

    for(item of items) { // pour chaque élément du array que retourne l'API =>
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

        //On sélectionne l'élément dans le quel on créer un lien ("itemLink l12-13")
        document.getElementById('items').append(itemLink);
        //On créer un article ("itemArticle l15") dans le lien créer plus haut 
        itemLink.append(itemArticle);
        //On créer une Image, un Titre et un Paragraphe ("itemImg l17-19", "itemTitle l21-23", "itemParagraphe l25--27" )
        itemArticle.append(itemImg, itemTitle, itemParagraphe);

    }

})