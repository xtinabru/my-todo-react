drop table if exists task;
drop table if exists account;

CREATE TABLE account (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE task (
    id SERIAL PRIMARY KEY,
    description TEXT NOT NULL,
    userid INTEGER NOT NULL,
    FOREIGN KEY (userid) REFERENCES account(id) ON DELETE CASCADE
);
insert into task (description) values ('My test task');
insert into task (description) values ('My another test task');