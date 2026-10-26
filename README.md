# Project 2 - Tele-nutrition Gateway & Platform (FINALS)

Next.js full-stack MVP: Consumer login -> Meal logging -> Provider charting (eNCPT/ADIME) -> Appointment + Jitsi video session.

## Run it
```bash
npm install
cp .env.example .env.local     # set SESSION_SECRET
npm run dev                    # http://localhost:3000
```
Demo logins (password `demo123`): `consumer@demo.com`, `dietitian@demo.com`

## Step-by-step build order (~120 min)
1. **Setup (10)** - `npm install`, run dev server, confirm login page loads.
2. **Data + auth (15)** - `lib/db.js` (JSON store + seeded users), `lib/auth.js` (signed cookie session), `/api/login`, `/api/logout`.
3. **Meal logging (15)** - `/meals` + `/api/meals` (consumer only).
4. **Charting (20)** - reuse Project 1's terminology file (`data/ncpt-sample.json`) and `lib/ncpt.js`; then `/provider`, `/provider/patients/[id]`, `/api/notes` (dietitian only).
5. **Scheduling (15)** - `/appointments` + `/api/appointments` (double-booking check, random room secret).
6. **Video (15)** - `components/JitsiRoom.js` + `/session/[id]` (access limited to the two participants).
7. **End-to-end test (20)** - checklist below.
8. **Deploy (10)** - see below.

## End-to-end test checklist
- [ ] Wrong password is rejected; consumer login works
- [ ] Log 3 meals -> they appear in the list
- [ ] Book an appointment; booking the same slot again is rejected
- [ ] Log out, log in as dietitian -> patient shows meal count
- [ ] Open patient -> meals visible -> save an ADIME note -> appears under "Previous notes"
- [ ] Consumer visiting `/provider` is redirected away
- [ ] Both users click "Join video session" (two browsers, or one incognito) and see/hear each other

## Deploy (pick one)
- **Render (easiest)**: push to GitHub -> New Web Service -> Build `npm install && npm run build`, Start `npm start`, env var `SESSION_SECRET`. Data resets on redeploy.
- **Vercel**: import repo, set `SESSION_SECRET`. Data lives in `/tmp` and resets - fine for a demo; swap `lib/db.js` for MongoDB Atlas/Postgres for anything real.
Camera/mic need HTTPS (both hosts provide it; localhost also works).

## Known MVP limits
JSON-file storage, single dietitian, demo auth, public Jitsi server. Not HIPAA-ready - use synthetic data only.

## Notes validation
Charting notes are validated against the JSON Schemas in `schemas/` (same as Project 1) before saving. If you edit the terminology file, update the enums in `schemas/*.json`.
