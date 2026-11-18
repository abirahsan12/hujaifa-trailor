হুজাইফা পাঞ্জাবী টেইলার্স: Vercel + GitHub + Supabase সেটআপ

ফোল্ডার কাঠামো
- ওয়েব অ্যাপ (GitHub repository-তে এই ফাইলগুলো আপলোড করুন):
  index.html, config.js, sw.js, manifest.json, vercel.json, icon-*.png, favicon-*.png, icon.svg, README.md, supabase-setup.sql, .gitignore, supabase/functions/sync/index.ts
- _apk-project: APK তৈরির প্রজেক্ট। এটি আলাদা GitHub repository-তে আপলোড করবেন (.github সহ)।

ধাপ ১ (Supabase)
1. SQL Editor-এ supabase-setup.sql পুরোটা চালান।
2. Edge Functions-এ একটিই function রাখুন, নাম sync। supabase/functions/sync/index.ts-এর কোড বসিয়ে Deploy করুন। Verify JWT বন্ধ রাখুন।

ধাপ ২ (GitHub)
1. hujaifa-tailor repository-তে এই ওয়েব ফাইলগুলো (উপরের তালিকা) আপলোড করুন।
2. config.js-এ নিম্নলিখিত মানগুলো থাকতে হবে:
   window.SUPABASE_URL = "https://uukvhwlettkjijltkdbj.supabase.co";
   window.SUPABASE_ANON_KEY = "sb_publishable_fwTfMg8tYrVn1RTmjTSdIg_bP3WINS0";

ধাপ ৩ (Vercel)
1. vercel.com-এ Add New → Project → hujaifa-tailor → Import।
2. Framework: Other; Build ও Output খালি। Deploy।

ধাপ ৪ (পরীক্ষা)
1. Vercel-এর ঠিকানা খুলুন, PIN 258963 দিন।
2. একটি কাস্টমার যোগ করে Supabase → Table Editor → records-এ দেখুন।
