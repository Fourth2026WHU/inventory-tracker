# Inventory Tracker

A simple stock tracking web app that works on a phone or a computer. It is plain HTML, CSS and JavaScript, with nothing to install or build.

## Features

- Log in before using the app, with full and limited accounts
- Add, edit and delete materials and finished products
- Record stock IN and OUT for many products at once, with an optional note and a confirm step
- Low stock and out of stock warnings
- History page with a graph and a log table
- Graphs by day, week, month and year
- Export the stock list and full history as CSV for Excel
- Sample data to try the app

## Run it

Open `index.html` in a browser.

## Login

The login is a mock for showing the app. The accounts and passwords are in `app.js`, so anyone can read them, and limited accounts are only hidden from the pages in the browser. Do not use it to protect private data.

## Where the data is saved

Data is saved in the browser on each device (localStorage). It is not uploaded anywhere and is not shared between devices. Clearing the browser's site data deletes it, so use the CSV export to keep a backup.
