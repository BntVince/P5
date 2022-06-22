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

//---------------------------- Variable & Fonctions pour le formulaire ----------------------------//

let formCommand = document.forms[0]; // On créer formCommand qui correspond au formulaire
let regexError = false; // On créer regexError qui nous permettra de savoir si il y a une erreur de saisi
let regexCheckList = { // On créer une liste des diférent regex à checker
    unexpectedCharacter: /[^a-zA-Z\s\-]+/,
    moreThanTreeCharacter: /^[a-zA-Z\s]{0,2}$/,
    addressStart: /^[^0-9]+/,
    addressUnexpectedCharacter: /[^a-zA-Z0-9\s\-]+/,
    emailUnexpectedCharacter: /[^a-zA-Z0-9\s\-@\.]+/,
    emailConform : /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
};
let regexErrorMsg = { // On créer une liste de message d'erreurs
    unexpectedCharacterMsg: "Les caractères spéciaux ne sont pas acceptés",
    moreThanTreeCharacterMsg: "Veuillez renseigner au moins 3 caractères",
    addressStartMsg: "L'adresse doit commencer par le numéro de celle-ci",
    emailUnexpectedCharacterMsg: "Les seuls caractères spéciaux accépté pour l'email sont . @ - ",
    emailConformMsg: "L'adresse email n'est pas conforme, vérifiez votre saisi"
};

function resetRegex(input) { // On créer une fonction qui sera appelé quand aucune érreur n'est constaté afin
    regexError = false // de repasser regexError à false (au cas ou il aurai une valeur diffèrente)
    document.getElementById(input.name+'ErrorMsg').innerText = "" // et de supprimer un message d'erreur (au cas ou il y en aurai eu un)
}

function regexDoubleCheck (input, regexCheck1, regexCheck2, errorMsg1, errorMsg2) { // On créer une fonction capable de checker 2 regex 
    input.addEventListener('input', function() { // Des qu'un utilisateur saisi un caractère
        if (regexCheck1.exec(this.value)) { // On check le 1er regex et si il correspond
            regexError = true; // On passe regexError à true pour signaler qu'il y a une erreur (ce qui empèchera l'envoie du formulaire)
            document.getElementById(this.name+'ErrorMsg').innerText = errorMsg1; // Et on signale à l'utilisateur sont erreur
        }else if (regexCheck2.exec(this.value)) { // On check le 2nd regex et répète les mêmes opérations
            regexError = true;
            document.getElementById(this.name+'ErrorMsg').innerText = errorMsg2;
        }else{ // Si aucune erreur est trouvé (correspondance avec les regexs utilisé)
        resetRegex(this); // On appel la fonction qui supprimera le message d'erruer et repassera regexError à false
        }
    });
}   
//------------------------------ CODE Parti Panier------------------------------//

if (!sessionStorage.panier || !JSON.parse(sessionStorage.panier)[0]) { // Si le panier n'existe pas ou est vide

    cartItems.innerText = "Votre panier est vide !" // On affiche ça
}else{ // si panier existe

    panier = JSON.parse(sessionStorage.panier) // On le transforme en objet utilisable 
    

    for (let kanapInPanier of panier) {  // On parcour le panier
        
        fetch("http://localhost:3000/api/products/"+kanapInPanier.id) // Pour chaque kanap dans le panier on récupère les information de celui-si grace à l'API
        .then(function (app) {
            if (app.ok) {
                return app.json();
            }
        })
        .then(function (item){ // Puis on intègre de façon dynamique tout les éléments nécessaire (tout ceci fonctionne comme la page d'acceuil)

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

            setAttributes(itemArticle, {'data-id': item._id, 'data-color': kanapInPanier.color});
            itemArticle.classList = 'cart__item';

            cartItemImg.classList = 'cart__item__img';

            itemImg.setAttribute('src', item.imageUrl), ('alt', item.altTxt);

            cartItemContent.classList = 'cart__item__content';
            cartItemContentDescription.classList = 'cart__item__content__description';
            cartItemContentDescription.innerHTML += "<h2>"+item.name+"</h2><p>"+kanapInPanier.color+"</p><p>"+item.price+"</p>";
            cartItemContentSettings.classList = 'cart__item__content__settings';
            cartItemContentSettingsQuantity.classList = 'cart__item__content__settings__quantity';
            cartItemContentSettingsQuantity.innerHTML = '<p>Qté : '+kanapInPanier.quantity+'</p>';
            setAttributes(itemQuantity, {'type': 'number', 'name': 'itemQuantity', 'min': '1', 'max': '100', 'value': kanapInPanier.quantity});
            itemQuantity.classList = 'itemQuantity';
            cartItemContentSettingsDelete.classList = 'cart__item__content__settings__delete';
            deleteItem.innerText = 'Supprimer';
            deleteItem.classList = 'deleteItem';

            cartItemImg.append(itemImg);
            cartItemContentSettingsQuantity.append(itemQuantity);
            cartItemContentSettingsDelete.append(deleteItem);
            cartItemContentSettings.append(cartItemContentSettingsQuantity, cartItemContentSettingsDelete);
            cartItemContent.append(cartItemContentDescription, cartItemContentSettings);
            itemArticle.append(cartItemImg, cartItemContent);

            cartItems.append(itemArticle);
            // Une fois intégré, pour chaque kanap du panier affiché 
            totalQuantity += kanapInPanier.quantity; // On rajoute le nombre de kanap du panier 
            totalPrice += item.price * kanapInPanier.quantity; // On rejoute le total du ou des kanap du panier
            writeTot(); // On écrit les valeurs obtenu

            itemQuantity.addEventListener('change', function() {  // Au changement de value d'un des input "itemQuantity"
                
                totalQuantity -= kanapInPanier.quantity; 
                totalQuantity += this.valueAsNumber; // On redéfinie la quantité total
                totalPrice -= item.price * kanapInPanier.quantity;
                totalPrice += item.price * itemQuantity.valueAsNumber; // Et redéfinir le prix total
                        
                kanapInPanier.quantity = itemQuantity.valueAsNumber // On redéfinie la quantité dans le panier et on modifie la valeurs affiché
                itemQuantity.closest('article').querySelector('.cart__item__content__settings__quantity p').innerText = 'Qte : ' + itemQuantity.valueAsNumber;
                writeTot(); // On écrit les valeurs obtenu pour le nombres total d'article et le prix total 
                sessionStorage.setItem('panier', JSON.stringify(panier)); // On modifie également le panier présent dans le sessionStorage pour que ce soit enregistré
            })

            deleteItem.addEventListener('click', function() { console.log(panier) // Au click sur l'un de ceux-ci
        
                totalQuantity -= kanapInPanier.quantity; // On redéfinie la quantité total
                totalPrice -= kanapInPanier.quantity * item.price; // Et redéfinir le prix total
                
                deleteItem.closest('article').remove(); // On supprime l'article affiché
                writeTot(); // On écrit les valeurs obtenu pour le nombres total d'article et le prix total 
                panier.splice(panier.indexOf(kanapInPanier), 1); // On supprime l'article du panier
                sessionStorage.setItem('panier', JSON.stringify(panier)); // On modifie le panier du sessionStorage
                if (!sessionStorage.panier || !JSON.parse(sessionStorage.panier)[0]) { // On vérifie si après suppresion il reste des article dans le panier, sinon 
                    cartItems.innerText = "Votre panier est vide !"; // On affiche que le panier est vide
                };
            })
        })
    }
}

