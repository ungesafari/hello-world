# hello-world
This repository is for practicing the GitHub Flow
I am Hugo. Forever student, and haver of large ambition.

## Fysikkling

A personal, Duolingo-style study app with two courses: the Norwegian Fysikk 1 (LK20) curriculum, and the official basketball rules (NBBF's Norwegian translation of FIBA Official Basketball Rules 2026). Switch course with the course button at the top of the screen. It is a plain HTML/CSS/JavaScript web app with no build step, and it can be installed on the iPhone home screen and works offline.

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

Number exercises have a calculator button (angles in degrees, EXP for powers of ten). Underlined words and symbols can be tapped for a short definition. Each skill has a strength that fades over time; faded skills show as cracked on the path, and "Styrk svake emner" builds a review lesson from your weakest skills, favouring questions you have answered wrong before.

### Structure

`index.html` is the page shell, `css/style.css` holds the styling, `js/app.js` contains the game logic (path, lessons, hearts, streak, XP, leagues, quests, achievements), and `js/course-fysikk1.js` and `js/course-basket.js` hold the course content, including each course's glossary. New questions or units are added in the course file; the format is documented at the top of it.
