-- $ psql -f create.sql
-- # \i /docker-entrypoint-initdb.d/create.sql;

CREATE DATABASE swedevdb;
\c swedevdb;

-- enums: \dT+, DROP TYPE enum_name
-- VARCHAR Lengths
-- short: 50, medium: 100, long: 255, very long: 1000

-- List all tables and types

-- \dt
-- \dT+

-- Drop all tables and types

-- DROP TABLE table_name;
-- DROP TYPE type_name;
-- DROP TABLE IF EXISTS company_contact;
-- DROP TABLE IF EXISTS company_major;
-- DROP TABLE IF EXISTS company_position;

-- DROP TABLE IF EXISTS event_category;
-- DROP TABLE IF EXISTS event_checkin;
-- DROP TABLE IF EXISTS event_company;
-- DROP TABLE IF EXISTS event_host;
-- DROP TABLE IF EXISTS event_registration;

-- DROP TABLE IF EXISTS favorite_events;
-- DROP TABLE IF EXISTS user_company_rank;
-- DROP TABLE IF EXISTS user_diet;
-- DROP TABLE IF EXISTS user_major;
-- DROP TABLE IF EXISTS user_occupation;
-- DROP TABLE IF EXISTS user_position;

-- DROP TABLE IF EXISTS test;
-- DROP TABLE IF EXISTS event;
-- DROP TABLE IF EXISTS swe_user;
-- DROP TABLE IF EXISTS company;

-- DROP TABLE IF EXISTS location;
-- DROP TABLE IF EXISTS address;
-- DROP TABLE IF EXISTS category;
-- DROP TABLE IF EXISTS contact;
-- DROP TABLE IF EXISTS diet;
-- DROP TABLE IF EXISTS major;
-- DROP TABLE IF EXISTS occupation;
-- DROP TABLE IF EXISTS position;
-- DROP TABLE IF EXISTS ucla_major;

-- DROP TYPE IF EXISTS requirement;
-- DROP TYPE IF EXISTS week_number;
-- DROP TYPE IF EXISTS time_period;
-- DROP TYPE IF EXISTS preference;

-- Test data

CREATE TABLE test (id INT PRIMARY KEY, name VARCHAR (100) NOT NULL);
\copy test FROM '/docker-entrypoint-initdb.d/data/test.csv' DELIMITER ',' CSV HEADER;

-- Create all tables and types

