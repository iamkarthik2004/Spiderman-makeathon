# Spider-Man: Brand New Day

A cinematic, interactive fan-made promotional experience for Spider-Man: Brand New Day. Built with vanilla HTML, CSS, and JavaScript with GSAP, Three.js, and Lenis smooth scrolling.

**Live Demo:** [View Site](https://spiderman-makeathon.vercel.app/)

![Spider-Man: Brand New Day](assets/images/hero/spiderman.png)

---

## Features

### Hero Section
- Animated loading screen with spinning rings and progress bar
- Dramatic **split-letter entrance animation** — each character of "SPIDER-MAN" flies up with 3D rotation
- Three.js particle background with floating web lines
- Parallax scrolling on stars, moon, clouds, and skyline
- Floating Spider-Man hero image with glow effects

### Web Swing Navigation
- Click any navbar item — Spider-Man **shoots a web and swings** to the target section
- Animated SVG web line + Spider-Man figure follows the swing path
- Smooth Lenis scroll to destination during the swing

### Suit Showcase
- 4 interactive suit cards with **3D flip** on hover
- Stats bars (Defense, Agility, Web Power) with scroll-triggered fill animations
- Suits: Classic, Iron Spider, Symbiote, No Way Home

### Villains Gallery
- Villain cards with **broken glass** hover effect (crack lines animate on enter)
- Threat level badges and stat bars
- Villains: Green Goblin, Doctor Octopus, Venom, Electro

### Timeline
- Scroll-driven vertical timeline with animated line fill
- 7 milestones from 2002 to 2026
- Cards reveal on scroll with staggered animations

### Comic Gallery
- 6-image grid with **flip card** effect — front shows image, back shows quote
- Hover scale animations

### Oscorp Lab Terminal
- Fake CRT terminal with **scanline overlay** and green phosphor text
- Boot sequence animation on scroll into view
- Commands: `help`, `suits`, `villains`, `oscorp`, `venom`, `clear`, `logout`
- Command history with arrow key navigation
- Typing animation for all output

### Contact Section
- Social links (GitHub, LinkedIn, Instagram) with hover animations

### Footer
- Hanging spider animation (dangles on scroll)
- Transparent white web net background overlay
- Social links, navigation, and credits

---

## Interactive Features

| Feature | Trigger |
|---------|---------|
| Web Swing Navigation | Click any navbar link |
| Custom Cursor | Mouse movement (desktop) |
| Web Shot Effect | Click anywhere |
| Day/Night Mode | Theme toggle button |
| Sound Toggle | Sound button (bg music, SFX) |
| Rain Effect | Rain toggle button |
| Lightning | Auto-triggers during rain |
| Spider Swing | Press `S` key |
| Symbiote Mode | Konami Code: `↑↑↓↓←→←→BA` |
| Terminal | Type commands in Oscorp Lab |

---

## Tech Stack

- **HTML5** — Semantic markup
- **CSS3** — Custom properties, Grid, Flexbox, animations, glassmorphism
- **JavaScript (ES5+)** — Vanilla, no frameworks
- **GSAP 3.12** — Animations, ScrollTrigger, ScrollToPlugin
- **Lenis 1.0** — Smooth scrolling
- **Google Fonts** — Bebas Neue, Orbitron, Inter, Bangers

---

## Project Structure

```
spidermaan/
├── index.html
├── css/
│   └── style.css            (2133 lines)
├── js/
│   └── main.js              (1177 lines)
└── assets/
    ├── images/
    │   ├── hero/
    │   │   └── spiderman.png
    │   ├── suits/
    │   │   ├── classic.png
    │   │   ├── iron-spider.png
    │   │   ├── no-way-home.png
    │   │   └── symbiote.png
    │   ├── villians/
    │   │   ├── golbin.png
    │   │   ├── octopus.png
    │   │   ├── venom.png
    │   │   └── electro.png
    │   ├── gallery/
    │   │   ├── gallery1.png - gallery6.png
    │   ├── footer-net.png
    │   └── loader-logo.png
    └── sounds/
        ├── bg-music.mp3
        ├── lightning.mp3
        └── web-shoot.mp3
```

---

## Responsive Breakpoints

| Breakpoint | Adjustments |
|------------|-------------|
| Desktop (> 900px) | Full 4-column grids, large hero image |
| Tablet (≤ 900px) | 2-column grids, hidden navbar links, hamburger menu |
| Mobile (≤ 600px) | Single column, smaller fonts, compact terminal |

---

## Getting Started

1. Clone the repo:
   ```bash
   git clone https://github.com/iamkarthik2004/Spiderman-makeathon.git
   ```

2. Open `index.html` in a browser.

No build tools or dependencies required — everything runs from CDN links.

---

## Author

**Karthik Krishnan** — [GitHub](https://github.com/iamkarthik2004) · [LinkedIn](https://www.linkedin.com/in/karthik-krishnan-775682251) · [Instagram](https://www.instagram.com/karthik_kk708)

---

## Disclaimer

Fan project — not affiliated with Marvel or Disney.
