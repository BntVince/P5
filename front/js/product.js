let urlId
fetch("http://localhost:3000/api/products")
.then(function (app) {
    if (app.ok) {
        return app.json();
    }
})
.then(function (items) {
    // Ici on récupère l'url de la page actuel et isole l'élement id dans une variable urlId
    const str = document.location.href;
    const url =  new URL(str);
    urlId = url.searchParams.get("id");
   
    // On cherche une correspondance avec l'urlId et l'_id des produits contenue dans l'API
   for (item of items) {
        if (item._id === urlId) {
            rightItem = item;
            break;
        }
    };
    document.title = rightItem.name; // On modifi la balise title pour quelle corresponde au nom de l'article
    // On définie l'image et lui donne ses attributs src et alt
    let itemImg = document.createElement('img');
    itemImg.src = rightItem.imageUrl;
    itemImg.alt = rightItem.altTxt;
    // On créer les éléments img, title, price et description dans la page produit
    document.querySelector('article .item__img').append(itemImg);
    document.querySelector('.item__content__titlePrice #title').innerText = rightItem.name;
    document.querySelector('.item__content__titlePrice #price').innerText = rightItem.price;
    document.querySelector('.item__content__description #description').innerText = rightItem.description;

    // Ici on créer une boucle qui va parcourir toute les valeurs possible de color pour intégrer chaqu'une d'elle
    // dans le menu déroulant 
    for (color of rightItem.colors) {
        itemOption = document.createElement('option');
        itemOption.value = color;
        itemOption.innerText = color;
        document.querySelector('.item__content__settings #colors').append(itemOption);
    };
});

let activeColor = ""; // On défini une varriable et on récupère sa valeur (l45-l48)
let quantity = 0; // On défini une varriable et on récupère sa valeur (l50-l53)

document.getElementById('colors').addEventListener('change', function () {
    activeColor = this[this.selectedIndex].value;
    //console.log(activeColor);
});

document.getElementById('quantity').addEventListener('change', function() {
    activeQuantity = this.valueAsNumber;
    //console.log(quantity);
})
// On créer un constructor pour les ajouts dans le panier 
class addToCart {
    constructor(id, quantity, color) {
        this.id = id;
        this.quantity = quantity;
        this.color = color;
    }
}
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
            panier = JSON.parse(sessionStorage.panier); // On le récupère et l'associe au tableau panier créer (l69)

            for (kanap of panier) { // Pour chaque objet déja présent dans le panier on regarde 
                if(kanap.id == urlId && kanap.color == activeColor) { // Si l'objet rajouter existe déja dans celui-ci au quel cas 
                    kanap.quantity += activeQuantity; // On modifie la quantité de l'objet du panier pour  y rajouter la valeur sélectionner 
                    itemUpdate = true; // On défini que l'on a modifier un objet
                }
            }
            if(!itemUpdate) { // Si on n'a pas modifier 
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