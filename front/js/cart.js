const cartItems = document.getElementById('cart__items');
let totalQuantity = 0
let totalPrice = 0
function setAttributes(element, attributes) {
    for(var key in attributes) {
      element.setAttribute(key, attributes[key]);
    }
  }
function writeTot() {
    document.getElementById('totalQuantity').innerText = totalQuantity
    document.getElementById('totalPrice').innerText = totalPrice
}
  
fetch("http://localhost:3000/api/products")
.then(function (app) {
    if (app.ok) {
        return app.json();
    }
})
.then(function (items) {
    console.log(items);

    if (!sessionStorage.panier) {

        cartItems.innerText = "Votre panier est vide !"
    }else{

        let panier = JSON.parse(sessionStorage.panier)
        //console.log(panier)

        for (let kanapInPanier of panier) {  //console.log('la')
            for (let kanap of items) {  //console.log('ici')
                if (kanapInPanier.id == kanap._id) {
                    console.log(kanap);
                    console.log(kanapInPanier);

                    let itemArticle = document.createElement('article');
                    let cartItemImg = document.createElement('div');
                    let itemImg = document.createElement('img');

                    let cartItemContent = document.createElement('div')
                    let cartItemContentDescription = document.createElement('div')
                    let cartItemContentSettings = document.createElement('div')
                    let cartItemContentSettingsQuantity = document.createElement('div')
                    let cartItemContentSettingsDelete = document.createElement('div')
                    let itemQuantity = document.createElement('input')
                    let deleteItem = document.createElement('p')

                    setAttributes(itemArticle, {'data-id': kanap._id, 'data-color': kanapInPanier.color});
                    itemArticle.classList = 'cart__item';

                    cartItemImg.classList = 'cart__item__img';

                    itemImg.setAttribute('src', kanap.imageUrl), ('alt', kanap.altTxt);

                    cartItemContent.classList = 'cart__item__content'
                    cartItemContentDescription.classList = 'cart__item__content__description'
                    cartItemContentDescription.innerHTML += "<h2>"+kanap.name+"</h2><p>"+kanapInPanier.color+"</p><p>"+kanap.price+"</p>"
                    cartItemContentSettings.classList = 'cart__item__content__settings'
                    cartItemContentSettingsQuantity.classList = 'cart__item__content__settings__quantity'
                    cartItemContentSettingsQuantity.innerHTML = '<p>Qté : '+kanapInPanier.quantity+'</p>'
                    setAttributes(itemQuantity, {'type': 'number', 'name': 'itemQuantity', 'min': '1', 'max': '100', 'value': kanapInPanier.quantity})
                    itemQuantity.classList = 'itemQuantity'
                    cartItemContentSettingsDelete.classList = 'cart__item__content__settings__delete'
                    deleteItem.innerText = 'Supprimer'
                    deleteItem.classList = 'deleteItem'

                    cartItemImg.append(itemImg)
                    cartItemContentSettingsQuantity.append(itemQuantity)
                    cartItemContentSettingsDelete.append(deleteItem)
                    cartItemContentSettings.append(cartItemContentSettingsQuantity, cartItemContentSettingsDelete)
                    cartItemContent.append(cartItemContentDescription, cartItemContentSettings)
                    itemArticle.append(cartItemImg, cartItemContent)

                    cartItems.append(itemArticle);

                    totalQuantity += kanapInPanier.quantity
                    totalPrice += kanap.price * kanapInPanier.quantity
                    writeTot()
                    break;
                }
            }



        }
        let itemsQuantity = document.querySelectorAll('.itemQuantity')
        for (let inputQuantity of itemsQuantity) {
            inputQuantity.addEventListener('change', function () {
                for (let kanap of panier) {
                    if (kanap.id == this.closest('article').dataset.id) {
                        totalQuantity -= kanap.quantity 
                        totalQuantity += this.valueAsNumber
                        for (let item of items) {
                            if (kanap.id == item._id) {
                                let oldValue = 0
                                let newValue = 0
                                oldValue = item.price * kanap.quantity
                                newValue = item.price * inputQuantity.valueAsNumber

                                totalPrice -= oldValue
                                totalPrice += newValue
                            }
                        }
                        
                        kanap.quantity = this.valueAsNumber
                        
                        sessionStorage.setItem('panier', JSON.stringify(panier))
                        for(let article of document.querySelectorAll('article')) {
                            if (kanap.id == article.dataset.id)
                            article.querySelector('.cart__item__content__settings__quantity p').innerText = 'Qte : ' + inputQuantity.valueAsNumber
                        }
                    }
                }
                // console.log(inputQuantity.closest('article').dataset.id)
                writeTot()
                console.log(totalPrice)
                console.log(totalQuantity)
            })
        }
    }

    console.log(totalPrice)
    console.log(totalQuantity)

})