CREATE TYPE requirement AS ENUM ('Y', 'N', 'Depends on the Position');
CREATE TABLE company (
    id SERIAL PRIMARY KEY,
    name VARCHAR (100) UNIQUE NOT NULL,
    website VARCHAR (255) UNIQUE, 
    logo VARCHAR (255),
    citizenship_requirement requirement,
    description text,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE contact (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR (50) NOT NULL,
    last_name VARCHAR (50) NOT NULL,
    email VARCHAR (255) UNIQUE NOT NULL,
    phone VARCHAR (20),
    misc text,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE company_contact (
    company_id INT REFERENCES company(id) ON DELETE CASCADE,
    contact_id INT REFERENCES contact(id) ON DELETE CASCADE,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (company_id, contact_id)
);

CREATE TABLE ucla_major (
    id SERIAL PRIMARY KEY,
    code VARCHAR (4),
    major VARCHAR (100) NOT NULL,
    abbreviation VARCHAR (50),
    department VARCHAR (100),
    department_abbreviation VARCHAR (50),
    school VARCHAR (50),
    division VARCHAR (50),
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE major (
    id SERIAL PRIMARY KEY,
    name VARCHAR (100) UNIQUE NOT NULL,
    ucla_id INT REFERENCES ucla_major(id) ON DELETE CASCADE,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE company_major (
    company_id INT REFERENCES company(id) ON DELETE CASCADE,
    major_id INT REFERENCES major(id) ON DELETE CASCADE,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (company_id, major_id)
);

CREATE TABLE position (
    id SERIAL PRIMARY KEY,
    role VARCHAR (100) UNIQUE NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE company_position (
    company_id INT REFERENCES company(id) ON DELETE CASCADE,
    position_id INT REFERENCES position(id) ON DELETE CASCADE,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (company_id, position_id)
);

--

CREATE TABLE address (
    id SERIAL PRIMARY KEY,
    name VARCHAR (255) UNIQUE NOT NULL,
    street VARCHAR (255) NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE location (
    id SERIAL PRIMARY KEY,
    name VARCHAR (255),
    address_id INT REFERENCES address(id) ON DELETE CASCADE,
    description text,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE week_number AS ENUM ('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Finals');
CREATE TYPE time_period AS ENUM ('Fall Quarter', 'Winter Break', 'Winter Quarter', 'Spring Break', 'Spring Quarter', 'Summer Quarter');
CREATE TABLE event (
    fb_id VARCHAR (50) PRIMARY KEY,
    name VARCHAR (100) NOT NULL,
    starts_at TIMESTAMP NOT NULL,
    ends_at TIMESTAMP NOT NULL,
    period time_period NOT NULL,
    week week_number,
    location_id INT REFERENCES location(id) ON DELETE CASCADE,
    description text,
    fb_event VARCHAR (255),
    picture text,
    is_featured BOOL DEFAULT false,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE category (
    id SERIAL PRIMARY KEY,
    name VARCHAR (100) UNIQUE,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE event_category (
    event_id VARCHAR (50) REFERENCES event(fb_id) ON DELETE CASCADE,
    category_id INT REFERENCES category(id) ON DELETE CASCADE,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (event_id, category_id)
);

CREATE TABLE event_company (
    event_id VARCHAR (50) REFERENCES event(fb_id) ON DELETE CASCADE,
    company_id INT REFERENCES company(id) ON DELETE CASCADE,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (event_id, company_id)
);

--

CREATE TABLE swe_user (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR (50) NOT NULL,
    last_name VARCHAR (50) NOT NULL,
    password VARCHAR (50) NOT NULL,
    email VARCHAR (255) UNIQUE NOT NULL,
    phone VARCHAR (20),
    university_id VARCHAR (9) UNIQUE,
    is_admin BOOL DEFAULT false,
    last_login_at TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE event_host (
    event_id VARCHAR (50) REFERENCES event(fb_id) ON DELETE CASCADE,
    host_id INT REFERENCES swe_user(id) ON DELETE CASCADE,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (event_id, host_id)
);

CREATE TABLE favorite_events (
    user_id INT REFERENCES swe_user(id) ON DELETE CASCADE,
    event_id VARCHAR (50) REFERENCES event(fb_id) ON DELETE CASCADE,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, event_id)
);

CREATE TABLE event_checkin (
    event_id VARCHAR (50) REFERENCES event(fb_id) ON DELETE CASCADE,
    user_id INT REFERENCES swe_user(id) ON DELETE CASCADE,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (event_id, user_id)
);

-- TODO: add required fields, potentially combine with checkin
CREATE TABLE event_registration (
    event_id VARCHAR (50) REFERENCES event(fb_id) ON DELETE CASCADE,
    user_id INT REFERENCES swe_user(id) ON DELETE CASCADE,
    has_paid BOOL DEFAULT false,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (event_id, user_id)
);

-- TODO: associate with event?
CREATE TYPE preference AS ENUM ('First Choice', 'Second Choice', 'Third Choice');
CREATE TABLE user_company_rank (
    user_id INT REFERENCES swe_user(id) ON DELETE CASCADE,
    company_id INT REFERENCES company(id) ON DELETE CASCADE,
    rank preference NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, company_id, rank)
);

CREATE TABLE occupation (
    id SERIAL PRIMARY KEY,
    name VARCHAR (100) UNIQUE NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_occupation (
    user_id INT REFERENCES swe_user(id) ON DELETE CASCADE,
    occupation_id INT REFERENCES occupation(id) ON DELETE CASCADE,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, occupation_id)
);

CREATE TABLE diet (
    id SERIAL PRIMARY KEY,
    type VARCHAR (100) UNIQUE NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_diet (
    user_id INT REFERENCES swe_user(id) ON DELETE CASCADE,
    diet_id INT REFERENCES diet(id) ON DELETE CASCADE,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, diet_id)
);

CREATE TABLE user_major (
    user_id INT REFERENCES swe_user(id) ON DELETE CASCADE,
    major_id INT REFERENCES major(id) ON DELETE CASCADE,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, major_id)
);

CREATE TABLE user_position (
    user_id INT REFERENCES swe_user(id) ON DELETE CASCADE,
    position_id INT REFERENCES position(id) ON DELETE CASCADE,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, position_id)
);

-- Create update timestamp triggers

CREATE OR REPLACE FUNCTION update_timestamp_column() RETURNS TRIGGER AS 
$$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP; 
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_timestamp BEFORE UPDATE
    ON address FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();

CREATE TRIGGER update_timestamp BEFORE UPDATE
    ON category FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();

CREATE TRIGGER update_timestamp BEFORE UPDATE
    ON company FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();

CREATE TRIGGER update_timestamp BEFORE UPDATE
    ON company_contact FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();

CREATE TRIGGER update_timestamp BEFORE UPDATE
    ON company_major FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();

CREATE TRIGGER update_timestamp BEFORE UPDATE
    ON company_position FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();

CREATE TRIGGER update_timestamp BEFORE UPDATE
    ON contact FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();

CREATE TRIGGER update_timestamp BEFORE UPDATE
    ON diet FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();

CREATE TRIGGER update_timestamp BEFORE UPDATE
    ON event FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();

CREATE TRIGGER update_timestamp BEFORE UPDATE
    ON event_category FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();

CREATE TRIGGER update_timestamp BEFORE UPDATE
    ON event_checkin FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();

CREATE TRIGGER update_timestamp BEFORE UPDATE
    ON event_company FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();

CREATE TRIGGER update_timestamp BEFORE UPDATE
    ON favorite_events FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();

CREATE TRIGGER update_timestamp BEFORE UPDATE
    ON event_host FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();

CREATE TRIGGER update_timestamp BEFORE UPDATE
    ON event_registration FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();

CREATE TRIGGER update_timestamp BEFORE UPDATE
    ON location FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();

CREATE TRIGGER update_timestamp BEFORE UPDATE
    ON major FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();

CREATE TRIGGER update_timestamp BEFORE UPDATE
    ON occupation FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();

CREATE TRIGGER update_timestamp BEFORE UPDATE
    ON position FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();

CREATE TRIGGER update_timestamp BEFORE UPDATE
    ON swe_user FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();

CREATE TRIGGER update_timestamp BEFORE UPDATE
    ON ucla_major FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();

CREATE TRIGGER update_timestamp BEFORE UPDATE
    ON user_company_rank FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();

CREATE TRIGGER update_timestamp BEFORE UPDATE
    ON user_diet FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();

CREATE TRIGGER update_timestamp BEFORE UPDATE
    ON user_major FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();

CREATE TRIGGER update_timestamp BEFORE UPDATE
    ON user_occupation FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();

CREATE TRIGGER update_timestamp BEFORE UPDATE
    ON user_position FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();

-- Populate all tables

\copy address (id,name,street)  FROM '/docker-entrypoint-initdb.d/data/misc/address.csv' DELIMITER ',' CSV HEADER;
\copy category (id,name)  FROM '/docker-entrypoint-initdb.d/data/misc/category.csv' DELIMITER ',' CSV HEADER;
\copy contact (id,first_name,last_name,email,phone,misc) FROM '/docker-entrypoint-initdb.d/data/misc/contact.csv' DELIMITER ',' CSV HEADER;
\copy diet (id,type)  FROM '/docker-entrypoint-initdb.d/data/misc/diet.csv' DELIMITER ',' CSV HEADER;
\copy location (id,name,address_id,description)  FROM '/docker-entrypoint-initdb.d/data/misc/location.csv' DELIMITER ',' CSV HEADER;
\copy ucla_major (id,code,major,abbreviation,department,department_abbreviation,school,division) FROM '/docker-entrypoint-initdb.d/data/misc/ucla_major.csv' DELIMITER ',' CSV HEADER;
\copy major (id,name,ucla_id) FROM '/docker-entrypoint-initdb.d/data/misc/major.csv' DELIMITER ',' CSV HEADER;
\copy occupation (id,name)  FROM '/docker-entrypoint-initdb.d/data/misc/occupation.csv' DELIMITER ',' CSV HEADER;
\copy position (id,role) FROM '/docker-entrypoint-initdb.d/data/misc/position.csv' DELIMITER ',' CSV HEADER;

\copy company (id,name,website,logo,citizenship_requirement,description) FROM '/docker-entrypoint-initdb.d/data/company/company.csv' DELIMITER ',' CSV HEADER;
\copy event (fb_id,name,starts_at,ends_at,period,week,location_id,description,fb_event,picture,is_featured)  FROM '/docker-entrypoint-initdb.d/data/event/event.csv' DELIMITER ',' CSV HEADER;
\copy swe_user (id,first_name,last_name,password,email,phone,university_id,is_admin)  FROM '/docker-entrypoint-initdb.d/data/user/swe_user.csv' DELIMITER ',' CSV HEADER;

\copy company_contact (company_id,contact_id) FROM '/docker-entrypoint-initdb.d/data/company/company_contact.csv' DELIMITER ',' CSV HEADER;
\copy company_major (company_id,major_id) FROM '/docker-entrypoint-initdb.d/data/company/company_major.csv' DELIMITER ',' CSV HEADER;
\copy company_position (company_id,position_id) FROM '/docker-entrypoint-initdb.d/data/company/company_position.csv' DELIMITER ',' CSV HEADER;

\copy event_category (event_id,category_id)  FROM '/docker-entrypoint-initdb.d/data/event/event_category.csv' DELIMITER ',' CSV HEADER;
\copy event_checkin (event_id,user_id)  FROM '/docker-entrypoint-initdb.d/data/event/event_checkin.csv' DELIMITER ',' CSV HEADER;
\copy event_company (event_id,company_id)  FROM '/docker-entrypoint-initdb.d/data/event/event_company.csv' DELIMITER ',' CSV HEADER;
\copy event_host (event_id,host_id)  FROM '/docker-entrypoint-initdb.d/data/event/event_host.csv' DELIMITER ',' CSV HEADER;
\copy event_registration (event_id,user_id,has_paid)  FROM '/docker-entrypoint-initdb.d/data/event/event_registration.csv' DELIMITER ',' CSV HEADER;

\copy favorite_events (user_id,event_id)  FROM '/docker-entrypoint-initdb.d/data/user/favorite_events.csv' DELIMITER ',' CSV HEADER;
\copy user_company_rank (user_id,company_id,rank)  FROM '/docker-entrypoint-initdb.d/data/user/user_company_rank.csv' DELIMITER ',' CSV HEADER;
\copy user_diet (user_id,diet_id)  FROM '/docker-entrypoint-initdb.d/data/user/user_diet.csv' DELIMITER ',' CSV HEADER;
\copy user_major (user_id,major_id)  FROM '/docker-entrypoint-initdb.d/data/user/user_major.csv' DELIMITER ',' CSV HEADER;
\copy user_occupation (user_id,occupation_id)  FROM '/docker-entrypoint-initdb.d/data/user/user_occupation.csv' DELIMITER ',' CSV HEADER;
\copy user_position (user_id,position_id)  FROM '/docker-entrypoint-initdb.d/data/user/user_position.csv' DELIMITER ',' CSV HEADER;

-- Modify starting value for serial sequences

-- SELECT c.relname FROM pg_class c WHERE c.relkind = 'S';
-- SELECT last_value FROM *_id_seq;

SELECT setval('company_id_seq', (SELECT MAX(id) FROM company));
SELECT setval('contact_id_seq', (SELECT MAX(id) FROM contact));
SELECT setval('ucla_major_id_seq', (SELECT MAX(id) FROM ucla_major));
SELECT setval('major_id_seq', (SELECT MAX(id) FROM major));
SELECT setval('position_id_seq', (SELECT MAX(id) FROM position));
SELECT setval('address_id_seq', (SELECT MAX(id) FROM address));
SELECT setval('location_id_seq', (SELECT MAX(id) FROM location));
SELECT setval('category_id_seq', (SELECT MAX(id) FROM category));
SELECT setval('swe_user_id_seq', (SELECT MAX(id) FROM swe_user));
SELECT setval('occupation_id_seq', (SELECT MAX(id) FROM occupation));
SELECT setval('diet_id_seq', (SELECT MAX(id) FROM diet));

