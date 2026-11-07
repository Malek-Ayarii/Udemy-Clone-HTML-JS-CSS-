# Learnly - mini plateforme de cours en ligne

Learnly est un mini LMS (Learning Management System) réalisé en **HTML5, CSS3 et JavaScript**, sans framework ni dépendance. Il propose trois cours de développement web (HTML, CSS, JavaScript), chacun découpé en leçons avec vidéo, texte, schémas et exemples de code, ainsi qu'un suivi de progression enregistré dans le navigateur.

## Fonctionnalités

### Page d'accueil (`index.html`)
- **Catalogue de cours** sous forme de cartes : auteur, note, durée, niveau, badge et prix.
- **Recherche en direct** : la liste se filtre à chaque frappe dans la barre de recherche.
- **Filtres par catégorie** : Développement web, Design, Programmation.
- **Message « aucun résultat »** quand aucun cours ne correspond.
- **Progression affichée sur chaque carte** (pourcentage de leçons terminées).
- **Formulaire d'inscription** (simulation : un message de confirmation s'affiche, aucune donnée n'est envoyée).
- Cours « Bientôt disponible » : Figma, Git et GitHub, Python.

### Pages de cours (`cours-html.html`, `cours-css.html`, `cours-js.html`)
- **4 leçons par cours**, avec vidéo YouTube intégrée (`youtube-nocookie.com`).
- **Navigation** entre les leçons via le programme du cours ou les boutons Précédent / Suivant.
- **« Marquer comme terminée »** : enregistre la leçon et passe automatiquement à la suivante.
- **Barre de progression** mise à jour en temps réel, avec message de félicitations à 100 %.
- **Réinitialisation** de la progression d'un cours.
- **Lien direct vers une leçon** via l'URL, par exemple `cours-html.html#html-3`.
- **Démo interactive** dans la leçon JavaScript sur les événements (compteur de clics).

### Général
- **Responsive** : ordinateur, tablette et téléphone, avec menu burger sur petit écran.
- **Accessibilité** : HTML sémantique, attributs ARIA (`aria-expanded`, `aria-pressed`, `aria-current`, `aria-valuenow`), libellés de formulaire, texte réservé aux lecteurs d'écran (`.sr-only`).

## Structure du projet

```
mini projet/
├── index.html          Page d'accueil : catalogue, recherche, filtres, inscription
├── cours-html.html     Cours HTML5 : les fondamentaux du web
├── cours-css.html      Cours CSS3 moderne : Flexbox, Grid et responsive
├── cours-js.html       Cours JavaScript pour débutants
├── css/
│   └── style.css       Feuille de style unique du site
├── js/
│   └── main.js         Menu, recherche, filtres, progression, navigation des leçons
└── images/             Illustrations et icônes SVG (cours, schémas, favicon)
```

## Lancer le projet

Aucune installation n'est nécessaire.

1. Téléchargez ou clonez le dossier.
2. Ouvrez `index.html` dans un navigateur.

Pour un fonctionnement plus proche d'un vrai site (notamment pour les vidéos intégrées), vous pouvez aussi servir le dossier avec un petit serveur local, par exemple l'extension **Live Server** de VS Code, ou :

```bash
python -m http.server 8000
```

puis ouvrir <http://localhost:8000>.

## Fonctionnement de la progression

La progression est sauvegardée dans le `localStorage` du navigateur, avec une clé par cours :

| Clé               | Contenu (exemple)             |
| ----------------- | ----------------------------- |
| `learnly-html`    | `["html-1", "html-2"]`        |
| `learnly-css`     | `["css-1"]`                   |
| `learnly-js`      | `[]`                          |

Chaque page de cours indique son identifiant via `data-course` sur la balise `<body>`, et chaque leçon est un `<article class="lesson">` dont l'`id` sert de clé. Sur l'accueil, chaque carte lit ces données grâce à `data-course` et `data-total`.

> En navigation privée, ou si le stockage est bloqué, le site fonctionne normalement mais la progression n'est pas conservée.

## Ajouter un cours

1. Dupliquez une page de cours existante (par exemple `cours-html.html`).
2. Changez `data-course` sur `<body>` (ex. `data-course="python"`) et les `id` des leçons (`python-1`, `python-2`, …).
3. Ajoutez une carte dans `index.html` avec `data-category` et un bloc `.card-progress` portant le bon `data-course` et `data-total`.

`js/main.js` détecte automatiquement les leçons et les cartes : aucune modification du script n'est nécessaire.

## Technologies

- HTML5 sémantique
- CSS3 (Flexbox, Grid, media queries)
- JavaScript (DOM, événements, `localStorage`, `history.replaceState`)

## Auteur

Projet réalisé dans le cadre d'un mini projet de développement web - © 2026 Learnly.
