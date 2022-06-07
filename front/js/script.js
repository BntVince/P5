fetch("http://localhost:3000/api/products")
.then(function (app) {
    if (app.ok) {
        return app.json();
    }
})
.then(function (items) {
    //console.log(items);

    for(item of items) {

        itemLink = document.createElement('a');
        itemLink.href = "./product.html?id=" + item._id;

        itemArticle = document.createElement('article');
        
        itemImg = document.createElement('img');
        itemImg.src = item.imageUrl;
        itemImg.alt = item.altTxt;

        itemTitle = document.createElement('h3');
        itemTitle.classList = item.name;
        itemTitle.innerText = item.name;

        itemParagraphe = document.createElement('p');
        itemParagraphe.classList = "productDescription";
        itemParagraphe.innerText = item.description;


        document.getElementById('items').append(itemLink);

        itemLink.append(itemArticle);
        
        itemArticle.append(itemImg, itemTitle, itemParagraphe);

    }

})