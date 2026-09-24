# Odyssey Web

This is a companion website for an alternate reality game. Hosted on Netlify, with player submissions stored in Supabase (Postgres).

## Features

- **Case file submission** (`/case-file/`): players file their final report at the end of the game. Entries are saved to a Supabase database protected by Row Level Security, so the public site can add case files but cannot read, edit or delete them.
- **Case files archive**: in progress.

## Structure

```
case-file/index.html   Case file submission form
js/config.js           Supabase project URL and publishable key
supabase/setup.sql     Database table and security policies
```

## Security notes

The Supabase publishable key in `js/config.js` is designed to be public. Access is controlled by the Row Level Security policies in `supabase/setup.sql`. Submitted files are only shown publicly if the player opts in and the designer approves them.