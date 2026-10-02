# hello-world
This repository is for practicing the GitHub Flow
I am Hugo. Forever student, and haver of large ambition.

## HugoLingo

HugoLingo is a personal, Duolingo-style study app with three courses: Matematikk R1 (chapter 1 so far, following the class progress plan), the Norwegian Fysikk 1 (LK20) curriculum, and the official basketball rules (NBBF's Norwegian translation of FIBA Official Basketball Rules 2026). Switch course with the course button at the top of the screen. It is a plain HTML/CSS/JavaScript web app with no build step, and it can be installed on the iPhone home screen and works offline.

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

New terms, symbols and formulas are introduced gradually: each node on the path brings at most three new ones. Every new card is followed straight away by a question on that exact term, and the terms come back as recall questions (name the formula, pick the formula, complete the formula) in the following lessons. Later lessons also mix in a little material from earlier nodes. Fractions are shown with a horizontal fraction bar everywhere, and formulas that belong on separate lines are shown on separate lines.

Every topic can be started directly from the path without testing your way there. Progress percentages (per unit and per course) only count lessons you have actually completed, so topics you have not been through stay at 0 %.

The Repetisjon tab offers a mixed review built from two or three related topics (a weak unit and the unit before it), worked through one topic at a time; a drill of all formulas and terms you have learned; the questions you have answered wrong; and a review of any single unit. Faded skills show as cracked on the path, and "Styrk svake emner" (also used to earn hearts) builds a review lesson from your three weakest skills, weakest first, one topic at a time, choosing the most overdue questions and formulas within each.

Repetition is scheduled per question and per formula with an Anki-style SM-2 algorithm. A correct answer on a new card schedules it for 1 day; each later correct review multiplies the interval by the card's ease (starting at 2.5, with partial credit for early reviews and a bonus for late ones). A wrong answer lowers the ease by 0.2, brings the card back after 10 minutes, and once relearned it restarts at half its old interval. A topic's strength is the average predicted recall of its cards (90 % when a card is due), and a topic counts as weak below 80 %.

You have five hearts; a wrong answer in a lesson costs one, and one heart comes back every five minutes.

Any question can be bookmarked with the button next to the question type. A bookmark can mark the question for extra repetition (it then comes up more often in lessons and in Repetisjon, and the bookmarked questions can be practised on their own), and it can carry feedback on what should be improved, using quick categories such as "Feil fasit" or "Uklar oppgavetekst" plus free text. All bookmarks are listed in the Repetisjon tab, where "Kopier tilbakemeldinger" copies the feedback as plain text with the course, topic, task number, question, options and the answer the app expects, ready to paste into a message.

The Liga tab is a leaderboard of your own days ranked by XP, switchable between this week, this month and this year. Today is always shown with its rank. Month and year show the top 10 days plus today, with a "Vis alle" button for the full list; days with 0 XP share a single last place.

Derivations (for example of the seven motion formulas from the teacher's slides) are practised as "put the steps in order" exercises. The basketball course follows a practical order: basic play first, court measurements last, with NBBF's U13–U15 adaptations as their own unit. Number exercises have a calculator button (angles in degrees, EXP for powers of ten). Underlined words and symbols can be tapped for a short definition.

### Matematikk R1

Only tasks listed in the progress plan (plus the chapter test and the class true/false quiz) are included, each labelled with its textbook number. Each chapter section alternates between small formula nodes and the textbook tasks that use those formulas, with Lekser at the end of the section as mixed practice. Tasks are turned into answer checks, step-ordering for proofs and multiple choice, so you do not have to redo every calculation by hand. Tasks marked "uten hjelpemidler" hide the calculator. Task nodes you have already solved by hand can be marked "Gjort for hånd" and then come back in review. E1/E2 extra tasks are optional and do not block the path. Formula nodes cannot be skipped this way, since the formulas still need to be learned. The chapter test must be passed with at most two mistakes before you can continue.

### Structure

`index.html` is the page shell, `css/style.css` holds the styling, `js/app.js` contains the game logic (path, lessons, hearts, streak, XP, leagues, quests, achievements), and `js/course-fysikk1.js`, `js/course-basket.js` and `js/course-r1.js` hold the course content, including each course's glossary. New questions or units are added in the course file; the format is documented at the top of it.
