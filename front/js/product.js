let urlId // On définie une variable qui va contenir l'id du produit 
let activeColor = ""; // On défini une varriable et on récupère sa valeur 
let activeQuantity = 0; // On défini une varriable et on récupère sa valeur 
// On créer un constructor pour les ajouts dans le panier 
class addToCart {
    constructor(id, quantity, color) {
        this.id = id;
        this.quantity = quantity;
        this.color = color;
    }
}

// Ici on récupère l'url de la page actuel et isole l'élement id dans la variable urlId
const str = document.location.href;
const url =  new URL(str);
urlId = url.searchParams.get("id");

// On appel directement le bon object dans l'API grace à id contenue dans l'url
fetch("http://localhost:3000/api/products/"+urlId)
.then(function (app) {
    if (app.ok) {
        return app.json();
    }
})
.then(function (item) {

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

    // Ici on créer une boucle qui va parcourir toute les valeurs possible de color pour intégrer chaqu'une d'elle
    // dans le menu déroulant 
    for (color of item.colors) {
        itemOption = document.createElement('option');
        itemOption.value = color;
        itemOption.innerText = color;
        document.querySelector('.item__content__settings #colors').append(itemOption);
    };
});


document.getElementById('colors').addEventListener('change', function () {
    activeColor = this.value;
});

document.getElementById('quantity').addEventListener('change', function() {
    activeQuantity = this.valueAsNumber;
})
//Quand on click sur Ajouter au panier
document.getElementById('addToCart').addEventListener('click', function() {
    //Si aucune couleur ou aucune quantité à ajouter n'est sélectionner 
    if(activeColor == "" || activeQuantity == 0) {
        alert("Veuillez sélectionner une couleur et le nombre de Kanap que vous souhaitez commander")
    }else{
       
        let panier = []; // On déclare panier qui va contenir sous forme de tableau les objets
        let addKanap; // On déclare l'objet qui sera ajouté au panier si ajout il y a
        let itemUpdate = false; // On créer une variable qui nous servira à déterminer si au click on créer un nouvelobjet ou l'on met à jour un déja existant
        if(sessionStorage.panier) { // Si un panier existe déja dans le sessionStorage
            panier = JSON.parse(sessionStorage.panier); // On le récupère et l'associe au tableau panier créer 

            for (kanap of panier) { // Pour chaque objet déja présent dans le panier on regarde 
                if(kanap.id == urlId && kanap.color == activeColor) { // Si l'objet rajouter existe déja dans celui-ci au quel cas 
                    kanap.quantity += activeQuantity; // On modifie la quantité de l'objet du panier pour  y rajouter la valeur sélectionner 
                    itemUpdate = true; // On défini que l'on a modifier un objet
                }
            }
            if(!itemUpdate) { // Si on n'a pas modifier d'objet
            addKanap = new addToCart (urlId, activeQuantity, activeColor); // On créer un nouvelle objet à ajouter
            panier.push(addKanap); // On met l'objet dans le panier
            }
        }else{
            addKanap = new addToCart (urlId, activeQuantity, activeColor); // On créer un nouvelle objet à ajouter
            panier.push(addKanap); // On met l'objet dans le panier
        }
    sessionStorage.setItem("panier", JSON.stringify(panier)) // Pour finir on stock le panier dans sessionStorage
    }
})