//--------------------------- UTILISABLE ---------------------------//
const cartItems = document.getElementById('cart__items'); // On définie cartItems, l'élément HTML qui va contenir les article du panier
let totalQuantity = 0 // On définie une variable qui va stocker le total d'article du panier
let totalPrice = 0 // On définie une variable qui va stocker le total du prix du panier
function setAttributes(element, attributes) { // On créer une fonction qui va nous permettre de définir plusieur attributs à un seul élément HTML plus facilement et rapidement
    for(var key in attributes) {
      element.setAttribute(key, attributes[key]);
    }
}
function writeTot() { // On créer une fonction qui va modifier sur la pages les valeurs afficher devant correspondre aux total d'article et du prix total
    document.getElementById('totalQuantity').innerText = totalQuantity
    document.getElementById('totalPrice').innerText = totalPrice
}   
//------------------------------ CODE ------------------------------//
if (!sessionStorage.panier || !JSON.parse(sessionStorage.panier)[0]) { // Si le panier n'existe pas ou est vide

    cartItems.innerText = "Votre panier est vide !" // On affiche ça
}else{ // si panier existe

    panier = JSON.parse(sessionStorage.panier) // On le transforme en Array utilisable 
    

    for (let kanapInPanier of panier) {  // On parcour le panier
        
        fetch("http://localhost:3000/api/products/"+kanapInPanier.id)
        .then(function (app) {
            if (app.ok) {
                return app.json();
            }
        })
        .then(function (item){

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

            setAttributes(itemArticle, {'data-id': item._id, 'data-color': kanapInPanier.color});
            itemArticle.classList = 'cart__item';

            cartItemImg.classList = 'cart__item__img';

            itemImg.setAttribute('src', item.imageUrl), ('alt', item.altTxt);

            cartItemContent.classList = 'cart__item__content'
            cartItemContentDescription.classList = 'cart__item__content__description'
            cartItemContentDescription.innerHTML += "<h2>"+item.name+"</h2><p>"+kanapInPanier.color+"</p><p>"+item.price+"</p>"
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
            // Une fois créer , pour chaque kanap du panier et affiché 
            totalQuantity += kanapInPanier.quantity // On rajoute le nombre de kanap du panier 
            totalPrice += item.price * kanapInPanier.quantity // On rejoute le total du ou des kanap du panier
            writeTot() // On écrit les valeurs obtenu

            itemQuantity.addEventListener('change', function() {  // Au changement de value de l'un de ceux-ci
                
                totalQuantity -= kanapInPanier.quantity 
                totalQuantity += this.valueAsNumber // On redéfinie la quantité totals
                totalPrice -= item.price * kanapInPanier.quantity
                totalPrice += item.price * itemQuantity.valueAsNumber // Et redéfinir le prix total
                        
                kanapInPanier.quantity = itemQuantity.valueAsNumber // On redéfinie la quantité dans le panier et on modifie la valeurs affiché
                itemQuantity.closest('article').querySelector('.cart__item__content__settings__quantity p').innerText = 'Qte : ' + itemQuantity.valueAsNumber 
                writeTot() // On écrit les valeurs obtenu pour le nombres total d'article et le prix total ( que l'on a modifié l90-95)
                sessionStorage.setItem('panier', JSON.stringify(panier)) // On modifie également le panier présent dans le sessionStorage pour que ce soit enregistré
            })

            deleteItem.addEventListener('click', function() { console.log(panier) // Au click sur l'un de ceux-ci
        
                totalQuantity -= kanapInPanier.quantity
                totalPrice -= kanapInPanier.quantity * item.price // Et redéfinir le prix total
                
                deleteItem.closest('article').remove() // On supprime l'article affiché
                writeTot() // On écrit les valeurs obtenu pour le nombres total d'article et le prix total ( que l'on a modifié l115-116)
                panier.splice(panier.indexOf(kanapInPanier), 1) // On supprime l'article du panier
                sessionStorage.setItem('panier', JSON.stringify(panier)) // On modifie le panier du sessionStorage
                if (!sessionStorage.panier || !JSON.parse(sessionStorage.panier)[0]) { // On vérifie si après suppresion il reste des article dans le panier, sinon 
                    cartItems.innerText = "Votre panier est vide !" // On affiche que le panier est vide
                }
            })
        })
    }
}