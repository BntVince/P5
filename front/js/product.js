fetch("http://localhost:3000/api/products")
.then(function (app) {
    if (app.ok) {
        return app.json();
    }
})
.then(function (items) {
   //console.log(items);
    const str = document.location.href;
    const url =  new URL(str);
    const urlId = url.searchParams.get("id");
   //console.log(urlId);

   for (item of items) {
        if (item._id === urlId) {
            rightItem = item;
            break;
        }
    };

    itemImg = document.createElement('img');
    itemImg.src = rightItem.imageUrl;
    itemImg.alt = rightItem.altTxt;


    document.querySelector('article .item__img').append(itemImg);
    document.querySelector('.item__content__titlePrice #title').innerText = rightItem.name;
    document.querySelector('.item__content__titlePrice #price').innerText = rightItem.price;
    document.querySelector('.item__content__description #description').innerText = rightItem.description;


    for (color of rightItem.colors) {
        itemOption = document.createElement('option');
        itemOption.value = color;
        itemOption.innerText = color;
        document.querySelector('.item__content__settings #colors').append(itemOption);
        
    };

    //console.log(rightItem);
})