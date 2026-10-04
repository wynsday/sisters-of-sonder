-- Make wynsday the founder until 2027-04-04 and seat her in both chairs.
update public.profiles set founder_until = '2027-04-04' where display_name = 'wynsday';

update public.chairs
set wisdom = (select id from public.profiles where display_name = 'wynsday'),
    seated_at = now()
where house in ('nisaba', 'oht');
