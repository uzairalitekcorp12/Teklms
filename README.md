# TekLMS — Next.js V5

TekLMS V5 is a responsive Next.js learning management system with a public website, administrator workspace, student workspace, protected recorded lectures, live-class distribution, admissions, fees, communication, reporting, registration approval and email verification workflows.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

For a production check:

```bash
npm run build
npm run start
```

## V5 additions

- Public student signup flow with full name, email, guardian, requested class, requested course and password.
- Six-digit OTP verification sent through a server-side Resend route.
- Verified registration requests appear in a dedicated Administrator → Registrations module.
- Administrator notification-bell entries are created when a verified signup request is received/imported.
- Administrators can review student details, choose a class/section, tick one or more courses, approve access or reject the request.
- Approval creates the student record and student account token and prepares an activation email.
- Approval email contains an activation link that can be opened on the student device before sign-in.
- Registration-review email contains a signed import link so a verified request can be brought into the administrator browser without exposing password data.
- Approved student passwords are stored as SHA-256 hashes in the browser workspace state; the server checks the hash inside a signed account token before issuing a session cookie.
- Protected portal routes now perform server-side role checks and redirect users who do not have the correct signed session.
- Modal and drawer layers render through `document.body` portals, so card details remain fully visible even when opened after the page has been scrolled.
- Dark mode defaults to an intentionally restricted black/green/white palette. Light mode uses white, neutral grey and Tekcorp-style green.
- Additional typography, table and page-heading refinements improve readability across large and small displays.
- Sidebar navigation supports the additional admissions module and scrolls cleanly on shorter screens.
- Recorded lecture playback remains server-authenticated and AES-256-GCM encrypted at rest.

## Main structure

```text
app/
├── _shared/
│   ├── Drawer/
│   ├── MediaGuard/
│   ├── Modal/
│   ├── Navbar/
│   ├── SecureVideoPlayer/
│   ├── ThemeToggle/
│   ├── Toast/
│   └── WhatsAppFloat/
├── api/
│   ├── auth/
│   │   ├── login/
│   │   ├── approved-login/
│   │   └── signup/
│   ├── registrations/
│   ├── live-links/
│   └── secure-media/
├── data/
├── lib/
├── state/
├── main-website-components/
├── main-website-pages/
└── portal/
    ├── _components/
    ├── admin/
    │   └── RegistrationsView/
    └── student/
```

Every major UI component keeps its CSS beside the component for easier maintenance.

## Student registration flow

1. Student opens `/signup` and creates an account request.
2. TekLMS sends a six-digit OTP through `/api/auth/signup/request-otp`.
3. Student enters the OTP and TekLMS creates a signed registration token.
4. The browser saves the verified request and adds an administrator notification.
5. TekLMS can also email a signed `/registration-review` link to the configured Resend recipient. Opening that link on the administrator browser imports the verified request into Registrations.
6. Administrator chooses the class and course access, then approves or rejects the request.
7. An approved request creates the student record and a signed student-account token.
8. The approval email contains `/activate?token=...`; opening it stores the approved account on the student device.
9. The student signs in with the registered email and the password created during signup.

### Production persistence note

V5 deliberately avoids requiring a database so it can run immediately as a Next.js/Vercel project. Workspace records are browser-persisted, while signed links provide a practical cross-device handoff for registration and activation. For a real multi-user institution where every browser must see the same registrations, notifications, attendance and records in real time, connect the existing store/actions to a persistent service such as PostgreSQL/Supabase, Neon, Vercel Marketplace Redis or your own backend API. The UI and route structure are already separated so that migration does not require redesigning the portals.

## Resend setup without a domain

Copy the environment file:

```bash
cp .env.example .env.local
```

Then add your Resend API key:

```env
RESEND_API_KEY=re_xxxxxxxxx
RESEND_FROM=TekLMS <onboarding@resend.dev>
RESEND_TEST_RECIPIENT=m.uzair.tekcorp@gmail.com
```

When you are using `onboarding@resend.dev` without a verified sending domain, TekLMS sends OTP, registration-review, approval and live-class emails only to `RESEND_TEST_RECIPIENT`. The application still displays and stores every student's real/intended email, so you can test the full recipient-selection and approval workflow while all mail is collected in one inbox.

After you verify your own domain later, remove the test-recipient override and use an address on the verified domain as `RESEND_FROM`; the same route handlers can then deliver directly to the students' stored email addresses.

## Protected lectures

The lecture player uses:

- AES-256-GCM encrypted media stored in a server-only module.
- Signed TekLMS session cookie required by `/api/secure-media/[id]`.
- Server-side decryption only after authorization.
- `private, no-store, no-cache` response headers.
- Temporary browser Blob playback rather than exposing a normal public MP4 path.
- Custom controls with native download controls disabled.
- Picture-in-picture and remote playback restrictions.
- Right-click and drag blocking on protected media.
- Common save/source/developer-tool shortcut deterrence during playback.
- Dynamic student identity/time watermark.
- Focus-loss pause/privacy guard and print/capture privacy veil.

A normal browser application cannot guarantee that pixels can never be captured or that a technically capable user can never inspect network activity. The V5 protections are meaningful deterrence plus real encryption/authenticated delivery. High-value commercial course video should ultimately use DRM-capable streaming such as Widevine, FairPlay or PlayReady with short-lived playback authorization.

## Vercel deployment

1. Push the project to GitHub/GitLab/Bitbucket.
2. Import the repository into Vercel.
3. Add the environment variables from `.env.example` in Vercel Project Settings.
4. Use the included `npm run build` build command.
5. Set `NEXT_PUBLIC_APP_URL` to the deployed URL so email review/activation links use the correct host.

The included API route handlers are compatible with Vercel's Next.js runtime. No custom long-running server is required.
