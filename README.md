# Dinner at Quince Lakehouse

**[View Live Site](https://mglass222.github.io/Dinner-at-Quince/)**

Event signup website for a dinner at Quince Lakehouse in Austin, TX on **Tuesday, March 3, 2026**.

Guests can RSVP, specify party size, list dietary restrictions, and see who else is attending. Data is stored in Google Sheets (linked to an existing Google Form) with a Google Apps Script backend.

## Architecture

```
GitHub Pages (Static Site)  <-->  Google Apps Script (API)  <-->  Google Sheet (Database)
     index.html                     doPost() / doGet()            Form Responses
     style.css
     script.js
```

## Google Sheet Columns (from Google Form)

| A | B | C | D |
|---|---|---|---|
| Timestamp | Names of those attending | Number in party | Dietary restrictions |

## Setup

### 1. Deploy the Apps Script Backend

1. Open the Google Sheet linked to your Google Form
2. Go to **Extensions > Apps Script**
3. Delete any default code in the editor
4. Copy the contents of `apps-script.js` from this repo and paste it in
5. Click **Deploy > New deployment**
6. Select type: **Web app**
7. Set **Execute as**: `Me`
8. Set **Who has access**: `Anyone`
9. Click **Deploy** and authorize when prompted
10. Copy the **Web app URL** from the deployment

### 2. Configure the Frontend

1. Open `script.js`
2. Replace `YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL` with the URL you copied:
   ```js
   const API_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
   ```

### 3. Deploy to GitHub Pages

1. Push this repo to GitHub
2. Go to **Settings > Pages**
3. Under **Source**, select the branch (e.g., `main`) and root `/`
4. Save — your site will be live at `https://yourusername.github.io/repo-name/`

## Local Testing

Open `index.html` directly in a browser to preview the layout and animations. Form submission requires the Apps Script backend to be deployed.

## Features

- Responsive "Keep Austin Weird" themed design
- SVG lakehouse illustration with animated water reflections
- Animated bat silhouettes and psychedelic wave backgrounds
- RSVP form with validation
- Live attendee list with total guest count
- Works alongside your existing Google Form — both write to the same sheet

## Files

| File | Description |
|------|-------------|
| `index.html` | Main page structure with inline SVG art |
| `style.css` | Styling, animations, responsive layout |
| `script.js` | Form handling, API calls, attendee list |
| `apps-script.js` | Google Apps Script backend (deploy in Google) |
