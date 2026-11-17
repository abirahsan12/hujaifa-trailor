-- Supabase SQL Editor-এ এটি একবার চালান (একটি একটি করে নয়, পুরোটা একসাথে)
drop table if exists public.records;

create table public.records (
  rid text primary key,
  data jsonb not null,
  updated_at timestamptz default now()
);
alter table public.records enable row level security;

create table if not exists public.app_config (
  id int primary key default 1,
  pin_hash text not null,
  fails int not null default 0
);
alter table public.app_config enable row level security;

insert into public.app_config (id, pin_hash, fails) values (1, '8d2295c97779a291de959ca1073f857dfd0c6f3bac8f4121c4a012b961e59c98', 0)
on conflict (id) do update set pin_hash = excluded.pin_hash, fails = 0;
