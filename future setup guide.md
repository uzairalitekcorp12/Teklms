# TekLMS V6 setup and testing

## 1. Create the local environment file

Copy `.env.example` to `.env.local`. Keep all API keys in `.env.local`; never commit that file and never prefix secrets with `NEXT_PUBLIC_`.

## 2. Understand and configure Resend

- `RESEND_API_KEY`: the secret key created in the Resend dashboard. Email is disabled while it is empty.
- `RESEND_FROM`: the visible sender name and sender address. `onboarding@resend.dev` is Resend's testing sender.
- `RESEND_TEST_RECIPIENT`: when set, TekLMS sends tests only to this inbox instead of emailing students. Keep `m.uzair.tekcorp@gmail.com` here during testing.
- `RESEND_ADMIN_RECIPIENT`: the real administrator inbox for new-registration review links after direct delivery is enabled.

Testing setup:

```env
RESEND_API_KEY=re_your_key_here
RESEND_FROM="TekLMS <onboarding@resend.dev>"
RESEND_TEST_RECIPIENT=m.uzair.tekcorp@gmail.com
RESEND_ADMIN_RECIPIENT=admin@example.com
```

Restart TekLMS after changing environment variables. Sign in as administrator, open **Settings → Notifications**, and confirm that “Resend email: connected” appears. Use **Communication → Email**, select a small audience and send a test. One test message goes to the test inbox and states the intended audience size.

For real student delivery, verify your own domain in Resend, use an address on that domain, set the administrator inbox, and leave the test recipient empty:

```env
RESEND_FROM="TekLMS <notifications@yourdomain.com>"
RESEND_TEST_RECIPIENT=
RESEND_ADMIN_RECIPIENT=your-admin@yourdomain.com
```

## 3. Configure WhatsApp sending from +92 300 1234567

`NEXT_PUBLIC_WHATSAPP_NUMBER=923001234567` displays the business number and is used for public/manual chat links. A number alone cannot authorize automatic messages.

For automatic delivery from that registered business number, create a Meta Business app with WhatsApp Cloud API and add these server-only values:

```env
NEXT_PUBLIC_WHATSAPP_NUMBER=923001234567
WHATSAPP_ACCESS_TOKEN=your_permanent_system_user_token
WHATSAPP_PHONE_NUMBER_ID=the_phone_number_id_from_meta
WHATSAPP_GRAPH_API_VERSION=v23.0
WHATSAPP_TEMPLATE_NAME=teklms_student_notice
WHATSAPP_TEMPLATE_LANGUAGE=en_US
```

Use the Graph API version shown by your Meta app if it differs. The recommended approved template should contain one body variable; TekLMS supplies the composed message as that variable. Without a template, free-form Cloud API messages normally work only in an active customer-service conversation window.

Restart TekLMS, then open **Settings → Notifications** and confirm “WhatsApp Cloud API: connected.” In **Communication**, choose WhatsApp, choose **All**, **Course**, **Class**, or **Course + class**, review the exact recipients, and send. If Cloud API is not configured, each recipient row still provides a manual WhatsApp link; it opens WhatsApp Web but sends from whichever account is signed in there.

## 4. Audience rules

- **All** selects every registered student that has a valid address for the chosen channel.
- **Course** selects only students whose profile includes that course code.
- **Class** selects the chosen class and optional section.
- **Course + class** uses the intersection, so a student must match both.
- Live Sessions also supports course + class + section and still lets the administrator uncheck individual students.

## 5. Add the Amazon lecture

Open **Administrator → Lectures → Add Lecture**. Paste an HTTPS Amazon S3 object URL or CloudFront URL, choose **All registered students** or **Only students enrolled in this course**, and publish it. Newly added Amazon-linked lectures are prioritized in the student's Continue Watching card.

For reliable browser playback, return the correct video content type (for example `video/mp4`) and support HTTP range requests. Prefer short-lived signed CloudFront URLs for private content. TekLMS hides download controls, blocks common save actions inside the player, pauses on focus loss and overlays the student identity; no browser-only technique can make a video impossible to capture.

## 6. Appearance check

Open **Administrator → Settings → Appearance**. Dark/Light, Glass/Solid, Gradient headings and Comfortable/Compact are live previews. Click **Save Changes**, reload the portal and confirm the choice remains. The active palette is black/white/teal with no blue course or chart accents.

## 7. Start and verify

```powershell
npm install
npm run dev
```

Open `http://localhost:3000`, test both themes, then check the administrator and student portals on desktop and a narrow phone viewport. Before deployment, run:

```powershell
npm run check
```
