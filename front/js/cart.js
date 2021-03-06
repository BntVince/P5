
//---------------------------- Utilitaire Parti Panier ----------------------------//

const cartItems = document.getElementById('cart__items'); // On définie cartItems, l'élément HTML qui va contenir les article du panier
let totalQuantity = 0 // On définie une variable qui va stocker le total d'article du panier
let totalPrice = 0 // On définie une variable qui va stocker le total du prix du panier
function setAttributes(element, attributes) { // On créer une fonction qui va nous permettre de définir plusieur attributs à un seul élément HTML plus facilement et rapidement
    for (var key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
}
function writeTot() { // On créer une fonction qui va modifier sur la pages les valeurs afficher devant correspondre aux total d'article et du prix total
    document.getElementById('totalQuantity').innerText = totalQuantity
    document.getElementById('totalPrice').innerText = totalPrice
}

function displayNewQuantity(inputQuantity) { // On créer une fonction qui va modifier sur la pages la valeur afficher devant le produit du panier en question
    inputQuantity.closest('article').querySelector('.cart__item__content__settings__quantity p').innerText = 'Qte : ' + inputQuantity.valueAsNumber;
};

function modifyQuantityOfProduct(inputQuantity, productFromCart) { // On créer une fonction qui va modifierla quantité d'un produit dans le panier
    productFromCart.quantity = inputQuantity.valueAsNumber // On redéfinie la quantité dans le panier 
    displayNewQuantity(inputQuantity); // et on modifie la valeurs affiché
}

function removeProductFromCart(inputDelete, productFromCart) { // On créer une fonction qui va supprimer "l'article" correspondant et le supprimer du panier
    inputDelete.closest('article').remove(); // On supprime l'article affiché 
    panier.splice(panier.indexOf(productFromCart), 1); // On supprime l'article du panier
}

function removePreviousProductFromTotal(productFromAPI, productFromCart) {
    totalQuantity -= productFromCart.quantity; // On redéfinie la quantité total
    totalPrice -= productFromCart.quantity * productFromAPI.price; // Et redéfinir le prix total
}

function addNewProductToTotal(productFromAPI, inputQuantity) {
    totalQuantity += inputQuantity.valueAsNumber; // On redéfinie la quantité total
    totalPrice += productFromAPI.price * inputQuantity.valueAsNumber; // Et redéfinir le prix total
}

function listenForDeleteItem(inputDelete, productFromAPI, productFromCart) {
    inputDelete.addEventListener('click', function () {

        removePreviousProductFromTotal(productFromAPI, productFromCart);
        removeProductFromCart(inputDelete, productFromCart);
        writeTot(); // On écrit les valeurs obtenu pour le nombres total d'article et le prix total
        exportCart(); // On modifie le panier du sessionStorage
        checkForCart();
    })
}

function listenForQuantity(inputQuantity, productFromAPI, productFromCart) {
    inputQuantity.addEventListener('change', function () {  // Au changement de value d'un des input "itemQuantity"

        removePreviousProductFromTotal(productFromAPI, productFromCart);
        addNewProductToTotal(productFromAPI, inputQuantity);
        modifyQuantityOfProduct(inputQuantity, productFromCart);
        writeTot(); // On écrit les valeurs obtenu pour le nombres total d'article et le prix total 
        exportCart(); // On modifie également le panier présent dans le sessionStorage pour que ce soit enregistré
    });
};


function displayProductFromCart(productFromAPI, productFromCart) { // Puis on intègre de façon dynamique tout les éléments nécessaire (tout ceci fonctionne comme la page d'acceuil)

    let itemArticle = document.createElement('article');
    let cartItemImg = document.createElement('div');
    let itemImg = document.createElement('img');

    let cartItemContent = document.createElement('div');
    let cartItemContentDescription = document.createElement('div');
    let cartItemContentSettings = document.createElement('div');
    let cartItemContentSettingsQuantity = document.createElement('div');
    let cartItemContentSettingsDelete = document.createElement('div');
    let itemQuantity = document.createElement('input');
    let deleteItem = document.createElement('p');

    setAttributes(itemArticle, { 'data-id': productFromAPI._id, 'data-color': productFromCart.color });
    setAttributes(itemImg, { 'src': productFromAPI.imageUrl, 'alt': productFromAPI.altTxt });
    setAttributes(itemQuantity, { 'type': 'number', 'name': 'itemQuantity', 'min': '1', 'max': '100', 'value': productFromCart.quantity });
    itemArticle.classList = 'cart__item';
    cartItemImg.classList = 'cart__item__img';
    cartItemContent.classList = 'cart__item__content';
    cartItemContentDescription.classList = 'cart__item__content__description';
    cartItemContentSettings.classList = 'cart__item__content__settings';
    deleteItem.classList = 'deleteItem';
    itemQuantity.classList = 'itemQuantity';
    cartItemContentSettingsDelete.classList = 'cart__item__content__settings__delete';
    cartItemContentSettingsQuantity.classList = 'cart__item__content__settings__quantity';

    listenForQuantity(itemQuantity, productFromAPI, productFromCart);
    listenForDeleteItem(deleteItem, productFromAPI, productFromCart);

    cartItemContentDescription.innerHTML += "<h2>" + productFromAPI.name + "</h2><p>" + productFromCart.color + "</p><p>" + productFromAPI.price + " €</p>";
    cartItemContentSettingsQuantity.innerHTML = '<p>Qté : ' + productFromCart.quantity + '</p>';
    deleteItem.innerText = 'Supprimer';

    cartItemImg.append(itemImg);
    cartItemContentSettingsQuantity.append(itemQuantity);
    cartItemContentSettingsDelete.append(deleteItem);
    cartItemContentSettings.append(cartItemContentSettingsQuantity, cartItemContentSettingsDelete);
    cartItemContent.append(cartItemContentDescription, cartItemContentSettings);
    itemArticle.append(cartItemImg, cartItemContent);

    cartItems.append(itemArticle);
    // Une fois intégré, pour chaque kanap du panier affiché 
    addNewProductToTotal(productFromAPI, itemQuantity);
    writeTot(); // On écrit les valeurs obtenu


}

function getProductFromCart(productFromCart) {
    fetch("http://localhost:3000/api/products/" + productFromCart.id)
        .then(function (app) {
            if (app.ok) {
                return app.json();
            }
        })
        .then(function (item) {
            displayProductFromCart(item, productFromCart);
        });
};

function getAllProductsFromCart(cart) {
    for (let kanapInPanier of cart) {  // On parcour le panier

        getProductFromCart(kanapInPanier);
    }
}

function importCart() {
    return JSON.parse(sessionStorage.panierOfKanap9959); // On le récupère et l'associe au tableau panier créer
};

function exportCart() {
    sessionStorage.setItem('panierOfKanap9959', JSON.stringify(panier));
}

function showUserCartIsEmpty() {
    cartItems.innerText = "Votre panier est vide !"
}

function checkForCart() {
    if (!sessionStorage.panierOfKanap9959 || !JSON.parse(sessionStorage.panierOfKanap9959)[0]) {
        showUserCartIsEmpty();
        return false
    } else {
        return true
    }
}

//--------------------------- Utilitaires Parti Formulaire ---------------------------//

let formCommand = document.forms[0]; // On créer formCommand qui correspond au formulaire
let regexError = false; // On créer regexError qui nous permettra de savoir si il y a une erreur de saisi

let regexCheckList = { // On créer une liste des diférents regex à checker
    unexpectedCharacter: /[^a-zA-Z\s\-]+/,
    moreThanTreeCharacter: /^[a-zA-Z\s]{0,2}$/,
    addressStart: /^[^0-9]+/,
    addressUnexpectedCharacter: /[^a-zA-Z0-9\s\-]+/,
    emailUnexpectedCharacter: /[^a-zA-Z0-9\s\-@\.]+/,
    emailConform: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
};
let regexErrorMsg = { // On créer une liste de messages d'erreurs
    unexpectedCharacterMsg: "Les caractères spéciaux ne sont pas acceptés",
    moreThanTreeCharacterMsg: "Veuillez renseigner au moins 3 caractères",
    addressStartMsg: "L'adresse doit commencer par le numéro de celle-ci",
    emailUnexpectedCharacterMsg: "Les seuls caractères spéciaux accépté pour l'email sont . @ - ",
    emailConformMsg: "L'adresse email n'est pas conforme, vérifiez votre saisi"
};

function resetErrorMsg(input) { // On créer une fonction qui sera appelé quand aucune érreur n'est constaté afin
    document.getElementById(input.name + 'ErrorMsg').innerText = "" // et de supprimer un message d'erreur (au cas ou il y en aurai eu un)
}

function showErrorMsg(input, errorMsg) {
    document.getElementById(input.name + 'ErrorMsg').innerText = errorMsg;
}

function getRegexError(input, errorMsg) {
    showErrorMsg(input, errorMsg);
    return true
}

function checkForRegexError(input, regexCheck, errorMsg) {
    if (regexCheck.exec(input.value)) {
        getRegexError(input, errorMsg)
        return true
    } else {
        return false
    }
}

function regexDynamicCheck(input, regexCheck1, regexCheck2, errorMsg1, errorMsg2) { // On créer une fonction capable de checker 2 regex 
    input.addEventListener('input', function () { // Des qu'un utilisateur saisi un caractère
        regexDoubleCheck(input, regexCheck1, regexCheck2, errorMsg1, errorMsg2)
    });
}

function regexDoubleCheck(input, regexCheck1, regexCheck2, errorMsg1, errorMsg2) {
    if (checkForRegexError(input, regexCheck1, errorMsg1)) {
        return true
        // On check le 1er regex et si il correspond
    } else if (checkForRegexError(input, regexCheck2, errorMsg2)) {
        return true
        // On check le 2nd regex et répète les mêmes opérations
    } else { // Si aucune erreur est trouvé (correspondance avec les regexs utilisé)
        resetErrorMsg(input); // On appel la fonction qui supprimera le message d'erreur et repassera regexError à false
        return false
    }
}

function submitFormForCommand(form) {
    form.addEventListener('submit', function (e) {
        e.preventDefault();// On annule le comportement par défault





        if (!checkForCart()) {// On vérifie si le panier existe, si il n'exispte pas
            alert('Votre panier est vide, veuillez compléter votre panier avant de commander celui-ci!');// On prévient l'utilisateur qu'il n'existe pas
            return false; // On ne va pas plus loin

        } else if (
            regexError ||
            regexDoubleCheck(formCommand['firstName'], regexCheckList.unexpectedCharacter, regexCheckList.moreThanTreeCharacter, regexErrorMsg.unexpectedCharacterMsg, regexErrorMsg.moreThanTreeCharacterMsg) ||
            regexDoubleCheck(formCommand['lastName'], regexCheckList.unexpectedCharacter, regexCheckList.moreThanTreeCharacter, regexErrorMsg.unexpectedCharacterMsg, regexErrorMsg.moreThanTreeCharacterMsg) ||
            regexDoubleCheck(formCommand['address'], regexCheckList.addressUnexpectedCharacter, regexCheckList.addressStart, regexErrorMsg.unexpectedCharacterMsg, regexErrorMsg.addressStartMsg) ||
            regexDoubleCheck(formCommand['city'], regexCheckList.unexpectedCharacter, regexCheckList.moreThanTreeCharacter, regexErrorMsg.unexpectedCharacterMsg, regexErrorMsg.moreThanTreeCharacterMsg)
        ) { // On vérifie si l'on a une erreur de saisi de l'utilisateur , au quel cas
            alert('Veuillez compléter les champs correctement'); // On prévient l'utilisateur
            return false // On ve va pas plus loin

        } else { // Si le panier existe et qu'il n'y a pas d'erreur

            panier = importCart();

            let contact = { // On créer contact qui contiendra tout les informations saisi par l'utilisateur
                "firstName": form["firstName"].value,
                "lastName": form["lastName"].value,
                "address": form["address"].value,
                "city": form["city"].value,
                "email": form["email"].value
            };

            let products = []; // On créer products qui sera un array qui contiendra toutes les id des produits présent dans le panier

            for (let kanapInPanier of panier) { // On fait une bouvle qui va parcourir tout les éléments du panier et push leur "id" dans product
                products.push(kanapInPanier.id);
            };

            let command = { "contact": contact, "products": products }; // On créer command qui contiendra contact et products

            sessionStorage.setItem('command', JSON.stringify(command)); // On stock command dans le sessionStorage

            window.location.href = "./confirmation.html"; // Pour finir on redirige l'utilisateur sur la page de confirmation
        }

    })
}

//-------------------------------- CODE Parti Panier --------------------------------//


if (checkForCart()) { // Si le panier existe

    panier = importCart(); // On le transforme en objet utilisable 

    getAllProductsFromCart(panier);

}

//------------------------------ CODE Parti Formulaire ------------------------------//

regexDynamicCheck(formCommand['firstName'], regexCheckList.unexpectedCharacter, regexCheckList.moreThanTreeCharacter, regexErrorMsg.unexpectedCharacterMsg, regexErrorMsg.moreThanTreeCharacterMsg);

regexDynamicCheck(formCommand['lastName'], regexCheckList.unexpectedCharacter, regexCheckList.moreThanTreeCharacter, regexErrorMsg.unexpectedCharacterMsg, regexErrorMsg.moreThanTreeCharacterMsg);
// On check l'adresse
regexDynamicCheck(formCommand['address'], regexCheckList.addressUnexpectedCharacter, regexCheckList.addressStart, regexErrorMsg.unexpectedCharacterMsg, regexErrorMsg.addressStartMsg);
// On check la ville
regexDynamicCheck(formCommand['city'], regexCheckList.unexpectedCharacter, regexCheckList.moreThanTreeCharacter, regexErrorMsg.unexpectedCharacterMsg, regexErrorMsg.moreThanTreeCharacterMsg);
// On check l'email 
//regexDoubleCheck(formCommand['email'], regexCheckList.emailUnexpectedCharacter, !regexCheckList.emailConform, regexErrorMsg.emailUnexpectedCharacterMsg, regexErrorMsg.emailConformMsg)

formCommand['email'].addEventListener('input', function () {
    if (checkForRegexError(this, regexCheckList.emailUnexpectedCharacter, regexErrorMsg.emailUnexpectedCharacterMsg)) {
        regexError = getRegexError(this, regexErrorMsg.emailUnexpectedCharacterMsg)
    } else if (!checkForRegexError(this, regexCheckList.emailConform, regexErrorMsg.emailConformMsg)) {
        regexError = getRegexError(this, regexErrorMsg.emailConformMsg)
    } else {
        regexError = false;
        resetErrorMsg(this);
    }
});

submitFormForCommand(formCommand);