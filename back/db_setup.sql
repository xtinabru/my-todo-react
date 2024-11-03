drop table if exists task;
drop table if exists account;

create table account (
  id serial primary key,
  email varchar(50) unique not null,
  password varchar(255) not null
);

CREATE TABLE task (
  id SERIAL PRIMARY KEY,
  description VARCHAR(255) NOT NULL,
  userId INT NOT NULL,
  FOREIGN KEY (userId) REFERENCES account(id)
);

insert into task (description) values ('My test task');
insert into task (description) values ('My another test task');