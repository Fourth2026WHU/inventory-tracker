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

## How it works

The website is hosted on GitHub Pages, and the data and logins are in a free [Supabase](https://supabase.com) project. Every device sees the same data. An open app shows changes from other devices within a minute, or as soon as you switch back to it.

## Who can see what

| | Full account | Limited account |
| --- | --- | --- |
| Home totals, Stock list, Needs attention | Yes | Yes |
| Record stock IN and OUT | Yes | Yes |
| Add, edit and delete products | Yes | No |
| History, Insights, Recent activity, notes | Yes | No |
| Settings, export, sample data, delete all | Yes | No |

These rules are enforced by the database, not by the website. The rules are in [supabase/schema.sql](supabase/schema.sql). A limited account gets no history even when it calls the database directly from the browser console. A login with no row in `profiles` gets nothing at all.

## Setup

You only need to do this once.

### 1. Create the database

1. Create a free account at [supabase.com](https://supabase.com) and a new project. Keep the database password somewhere safe. It is not used by this app.
2. If the shop is not in China time, change `Asia/Shanghai` near the top of [supabase/schema.sql](supabase/schema.sql). It decides which day a record belongs to.
3. Open **SQL Editor**, paste all of that file and press **Run**.

### 2. Turn off public sign-up

Open **Authentication**, then **Sign In / Providers**, and turn off **Allow new users to sign up**. Anyone could otherwise make a login. It would see nothing, but there is no reason to allow it.

### 3. Connect the website

Open **Project Settings**, then **API Keys**. Put the Project URL and the **publishable** key (`sb_publishable_...`) in [config.js](config.js).

Both are safe in a public repo. The **secret** key (`sb_secret_...` or `service_role`) ignores all the rules. Never put it in this repo or in any file on the website.

### 4. Create the accounts

For each person:

1. Open **Authentication**, then **Users**, then **Add user**, then **Create new user**.
2. For the email, use the username followed by `@example.com`, for example `owner@example.com`. No email is sent to this address. `example.com` is reserved for examples, so nobody can own it or receive mail there.
3. Choose a strong password and turn on **Auto Confirm User**.

Then give the accounts their access in the **SQL Editor**. A login does nothing until it has a row here:

```sql
insert into public.profiles (user_id, username, name, access)
select id, split_part(email, '@', 1), initcap(split_part(email, '@', 1)), access
from auth.users
join (values
  ('owner', 'full'),
  ('mom', 'full'),
  ('dad', 'full'),
  ('staff', 'limited')
) as people (username, access)
on email = people.username || '@example.com';
```

People log in with the username only, for example `owner`.

### 5. Publish

Commit `config.js` and merge to `main`. GitHub Pages then publishes the site.

### 6. Move your existing data

Log in with a full account in the browser that has your old data, and open **Settings**. **Move data from this browser** appears if that browser still has any. It replaces everything in the database, so do it before anyone records new stock.

## Changing accounts

Run these in the **SQL Editor**.

Change someone's access:

```sql
update public.profiles set access = 'full' where username = 'staff';
```

Remove someone's access, keeping their login:

```sql
delete from public.profiles where username = 'staff';
```

To change a password, open the user in **Authentication**, then **Users**. Users cannot change their own access from the app.

## Good to know

- Free projects are paused after one week with no activity. The data is kept, but the app shows "Could not reach the database" until you press **Resume** in the Supabase dashboard.
- Use the CSV export in Settings to keep your own backups. The free plan has no automatic backups you can restore.
- The app's login lasts until the browser tab is closed.
- To run it on your computer, open `index.html` in a browser. It uses the same database as the live site.