//------------------------------ CODE Parti Formulaire------------------------------//

for (let i = 0; i < 2 ; i++) {// On check ici le Prénom et le Nom (On utilise une boucle puisque qu'ils vont utiliser les même regex)
    regexDoubleCheck(formCommand[i], regexCheckList.unexpectedCharacter, regexCheckList.moreThanTreeCharacter, regexErrorMsg.unexpectedCharacterMsg, regexErrorMsg.moreThanTreeCharacterMsg);
};
// On check l'adresse
regexDoubleCheck(formCommand['address'], regexCheckList.addressUnexpectedCharacter, regexCheckList.addressStart, regexErrorMsg.unexpectedCharacterMsg, regexErrorMsg.addressStartMsg);
// On check la ville
regexDoubleCheck(formCommand['city'], regexCheckList.unexpectedCharacter, regexCheckList.moreThanTreeCharacter, regexErrorMsg.unexpectedCharacterMsg, regexErrorMsg.moreThanTreeCharacterMsg);
// On check l'email 
formCommand['email'].addEventListener('input', function() {
    resetRegex(this);
    if (regexCheckList.emailUnexpectedCharacter.exec(this.value)) {
        regexError = true;
        document.getElementById(this.name+'ErrorMsg').innerText = regexErrorMsg.emailUnexpectedCharacterMsg;
    }else if (!regexCheckList.emailConform.exec(this.value)) {
        regexError = true;
        document.getElementById(this.name+'ErrorMsg').innerText = regexErrorMsg.emailConformMsg;
    }else{ 
    resetRegex(this);
    }
});

//A l'envoie du formulaire
formCommand.addEventListener('submit', function(e) {
    e.preventDefault();// On annule le comportement par défault
    if (!sessionStorage.panier || !JSON.parse(sessionStorage.panier)[0]) {// On vérifie si le panier existe, si il n'exispte pas
        alert('Votre panier est vide, veuillez compléter votre panier avant de commander celui-ci!');// On prévient l'utilisateur qu'il n'existe pas
        return false; // On ne va pas plus loin

    }else if (regexError) { // On vérifie si l'on a une erreur de saisi de l'utilisateur , au quel cas
        alert('Veuillez compléter les champ correctement'); // On prévient l'utilisateur
    return false // Et on ve va pas plus loin

    }else{ // Si le panier existe et qu'il n'y a pas d'erreur

        let contact ={ // On créer contact qui contiendra tout les informations saisi par l'utilisateur
            "firstName": this["firstName"].value,
            "lastName": this["lastName"].value,
            "address": this["address"].value,
            "city": this["city"].value,
            "email": this["email"].value
        };

        let products = []; // On créer products qui sera un array qui contiendra tout les id des produit présent dans le panier

        for (let kanapInPanier of JSON.parse(sessionStorage.panier)) { // On fait une bouvle qui va parcourir tout les éléments du panier et push leur "id" dans product
            products.push(kanapInPanier.id);
        };

        let command = {"contact": contact, "products": products}; // On créer command qui contiendra contact et products

        sessionStorage.setItem('command', JSON.stringify(command)); // On stock command dans le sessionStorage

        window.location.href="./confirmation.html"; // Pour finir on redirige l'utilisateur sur la page de confirmation
    }
    
})