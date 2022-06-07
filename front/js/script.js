fetch("http://localhost:3000/api/products")
.then(function (app) {
    if (app.ok) {
        return app.json();
    }
})
.then(function (value) {
    console.log(value);

    for(item of value) {

        itemLink = document.createElement('a');
        itemArticle = document.createElement('article')
        itemImg = document.createElement('img')
        itemTitle = document.createElement('h3')
        itemParagraphe = document.createElement('p')


        document.getElementById('items').append(itemLink)
        itemLink.href = "./product.html?id=" + item._id

        itemLink.append(itemArticle)
        itemArticle.append(itemImg, itemTitle, itemParagraphe)

        itemImg.src = item.imageUrl
        itemImg.alt = item.altTxt 

        itemTitle.classList = item.name
        itemTitle.innerText = item.name

        itemParagraphe.classList = "productDescription";
        itemParagraphe.innerText = item.description
    }

    

})