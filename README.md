# hello-world
This repository is for practicing the GitHub Flow
I am Hugo. Forever student, and haver of large ambition.

## Fysikkling

A personal, Duolingo-style study app with three courses: Matematikk R1 (chapter 1 so far, following the class progress plan), the Norwegian Fysikk 1 (LK20) curriculum, and the official basketball rules (NBBF's Norwegian translation of FIBA Official Basketball Rules 2026). Switch course with the course button at the top of the screen. It is a plain HTML/CSS/JavaScript web app with no build step, and it can be installed on the iPhone home screen and works offline.

### Publish with GitHub Pages

1. Open the repository on GitHub, go to Settings, then Pages.
2. Under "Build and deployment", choose "Deploy from a branch", pick the branch (for example `main` after merging) and the `/ (root)` folder, and save.
3. After a minute the app is available at `https://<username>.github.io/hello-world/`.

GitHub Pages on a free account requires the repository to be public. Your progress is stored only on your own devices, never in the repository.

### Install on iPhone

Open the link in Safari, tap the share button, then "Add to Home Screen". On Windows, open the link in Edge or Chrome and use "Install app" in the address bar, or just bookmark it.

### Moving progress between devices

Progress is saved locally on each device. Go to Profil, then "Kopier kode" on one device, and "Lim inn kode" on the other.

### Study features

The first lesson of every skill opens with cards that introduce its new terms, symbols and formulas, followed by a matching exercise on them. Derivations (for example of the seven motion formulas from the teacher's slides) are practised as "put the steps in order" exercises. The basketball course follows a practical order: basic play first, court measurements last, with NBBF's U13–U15 adaptations as their own unit. Number exercises have a calculator button (angles in degrees, EXP for powers of ten). Underlined words and symbols can be tapped for a short definition. Each skill has a strength that fades over time; faded skills show as cracked on the path, and "Styrk svake emner" builds a review lesson from your weakest skills, favouring questions you have answered wrong before.

### Matematikk R1

Only tasks listed in the progress plan (plus the chapter test and the class true/false quiz) are included, each labelled with its textbook number. Tasks are turned into answer checks, step-ordering for proofs and multiple choice, so you do not have to redo every calculation by hand. Tasks marked "uten hjelpemidler" hide the calculator. Skills you have already solved by hand can be marked "Gjort for hånd" and then come back in review. E1/E2 extra tasks are optional and do not block the path. The chapter test must be passed with at most two mistakes before you can continue.

### Structure

`index.html` is the page shell, `css/style.css` holds the styling, `js/app.js` contains the game logic (path, lessons, hearts, streak, XP, leagues, quests, achievements), and `js/course-fysikk1.js`, `js/course-basket.js` and `js/course-r1.js` hold the course content, including each course's glossary. New questions or units are added in the course file; the format is documented at the top of it.
