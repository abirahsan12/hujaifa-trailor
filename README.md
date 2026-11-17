# হুজাইফা পাঞ্জাবী টেইলার্স: ওয়েব অ্যাপ

## কীভাবে কাজ করে
- অ্যাপ খুললে PIN চায়। সঠিক PIN দিলে ক্লাউড থেকে তথ্য আসে।
- প্রতিটি পরিবর্তন Supabase-এ সেভ হয়। ইন্টারনেট না থাকলে ফোনে জমে থাকে এবং পরে নিজে থেকে পাঠায়।
- প্রভৃতি মেনু → "অ্যাপ লক করুন": ফোনের কপি মুছে আবার PIN চায়।
- ১০ বার ভুল PIN দিলে অ্যাপ লক হয়। SQL Editor-এ `update app_config set fails = 0 where id = 1;` চালালে আবার খোলে।

## ফাইল
- `index.html`: অ্যাপ
- `config.js`: Supabase URL ও Publishable key (এখানে কোনো secret key নয়)
- `supabase-setup.sql`: টেবিল ও PIN হ্যাশ (Supabase SQL Editor-এ একবার চালান)
- `supabase/functions/sync/index.ts`: PIN যাচাই ও ডাটা পড়া/লেখার Edge Function (Supabase ড্যাশবোর্ডে deploy করুন, Verify JWT বন্ধ রাখুন)
- `manifest.json`, `sw.js`, `icon-*.png`, `favicon-*.png`: হোম স্ক্রিন আইকন ও অফলাইন ক্যাশ

## সেটআপের ক্রম
1. Supabase প্রজেক্টে `supabase-setup.sql` চালান।
2. Edge Functions-এ `sync` নামে function বানিয়ে `supabase/functions/sync/index.ts` বসান, Verify JWT বন্ধ করে deploy করুন।
3. `config.js`-এ Publishable key বসান।
4. Netlify বা Vercel-এ এই ফোল্ডার আপলোড করুন।
