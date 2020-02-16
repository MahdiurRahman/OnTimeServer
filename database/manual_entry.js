const db = require("./connection");

// Basic query function:
    // Use this instead of db.query in this file, because otherwise it'll get too repetitive.
const runQuery = queryString => {
    console.log("runQuery")
    db.query(queryString, (error, results, fields) => {
        if (error) {
            console.log("FAILURE")
            console.log(error)
            return error
        }
        else {
            console.log("SUCCESS")
            console.log(results)
            return results
        }
    })
}

// CREATING TABLES
// runQuery("CREATE TABLE users (id int not null auto_increment primary key, firstName varchar(255) not null, lastName varchar(255) not null, email varchar(255) not null, password varchar(255) not null)");
// runQuery("CREATE TABLE public_events (id int not null auto_increment primary key, eventName varchar(255), startDate date not null, endDate date not null, attendees int not null, sun boolean not null, mon boolean not null, tue boolean not null, wed boolean not null, thu boolean not null, fri boolean not null, sat boolean not null, time time not null, locationName varchar(255), lng double(15, 12) not null, lat double(15, 12) not null, accessKey varchar(255) not null)");
// runQuery("CREATE TABLE private_events (id int not null auto_increment primary key, eventName varchar(255), startDate date not null, endDate date not null, capacity int, attendees int not null, sun boolean not null, mon boolean not null, tue boolean not null, wed boolean not null, thu boolean not null, fri boolean not null, sat boolean not null, time time not null, locationName varchar(255), lng double(15, 12) not null, lat double(15, 12) not null)");
// runQuery("CREATE TABLE users_to_public (id int not null auto_increment primary key, userId int not null, foreign key (userId) references users(id), eventIdPublic int not null, foreign key (eventIdPublic) references public_events(id))");
// runQuery("CREATE TABLE users_to_private (id int not null auto_increment primary key, userId int not null, foreign key (userId) references users(id), eventIdPrivate int not null, foreign key (eventIdPrivate) references private_events(id))");

// ENTERING ROWS
// runQuery("INSERT INTO users (firstName, lastName, email, password) VALUES ('John', 'Test1', 'john1@email.com', 'password')");

// SELECT ALL's
// runQuery("SELECT * FROM users");

// DELETE TABLES
// runQuery("DROP TABLE users");
// runQuery("DROP TABLE public_events");
// runQuery("DROP TABLE private_events");

// OTHERS
// runQuery("DESCRIBE users");
// runQuery("DESCRIBE public_events");
// runQuery("DESCRIBE private_events");
// runQuery("DESCRIBE users_to_public");
// runQuery("DESCRIBE users_to_private");
