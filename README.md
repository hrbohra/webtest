# Bold Biker Store — Deployable Static Site (Vercel + Stripe)

This project is ready to deploy to Vercel. **Do not** commit your Stripe secret key to the repo.
- Add `STRIPE_SECRET_KEY` as an environment variable in your Vercel project (value: sk_test_... or sk_live_...).
- The public Stripe key used in the frontend is: `pk_test_51SFVD4D6RhAN7ajEoJq8QZKQLx8TWeE5rvx5YQOSX5QvC6vjhNzwfglCK4qqt0Mpm6CnnML9E6QpF32A8b9qB2Xo00GVguqNe4` (safe to include in frontend).
- Images are placeholders in `public/images/` — replace with real product photos.

Deploy steps:
1. Push this repository to GitHub (or connect Git provider).
2. Create a new project on Vercel and import the repo.
3. In Vercel project settings, add Environment Variable `STRIPE_SECRET_KEY` with your secret key.
4. Deploy; test with Stripe test cards (e.g. 4242 4242 4242 4242).
