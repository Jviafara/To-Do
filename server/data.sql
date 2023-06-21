CREATE DATABASE todoapp;

CREATE TABLE todos (
   id varchar(255) PRIMARY KEY,
   user_email varchar(255),
   title varchar(30),
   progress INT,
   date varchar(300)
);

CREATE TABLE user (email varchar(255) PRIMARY KEY,hashed_password varchar(255));

INSERT INTO todos (id,user_email,title, progress, date) VALUES ('1','emai1@email.co','Lavar',50,'Sunday Dec 15 2023');
INSERT INTO "user" (email,hashed_password);