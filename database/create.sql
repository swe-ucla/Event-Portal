-- $ psql -f create.sql

-- VARCHAR Lengths
-- short: 50, medium: 100, long: 255, very long: 1000

CREATE DATABASE swetestdb;
\c swetestdb;

----------------------------       TEST DATA        ----------------------------

CREATE TABLE test(id INT PRIMARY KEY, name VARCHAR (100) NOT NULL);
-- \copy test FROM '/var/lib/postgresql/data/pgdata/test.csv' DELIMITER ',' CSV HEADER;

----------------------------       COMPANIES        ----------------------------

-- E: Company Table
-- \copy company FROM '/var/lib/postgresql/data/pgdata/company/company.csv' DELIMITER ',' CSV HEADER;
CREATE TABLE company (
    id SERIAL PRIMARY KEY,
    name VARCHAR (100) NOT NULL,
    website VARCHAR (255), 
    logo VARCHAR (255),
    description text,
    updated_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL
);

--

-- E: Contact Table
CREATE TABLE contact (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR (50) NOT NULL,
    last_name VARCHAR (50) NOT NULL,
    email VARCHAR (255) UNIQUE NOT NULL,
    phone VARCHAR (20),
    misc text,
    updated_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL
);

-- R: Company Contact Table
CREATE TABLE company_contact (
    company_id INT REFERENCES company(id),
    contact_id INT REFERENCES contact(id),
    PRIMARY KEY (company_id, contact_id)
);

-- E: Hiring Requirement Table
CREATE TABLE hiring_requirement (
    id SERIAL PRIMARY KEY,
    requirement VARCHAR (100) NOT NULL,
    updated_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL
);

-- R: Company Hiring Requirement Table
CREATE TABLE company_hiring_requirement (
    company_id INT REFERENCES company(id),
    hiring_requirement_id INT REFERENCES hiring_requirement(id),
    PRIMARY KEY (company_id, hiring_requirement_id)
);

-- E: Major Table
CREATE TABLE major (
    id SERIAL PRIMARY KEY,
    major VARCHAR (100) NOT NULL,
    updated_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL
);

-- R: Company Major Table
CREATE TABLE company_major (
    company_id INT REFERENCES company(id),
    major_id INT REFERENCES major(id),
    PRIMARY KEY (company_id, major_id)
);

-- E: Position Table
CREATE TABLE position (
    id SERIAL PRIMARY KEY,
    position VARCHAR (100) NOT NULL,
    updated_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL
);

-- R: Company Position Table
CREATE TABLE company_position (
    company_id INT REFERENCES company(id),
    position_id INT REFERENCES position(id),
    PRIMARY KEY (company_id, position_id)
);

----------------------------         EVENTS         ----------------------------

-- E: Event Table
CREATE TABLE event (
    id SERIAL PRIMARY KEY,
    name VARCHAR (100) NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    description text,
    fb_event VARCHAR (255),
    picture VARCHAR (255),
    updated_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL
);

--

-- E: Location Table
CREATE TABLE location (
    id SERIAL PRIMARY KEY,
    name VARCHAR (100) NOT NULL,
    address VARCHAR (255) NOT NULL,
    description text,
    updated_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL
);

-- R: Event Location Table
CREATE TABLE event_location (
    event_id INT REFERENCES event(id),
    location_id INT REFERENCES location(id),
    PRIMARY KEY (event_id, location_id)
);

-- E: Category Table
CREATE TABLE category (
    id SERIAL PRIMARY KEY,
    category VARCHAR (100)
    updated_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL
);

-- R: Event Category Table
CREATE TABLE event_category (
    event_id INT REFERENCES event(id),
    category_id INT REFERENCES category(id),
    PRIMARY KEY (event_id, category_id)
);

-- R: Event Company Table
CREATE TABLE event_company (
    event_id INT REFERENCES event(id),
    company_id INT REFERENCES company(id),
    PRIMARY KEY (event_id, company_id)
);

-- R: Event Host Table
CREATE TABLE event_host (
    event_id INT REFERENCES event(id),
    user_id INT REFERENCES user(id),
    PRIMARY KEY (event_id, user_id)
);

-- R: Event Check In Table
CREATE TABLE event_checkin (
    event_id INT REFERENCES event(id),
    user_id INT REFERENCES user(id),
    checked_in BOOL DEFAULT false,
    PRIMARY KEY (event_id, user_id)
);

-- R: Event Registration Table
CREATE TABLE event_registration (
    event_id INT REFERENCES event(id),
    user_id INT REFERENCES user(id),
    has_paid BOOL DEFAULT false,
    PRIMARY KEY (event_id, user_id)
);

-- R: User Event Company Table
CREATE TYPE rank AS ENUM ('first', 'second', 'third');
CREATE TABLE user_event_company (
    event_id INT REFERENCES event(id),
    user_id INT REFERENCES user(id),
    company_id INT REFERENCES company(id),
    preference rank NOT NULL,
    PRIMARY KEY (event_id, user_id, preference) -- If company_id, can rank multiple companies 'first'
);

----------------------------         USERS          ----------------------------

-- E: User Table
CREATE TABLE user (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR (50) NOT NULL,
    last_name VARCHAR (50) NOT NULL,
    password VARCHAR (50) NOT NULL,
    email VARCHAR (255) UNIQUE NOT NULL,
    phone VARCHAR (20),
    is_admin BOOL DEFAULT false,
    updated_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL
);

--

-- E: Occupation Table
CREATE TYPE role AS ENUM ('Undergraduate Freshman', 
                          'Undergraduate Sophomore', 
                          'Undergraduate Junior',
                          'Undergraduate Senior');
CREATE TABLE occupation (
    id SERIAL PRIMARY KEY,
    occupation role NOT NULL,
    updated_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL
);

-- R: User Occupation Table
CREATE TABLE user_occupation (
    user_id INT REFERENCES user(id),
    occupation_id INT REFERENCES occupation(id),
    PRIMARY KEY (user_id, occupation_id)
);

-- E: Diet Table
CREATE TYPE diet_type AS ENUM ('vegan', 'vegetarian', 'kosher', 'todo');
CREATE TABLE diet (
    id SERIAL PRIMARY KEY,
    diet diet_type NOT NULL,
    updated_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL
);

-- R: User Diet Table
CREATE TABLE user_diet (
    user_id INT REFERENCES user(id),
    diet_id INT REFERENCES diet(id),
    PRIMARY KEY (user_id, diet_id)
);

-- R: User Major Table
CREATE TABLE user_major (
    user_id INT REFERENCES user(id),
    major_id INT REFERENCES major(id),
    PRIMARY KEY (user_id, major_id)
);

-- R: User Position Table
CREATE TABLE user_position (
    user_id INT REFERENCES user(id),
    position_id INT REFERENCES position(id),
    PRIMARY KEY (user_id, position_id)
);
