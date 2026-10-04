# Oracle platform

The website and the crowd-sourced Books of Considerations.

- **Next.js** site, hosted on **Vercel** and deployed from **GitHub**
- **Supabase** for member accounts and the Considerations database
- The site name is set in `lib/config.ts`

## Books

Each Aspiration and each Tenet has its own book, and the Quilt of the Considerate holds everything else (13 books). Each book has three parts: unlabeled, **Glimmers**, and **Triggers**. Triggers show their indicators and stay folded closed until the reader opens them.

## Roles

| Role | Can do |
|---|---|
| Visitor | Read every book |
| Member | Offer Considerations, see their own status |
| Admin (appointed by the House of Nisaba or the Oracle of the Hallowed Tree) | Equal access for now: review, place, and sort Considerations; add trigger indicators. Tools at `/admin`. |
| Wisdom seated in a House's chair | Appoint and end that House's admins, each with an end date (`/chair/<house>`). A seated Wisdom of any admin House cannot be an admin. |

The database enforces these rules (`supabase/schema.sql`), not just the pages.

## One-time setup

### 1. Supabase
1. Create a free project at supabase.com.
2. **SQL Editor → New query**: paste all of `supabase/setup.sql` and run it (it is `schema.sql` and `glossary.sql` together).
3. **Authentication → URL Configuration**: set *Site URL* to your Vercel address, and add `https://YOUR-SITE/auth/confirm` (and `http://localhost:3000/auth/confirm`) to *Redirect URLs*.
4. **Project Settings → API**: copy the project URL and the publishable (anon) key.

### 2. Run locally
Copy `.env.example` to `.env.local`, fill in the two values, then:

```
npm install
npm run dev
```

Open http://localhost:3000.

### 3. Seat the Wisdoms
There are two chairs: `nisaba` (House of Nisaba) and `oht` (Oracle of the Hallowed Tree). After a Wisdom creates an account, run in the SQL Editor (use her display name and the house):

```sql
update public.chairs
set wisdom = (select id from public.profiles where display_name = 'HER NAME'),
    seated_at = now(),
    seat_ends = now() + interval '1 year'
where house = 'nisaba';  -- or 'oht'
```

She then appoints her House's admins from **Account → Chair of …**. Seats are changed only this way, because the Council decides who sits in a chair.

### 4. Deploy
1. Push this folder to a new GitHub repository.
2. In Vercel: **Add New → Project**, import the repo, and add the two environment variables.
3. Deploy. Every push to `main` redeploys.

## Updating the glossary

Save the new version of the glossary .docx, then run:

```
python scripts/import_glossary.py "C:\path	o\Glossary.docx"
```

Italic text in the document is left out. Re-run `supabase/glossary.sql` in Supabase afterward.
