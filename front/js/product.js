let urlId // On définie une variable qui va contenir l'id du produit 
let activeColor = ""; // On défini une varriable et on récupère sa valeur 
let activeQuantity = 0; // On défini une varriable et on récupère sa valeur 

class NewCartItems {// On créer un constructor pour les ajouts dans le panier 
    constructor(id, quantity, color) {
        this.id = id;
        this.quantity = quantity;
        this.color = color;
    }
}

function getUrlId() {// Ici on récupère l'url de la page actuel et isole l'élement id dans la variable urlId
    let str = document.location.href;
    let url = new URL(str);
    urlId = url.searchParams.get("id");
};

function displayRightProduct(item) {
    document.title = item.name; // On modifi la balise title pour quelle corresponde au nom de l'article
    // On définie l'image et lui donne ses attributs src et alt
    let itemImg = document.createElement('img');
    itemImg.src = item.imageUrl;
    itemImg.alt = item.altTxt;
    // On créer les éléments img, title, price et description dans la page produit
    document.querySelector('article .item__img').append(itemImg);
    document.querySelector('.item__content__titlePrice #title').innerText = item.name;
    document.querySelector('.item__content__titlePrice #price').innerText = item.price;
    document.querySelector('.item__content__description #description').innerText = item.description;
    for (color of item.colors) {// Ici on créer une boucle qui va parcourir toute les valeurs possible de color pour intégrer chaqu'une d'elledans le menu déroulant 
        itemOption = document.createElement('option');
        itemOption.value = color;
        itemOption.innerText = color;
        document.querySelector('.item__content__settings #colors').append(itemOption);
    };
};

// On appel directement le bon object dans l'API grace à id contenue dans l'url
function getRightProduct(productId) {
    fetch("http://localhost:3000/api/products/" + productId)
        .then(function (app) {
            if (app.ok) {
                return app.json();
            }
        })
        .then(function (item) {
            displayRightProduct(item);
        });
};

function changeActiveColor() {
    document.getElementById('colors').addEventListener('change', function () {
        activeColor = this.value;
    });
};

function changeActiveQuantity() {
    document.getElementById('quantity').addEventListener('change', function () {
        activeQuantity = this.valueAsNumber;
    });
};

function alertUserToChooseSetings() {
    alert("Veuillez sélectionner une couleur et le nombre de Kanap que vous souhaitez commander")
};

function checkForExistingProduct(cart) {
    for (kanap of cart) { // Pour chaque objet déja présent dans le panier on regarde 
        if (kanap.id == urlId && kanap.color == activeColor) { // Si l'objet rajouter existe déja dans celui-ci au quel cas 
            modifyExistingProduct();
            return true;
        };
    };
    return false
};

function modifyExistingProduct() {
    kanap.quantity = activeQuantity; // On modifie la quantité de l'objet du panier pour  y rajouter la valeur sélectionner 
};

function addNewProductInCart(newProduct, cart) {
    newProduct = new NewCartItems(urlId, activeQuantity, activeColor); // On créer un nouvelle objet à ajouter
    cart.push(newProduct); // On met l'objet dans le panier
};

function exportCart(cart) {
    sessionStorage.setItem("panier", JSON.stringify(cart)) // Pour finir on stock le panier dans sessionStorage
};

function importCart() {
    return JSON.parse(sessionStorage.panier); // On le récupère et l'associe au tableau panier créer

};

function addToCart() {
    document.getElementById('addToCart').addEventListener('click', function () {//Quand on click sur Ajouter au panier
        if (activeColor == "" || activeQuantity == 0) { //Si aucune couleur ou aucune quantité à ajouter n'est sélectionner 
            alertUserToChooseSetings();
        } else {
            let panier = []; // On déclare panier qui va contenir sous forme de tableau les objets
            let addKanap; // On déclare l'objet qui sera ajouté au panier si ajout il y a
            if (sessionStorage.panier) { // Si un panier existe déja dans le sessionStorage

                panier = importCart();
                if (!checkForExistingProduct(panier)) { // Si l'utilisateur ajoute un produit qui n'existe pas déjà dans le panier
                    addNewProductInCart(addKanap, panier);
                };
            } else {
                addNewProductInCart(addKanap, panier);
            };
            exportCart(panier);
        };
    });
};

//--------------------------------------------------------------------------------------------------//

getUrlId();

getRightProduct(urlId);

changeActiveColor();

changeActiveQuantity();

addToCart();