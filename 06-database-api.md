# Database design

## Example database for Simple Media sharing REST API

Entity-relationship diagram

```mermaid
erDiagram

Table Users {
  user_id INT PK
  username VARCHAR
  password VARCHAR
  email VARCHAR
  user_level_id INT FK
  created_at TIMESTAMP
}

Table UserLevels {
  level_id INT PK
  level_name VARCHAR
}

Table MediaItems {
  media_id INT PK
  user_id INT FK
  filename VARCHAR
  filesize INT
  media_type VARCHAR
  title VARCHAR
  description VARCHAR
  created_at TIMESTAMP
}

Table Comments {
  comment_id INT PK
  media_id INT FK
  user_id INT FK
  comment_text TEXT
  created_at TIMESTAMP
}

Table Likes {
  like_id INT PK
  media_id INT FK
  user_id INT FK
  created_at TIMESTAMP
}

Table Ratings {
  rating_id INT PK
  media_id INT FK
  user_id INT FK
  rating_value INT
  created_at TIMESTAMP
}

Table Tags {
  tag_id INT PK
  tag_name VARCHAR
}

Table MediaItemTags {
  media_id INT PK, FK
  tag_id INT PK, FK
}

Table Follows {
  follower_user_id INT PK, FK
  followed_user_id INT PK, FK
}

Users ||--o{ MediaItems : owns
Users ||--o{ Comments : comments
Users ||--o{ Likes : likes
Users ||--o{ Ratings : rates
Users ||--|{ UserLevels : has_a
Users |o--o{ Follows : is_follower
Follows }o--o| Users : is_followed

MediaItems ||--o{ Comments : has
MediaItems ||--o{ Likes : has
MediaItems ||--o{ Ratings : has
MediaItems ||--o{ MediaItemTags : tagged_with

Tags ||--o{ MediaItemTags : tags
```

- Each user can own multiple media items but each media item belongs to one user (owns relationship).
- Each user can comment, like, and rate multiple media items (comments, likes, and rates relationships).
- Media items can have multiple comments, likes, and ratings.
- Each user belongs to one user level (belongs_to relationship) but each user level can be associated with multiple users.
- Media items can be associated with multiple tags via the MediaItemTags table (tagged_with relationship). Each tag can tag multiple media items.
- Users can follow other users (is_follow* relationships).

## Database normalization

