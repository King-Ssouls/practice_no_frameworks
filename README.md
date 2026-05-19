## База данных

База данных: PostgreSQL

Перед запуском проекта нужно создать базу данных и импортировать данные из файла `database.sql`

### Инструкция

1. Перейти в папку с файлом `database.sql`

```bash
cd <путь где храниться проект>
```

2. Создать базу данных

```bash
createdb -U postgres cleaning_portal
```

3. Импортировать базу данных из файла

```bash
psql -U postgres -d cleaning_portal -f database.sql
```

4. Проверить базу данных

```bash
psql -U postgres -d cleaning_portal
```

После входа в PostgreSQL:

```sql
\dt
```