# VoltMoto — Guide des images à remplacer

Toutes les images sont dans le dossier `images/`. Il suffit de remplacer
chaque fichier par ta vraie photo EN GARDANT EXACTEMENT LE MÊME NOM
(même si ton fichier d'origine est un .png, renomme-le en .jpg avant
de le coller, ou dis-le moi et j'ajuste le code).

## Fond fixe (toutes les pages)
- `background.jpg` → l'image de fond fixe visible derrière tout le site.
  Idéal : une photo sombre (moto électrique de nuit, ville de Lomé, etc.)
  Elle est assombrie automatiquement en CSS donc pas besoin qu'elle soit parfaite.

## Catalogue — 20 véhicules (dans l'ordre d'affichage)
- `image1.jpg`  → VoltRide S1 (Moto)
- `image2.jpg`  → VoltRide S2 Sport (Moto)
- `image3.jpg`  → VoltRide S3 Urban (Moto)
- `image4.jpg`  → Thunder E1 (Moto)
- `image5.jpg`  → Thunder E2 Racer (Moto)
- `image6.jpg`  → Zem Volt X (Moto)
- `image7.jpg`  → Zem Volt X Pro (Moto)
- `image8.jpg`  → CityLine E100 (Moto)
- `image9.jpg`  → CityLine E200 (Moto)
- `image10.jpg` → Falcon EV Sport (Moto)
- `image11.jpg` → Falcon EV Max (Moto)
- `image12.jpg` → RoadKing E9 (Moto)
- `image13.jpg` → Nomad E-Cross (Moto)
- `image14.jpg` → EcoRun 50 (Moto)
- `image15.jpg` → Kékê Cargo Pro (Tricycle)
- `image16.jpg` → Kékê Cargo Max (Tricycle)
- `image17.jpg` → Marwa Transport E1 (Tricycle)
- `image18.jpg` → Marwa Business E2 (Tricycle)
- `image19.jpg` → TriVolt Passenger (Tricycle)
- `image20.jpg` → TriVolt Cargo XL (Tricycle)

Les images 1, 2, 3 et 4 servent AUSSI à la sélection mise en avant
sur la page d'accueil — remplace-les et les deux pages seront à jour.

## Page À propos
- `image21.jpg` → photo du showroom / boutique
- `image22.jpg` → photo de l'équipe (Kossi Amewou — Fondateur)
- `image23.jpg` → photo de l'équipe (Ama Dogbé — Ventes)
- `image24.jpg` → photo de l'équipe (Yao Mensah — Atelier/SAV)
- `image25.jpg` → photo de l'équipe (Afi Kponou — Service client)

## Autres éléments à modifier facilement
- Numéro WhatsApp : cherche `22890000000` dans les fichiers .html et
  remplace-le partout par ton vrai numéro (format international sans le +).
- Noms, prix, specs des motos : ouvre `catalogue.html`, chaque véhicule
  est un bloc `<article class="moto-card">` — modifie le texte directement.
- Adresse / horaires / email : en bas de chaque page (section footer)
  et dans `apropos.html` (section contact).
- Nom de l'équipe et rôles : dans `apropos.html`, section "L'équipe VoltMoto".
- Carte Google Maps : dans `apropos.html`, remplace `Lom%C3%A9,Togo` dans
  l'URL de l'iframe par ta vraie adresse (ex: nom+de+ta+boutique,Lomé,Togo).

## Conseils techniques
- Formats recommandés : JPG pour les photos (poids réduit), dimensions
  autour de 1000×750px pour le catalogue, 800×800px pour les portraits.
- Compresse tes images avant de les ajouter (ex: squoosh.app ou tinypng.com)
  pour que le site reste rapide sur mobile.
- Pour tester le site en local : double-clique sur `index.html`, ou
  utilise un serveur local si les animations/menu ne se chargent pas bien.