[Database normalization](https://en.wikipedia.org/wiki/Database_normalization) is a process used to organize a relational database into tables and columns. The idea is to divide a database into two parts: data and relationships between the data with following objectives:

- **Minimize Redundancy**: Ensure that the data is stored only once, eliminating duplicate data, which can save space and reduce inconsistencies.
- **Minimize Insert/Update/Delete Anomalies**: Anomalies can occur when data is added, deleted, or updated. Normalization helps reduce these anomalies by ensuring that data is structured logically.
- **Increase Data Integrity**: By reducing redundancy, normalization helps maintain data integrity, ensuring that the data within the database is accurate and consistent.
- **Optimize Queries**: Well-normalized tables can lead to more efficient queries by reducing the amount of data that needs to be scanned for a given query.

Normalization involves applying a series of rules to a database design, known as normal forms:

- **First Normal Form (1NF)**: Each column in a table should contain atomic, indivisible data, and there should be no repeating groups (like lists or data series).
- **Second Normal Form (2NF)**: The table is in 1NF, and all the non-primary-key columns are fully functionally dependent on the primary key.
- **Third Normal Form (3NF)**: The table is in 2NF, and all its columns are not only fully functionally dependent on the primary key but also non-transitively dependent. This means that no non-primary-key column should be dependent on another non-primary-key column.

There are even higher normal forms, like the Fourth Normal Form (4NF), which deals with multi-valued dependencies, and the Fifth Normal Form (5NF), which deals with joins, but these are less commonly applied in practical database design. In most cases, 3NF is sufficient and provides a a good balance between normalization benefits and performance considerations.

### Example: Database of Students and Their Courses

Suppose we have a table with the following fields:

- **Student_ID** – unique identifier for each student
- **Student_Name** – the name of the student
- **Course** – name of the course
- **Instructor** – instructor of the course

The table data might look like this:

| Student_ID | Student_Name | Course        | Instructor  |
|------------|--------------|---------------|-------------|
| 1          | Lisa         | Mathematics   | Smith       |
| 2          | John         | Physics       | Johnson     |
| 1          | Lisa         | Physics       | Johnson     |
| 3          | Anna         | Mathematics   | Smith       |
| 2          | John         | Mathematics   | Smith       |

Now, let’s analyze this table based on the normal forms.

### 1st Normal Form (1NF)

1NF requires that all fields contain only atomic (single) values, with no lists or arrays. In this table, this rule is already met since each field contains only a single value.

**1NF Table:** The table remains the same, as it already satisfies 1NF.

### 2nd Normal Form (2NF)

2NF requires that every non-key field depends on the whole primary key, not just part of it. In our example, information about the instructor depends on the course, not on the student, creating redundant information.

To solve this, we can split the table into two separate tables, eliminating dependencies that only relate to part of the key.

**Example of Tables in 2NF:**

**Students Table:**

| Student_ID | Student_Name |
|------------|--------------|
| 1          | Lisa         |
| 2          | John         |
| 3          | Anna         |

**Courses Table:**

| Course       | Instructor  |
|--------------|-------------|
| Mathematics  | Smith       |
| Physics      | Johnson     |

**Student_Courses Table (link table):**

| Student_ID | Course       |
|------------|--------------|
| 1          | Mathematics  |
| 2          | Physics      |
| 1          | Physics      |
| 3          | Mathematics  |
| 2          | Mathematics  |

This structure ensures that course information is stored separately from student information, so any change in the instructor’s details will update consistently across all students.

### 3rd Normal Form (3NF)

3NF requires that non-key fields depend only on the primary key and not on other non-key fields (eliminating transitive dependencies). In this example, both tables are already in 3NF because there are no transitive dependencies.

**Final 3NF Tables:** The three tables from 2NF remain the same.

## Example database setup and some sample data

Review and import [this script file](assets/media-db.sql)

## Advanced SQL queries

### Grouping and aggregation

Query result may have several identical rows. To get unique rows only, use `DISTINCT`:

```sql
SELECT DISTINCT media_type FROM MediaItems;
```

Use `GROUP BY` clause to group resulting groups by column(s). With one column works similarly to `DISTINCT` but grouping can be done by many columns:

```sql
-- one column
SELECT media_type FROM MediaItems GROUP BY media_type;
-- two columns
SELECT media_type, filesize FROM MediaItems
  GROUP BY media_type, filesize;
```

Note if grouping is used, you can only SELECT columns that are

- Part of GROUP BY
- Part of aggregate function

For example, the query below is ambigious (which filesize to select for each media_type?):

```sql
SELECT media_type, filesize FROM MediaItems
  GROUP BY media_type;
```

Groups can be filtered by `HAVING` clause:

```sql
-- select media types having more than one item
SELECT media_type FROM MediaItems
  GROUP BY media_type
  HAVING COUNT(media_type) > 1;

-- select media types and count of them having more than one item
SELECT media_type, COUNT(media_type) AS count
  FROM MediaItems
  GROUP BY media_type
  HAVING count > 1;
```

Aggregate functions can be applied to groups defined by `GROUP BY`

- If no grouping in specified, the aggregate function applies to the query result as a whole
- For example, aggregate function `COUNT(*)` returns the record count within each group
- Some aggregate functions
  - `AVG`: Average
  - `COUNT`: Count
  - `MIN`: Minimum value
  - `MAX`: Maximum value
  - `STDDEV`: Standard deviation
  - `SUM`: Sum

```sql
-- select min and max filesizes
SELECT MIN(filesize), MAX(filesize) FROM MediaItems;

-- select total size of all media items
SELECT SUM(filesize) FROM MediaItems;

-- select min, max and rounded average filesizes for each media type
SELECT media_type, MIN(filesize), MAX(filesize), ROUND(AVG(filesize)) AS average
  FROM MediaItems
  GROUP BY media_type;
```

### Subqueries

`SELECT`, `UPDATE` and `DELETE` operations may contain other SELECT queries as a subqueries

- can be nested, the innermost query is executed first
- Membership in inner query’s result set can be tested with `IN` or `NOT IN` operator

```sql
-- Select all media files tagged with 'Nature' using subqueries
SELECT title, description, filename FROM MediaItems
  WHERE media_id IN (
    SELECT media_id FROM MediaItemTags WHERE tag_id = (
      SELECT tag_id FROM Tags WHERE tag_name = 'Nature'
    )
  );
```

### Some example queries

```sql
-- Select media item which has the most likes
SELECT media_id, COUNT(media_id) AS likes
  FROM Likes GROUP BY media_id
  ORDER BY likes DESC LIMIT 1;

-- Count the number of media items each user has
SELECT Users.username, COUNT(MediaItems.media_id) AS NumberOfMediaItems 
  FROM Users 
  JOIN MediaItems ON Users.user_id = MediaItems.user_id 
  GROUP BY Users.username;

-- select username who have most likes for their media items
SELECT username, COUNT(media_id) AS likes
  FROM Likes
  JOIN Users ON Likes.user_id = Users.user_id
  GROUP BY username ORDER BY likes DESC LIMIT 1;

-- user 'JohnDoe' likes media item with id 1
INSERT INTO Likes (media_id, user_id)
  VALUES (1, (
      SELECT user_id FROM Users WHERE username = 'JohnDoe'
    )
  );

-- user with id 1 comments on media item with id 1: "Nice photo!"
INSERT INTO Comments (media_id, user_id, comment_text) VALUES (1, 1, 'Nice photo!');

-- select all comments and usernames for media item with id 1
SELECT Comments.created_at, username, comment_text
  FROM Comments
  JOIN Users ON Comments.user_id = Users.user_id
  WHERE media_id = 1;

-- update user level of user 'JaneDoe' (id is known) to 'Admin'
UPDATE Users SET user_level_id =
  (SELECT level_id FROM UserLevels WHERE level_name = 'Admin')
  WHERE user_id = 2;

```

## Links & extra material

- [TutorialsTeacher: Learn SQL (Standard Query Language) for Databases](https://www.tutorialsteacher.com/sql)
- [W3Schools: SQL Tutorial](https://www.w3schools.com/sql/)

---

## Assignment 3B - Database design for you project application

Think about the features of your server-side application/API. What kind of data is needed to store in the database to implement all of the requirements/functionalities of your app?

1. List your requirements/functionalities
1. Identify and design the entities (tables) and relations between them
1. Draw a diagram of the database structure (including relations between tables)
   - [ERDPlus](https://erdplus.com/) is a free online tool for drawing DB diagrams (choose Relational schema as the diagram type)
1. Define the data types for the columns
1. Define primary keys and foreign keys
1. Implement SQL statements for creating the tables
1. Insert some records of mock data into them.
1. Think about use cases for the data from the application point of view and provide examples how to update, delete and query the data in a meaningful way
   - describe the use cases in SQL script comments
1. Create a script including all your SQL statements (create tables, insert data, queries, updates, etc.)
   - `mysqldump` command can be used to create a script from an existing database

**Returning:** Check assignment in OMA.

**Grading:** max 4 points
