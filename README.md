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
| House of Nisaba (appointed) | Review, place, and sort Considerations; add trigger indicators |
| Wisdom in the chair of Nisaba | Appoint and end House of Nisaba appointments, each with an end date. Cannot hold that authority herself. |

The database enforces these rules (`supabase/schema.sql`), not just the pages.

## One-time setup

### 1. Supabase
1. Create a free project at supabase.com.
2. **SQL Editor → New query**: paste all of `supabase/schema.sql` and run it.
3. **Authentication → URL Configuration**: set *Site URL* to your Vercel address, and add `https://YOUR-SITE/auth/confirm` (and `http://localhost:3000/auth/confirm`) to *Redirect URLs*.
4. **Project Settings → API**: copy the project URL and the publishable (anon) key.

### 2. Run locally
Copy `.env.example` to `.env.local`, fill in the two values, then:

```
npm install
npm run dev
```

Open http://localhost:3000.

### 3. Seat the first Wisdom of Nisaba
After she creates an account, run in the SQL Editor (use her display name):

```sql
update public.chairs
set wisdom = (select id from public.profiles where display_name = 'HER NAME'),
    seated_at = now(),
    seat_ends = now() + interval '1 year'
where house = 'nisaba';
```

She then appoints House members from **Account → Chair of Nisaba**. Seats are changed only this way, because the Council decides who sits in a chair.

### 4. Deploy
1. Push this folder to a new GitHub repository.
2. In Vercel: **Add New → Project**, import the repo, and add the two environment variables.
3. Deploy. Every push to `main` redeploys.
