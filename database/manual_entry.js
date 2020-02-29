const { db } = require("./connection");

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

// runQuery(`CREATE TABLE users (
//     id int not null auto_increment primary key, 
//     firstName varchar(255) not null, 
//     lastName varchar(255) not null, 
//     email varchar(255) not null, 
//     password varchar(255) not null)`);

// runQuery(`CREATE TABLE events (
//     id int not null auto_increment primary key, 
//     isPrivate bool not null, 
//     ownerId int not null,
//         foreign key (ownerId) references users(id), 
//     eventName varchar(255), 
//     startDate date not null, 
//     endDate date not null, 
//     repeatWeekly bool not null, 
//     weeklySchedule varchar(7), 
//     time time not null, 
//     locationName varchar(255), 
//     lat double(15, 12) not null, 
//     lng double(15, 12) not null, 
//     code varchar(255), 
//     attendees int)`);

// runQuery(`CREATE TABLE users_to_events (
//     id int not null auto_increment primary key,
//     userId int not null,
//         foreign key (userId) references users(id),
//     eventId int not null,
//         foreign key (eventId) references events(id))`)

// ENTERING ROWS
// runQuery("INSERT INTO users (firstName, lastName, email, password) VALUES ('John', 'Test1', 'john1@email.com', 'password')");

// SELECT
// runQuery("SELECT * FROM users");
// runQuery("SELECT * FROM users_info");
// runQuery(`SELECT * FROM events`);

// DELETE TABLES
// runQuery(`DROP TABLE users_to_events`)
// runQuery("DROP TABLE users");
// runQuery("DROP TABLE public_events");
// runQuery("DROP TABLE private_events");
// runQuery("DROP TABLE users_to_private");
// runQuery("DROP TABLE users_info");
// runQuery("DELETE FROM users_info WHERE firstName='john'");
// runQuery("DELETE FROM users WHERE (email='john@email.com') and (id > 1)");
// runQuery("DELETE FROM users_info WHERE (firstName='john') and (id = 4)");
// runQuery("DELETE FROM events WHERE ownerId=10");

// OTHERS
// runQuery("DESCRIBE users");
// runQuery("DESCRIBE users_info");
// runQuery("DESCRIBE public_events");
// runQuery("DESCRIBE private_events");
// runQuery("DESCRIBE users_to_public");
// runQuery("DESCRIBE users_to_private");
// runQuery(`SELECT * FROM (SELECT * FROM users INNER JOIN users_info ON users.user_info=users_info.id) WHERE email='mahdi@email.com'`)
