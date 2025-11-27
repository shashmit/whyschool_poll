create table ideas (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  tagline text,
  votes int default 0,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table ideas enable row level security;

-- Create policy to allow public to insert ideas
create policy "Allow public insert" on ideas for insert with check (true);

-- Create policy to allow public to select ideas
create policy "Allow public select" on ideas for select using (true);

-- Create policy to allow public to update votes
create policy "Allow public update votes" on ideas for update using (true) with check (true);

-- RPC to increment vote
create or replace function increment_vote(row_id uuid)
returns void
language sql
security definer
as $$
  update ideas
  set votes = votes + 1
  where id = row_id;
$$;
