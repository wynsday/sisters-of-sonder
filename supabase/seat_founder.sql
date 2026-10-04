-- Make wynsday the founder until 2027-04-04 and seat her in both chairs.
insert into public.founders (member, until)
select id, '2027-04-04' from public.profiles where display_name = 'wynsday'
on conflict (member) do update set until = excluded.until;

update public.chairs
set wisdom = (select id from public.profiles where display_name = 'wynsday'),
    seated_at = now()
where house in ('nisaba', 'oht');
