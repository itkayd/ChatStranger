# Arkand Care — Website

A static website for **Arkand Care Ltd** (arkandcare.co.uk): companionship and
help at home across Hackney, Ealing & Barnet. Plain HTML, CSS and a little
vanilla JavaScript — no build step, no server code, no database. It is designed
to be uploaded straight to Hostinger shared hosting.

## File structure

```
public_html/
├── index.html          Home
├── about.html          About — the Arkand story, values, honest CQC position
├── services.html       Services & pricing (incl. "coming soon" section)
├── why-arkand.html     Reasons to choose Arkand
├── contact.html        Phone, email, contact form, areas served
├── join-us.html        Careers / recruitment page
├── css/
│   └── style.css       All styling (brand colours as CSS variables at the top)
├── js/
│   └── main.js         Mobile menu toggle + footer year (site works without JS)
├── assets/
│   ├── logo-forest.svg Logo for light backgrounds
│   ├── logo-cream.svg  Logo for dark forest backgrounds
│   ├── favicon.svg     Browser-tab icon ("A" mark)
│   └── arkand-logo.png High-resolution logo (also used as apple-touch-icon)
├── sitemap.xml         For search engines
├── robots.txt          For search engines
└── README.md           This file (safe to delete from the live site)
```

The logo is also embedded inline (as SVG) in the header and footer of every
page, so it stays razor-sharp at any size with no extra downloads.

## Deploying to Hostinger

1. Log in to Hostinger and open **hPanel → Files → File Manager**.
2. Open the **`public_html`** folder (delete any placeholder files inside it,
   such as `default.php`).
3. Upload **everything in this folder** into `public_html`, keeping the folder
   structure exactly as it is (the `css/`, `js/` and `assets/` folders must sit
   alongside the HTML files).
   - Tip: zip this whole folder first, upload the zip, then use File Manager's
     **Extract** — it's much faster than uploading files one by one.
4. Visit https://arkandcare.co.uk — the site should be live immediately.
5. In hPanel, enable the free **SSL certificate** and turn on **Force HTTPS**
   if not already active.

No build tools, PHP, or databases are needed — these are plain static files.

## The contact form

The form on `contact.html` uses **[Formspree](https://formspree.io)**, a free
service that emails form submissions and works on static hosting. It is
**already connected** to this endpoint:

```
https://formspree.io/f/maqrqdvk
```

Submissions are emailed to the Formspree account owner and archived in the
Formspree dashboard (the free plan includes 50 submissions/month). After
deploying, send yourself a test message — the very first submission triggers
a one-time confirmation email from Formspree; click **Confirm** and you're
done.

To change where submissions are sent, log in to Formspree — no website edit
is needed. If you ever switch forms, update the `action` URL in
`contact.html` (look for the `CONTACT FORM` comment).

## Editing content

- **Text**: open the relevant `.html` file and edit the wording directly.
- **Colours**: all brand colours are CSS variables at the top of
  `css/style.css` (`--forest`, `--gold`, etc.).
- **Phone number**: appears as `tel:02080500095` links — if it ever changes,
  search-and-replace across all six HTML files.

## Compliance note (important)

Arkand Care is **not yet CQC registered**. The site is written to reflect
that: only companionship and home help are shown as available now, and
regulated services (personal care, dementia support, medication support,
night care, hospital discharge) appear **only** in the "Coming soon — subject
to CQC registration" section on the Services page. Please keep it that way
until registration is complete — claiming CQC registration before it is
granted is a criminal offence.
