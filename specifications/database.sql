create table projects (
   id integer PRIMARY KEY AUTOINCREMENT,
   url varchar(255) NULL,
   title varchar(255) NOT NULL,
   description text NOT NULL,
   created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
 );