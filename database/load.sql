-- $ psql -f create.sql
\c swetestdb;

-- enums: \dT+, DROP TYPE enum_name
-- VARCHAR Lengths
-- short: 50, medium: 100, long: 255, very long: 1000

-- List all tables and types

-- \dt
-- \dT+

-- Drop all tables and types

-- DROP TABLE table_name;
-- DROP TYPE type_name;

-- Test data

CREATE TABLE test(id INT PRIMARY KEY, name VARCHAR (100) NOT NULL);
\copy test FROM '/var/lib/postgresql/data/pgdata/test.csv' DELIMITER ',' CSV HEADER;

-- Create all tables and types

CREATE TYPE requirement AS ENUM ('Y', 'N', 'Depends on the Position');
CREATE TABLE company (
    id SERIAL PRIMARY KEY,
    name VARCHAR (100) NOT NULL,
    website VARCHAR (255), 
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
    company_id INT REFERENCES company(id),
    contact_id INT REFERENCES contact(id),
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
    name VARCHAR (100) NOT NULL,
    ucla_id INT REFERENCES ucla_major(id),
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE company_major (
    company_id INT REFERENCES company(id),
    major_id INT REFERENCES major(id),
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (company_id, major_id)
);

CREATE TABLE position (
    id SERIAL PRIMARY KEY,
    role VARCHAR (100) NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE company_position (
    company_id INT REFERENCES company(id),
    position_id INT REFERENCES position(id),
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (company_id, position_id)
);

--

CREATE TABLE address (
    id SERIAL PRIMARY KEY,
    name VARCHAR (255) NOT NULL,
    street VARCHAR (255) NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE location (
    id SERIAL PRIMARY KEY,
    name VARCHAR (255),
    address_id INT REFERENCES address(id),
    description text,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE event (
    fb_id VARCHAR (50) PRIMARY KEY,
    name VARCHAR (100) NOT NULL,
    starts_at TIMESTAMP NOT NULL,
    ends_at TIMESTAMP NOT NULL,
    location_id INT REFERENCES location(id),
    description text,
    fb_event VARCHAR (255),
    picture text,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE category (
    id SERIAL PRIMARY KEY,
    name VARCHAR (100),
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE event_category (
    event_id VARCHAR (50) REFERENCES event(fb_id),
    category_id INT REFERENCES category(id),
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (event_id, category_id)
);

CREATE TABLE event_company (
    event_id VARCHAR (50) REFERENCES event(fb_id),
    company_id INT REFERENCES company(id),
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
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE event_host (
    event_id VARCHAR (50) REFERENCES event(fb_id),
    host_id INT REFERENCES swe_user(id),
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (event_id, host_id)
);

CREATE TABLE event_checkin (
    event_id VARCHAR (50) REFERENCES event(fb_id),
    user_id INT REFERENCES swe_user(id),
    checked_in BOOL DEFAULT false,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (event_id, user_id)
);

CREATE TABLE event_registration (
    event_id VARCHAR (50) REFERENCES event(fb_id),
    user_id INT REFERENCES swe_user(id),
    has_paid BOOL DEFAULT false,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (event_id, user_id)
);

CREATE TYPE preference AS ENUM ('First Choice', 'Second Choice', 'Third Choice');
CREATE TABLE user_company_rank (
    user_id INT REFERENCES swe_user(id),
    company_id INT REFERENCES company(id),
    rank preference NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, company_id, rank)
);

CREATE TABLE occupation (
    id SERIAL PRIMARY KEY,
    name VARCHAR (100) NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_occupation (
    user_id INT REFERENCES swe_user(id),
    occupation_id INT REFERENCES occupation(id),
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, occupation_id)
);

CREATE TABLE diet (
    id SERIAL PRIMARY KEY,
    type VARCHAR (100) NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_diet (
    user_id INT REFERENCES swe_user(id),
    diet_id INT REFERENCES diet(id),
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, diet_id)
);

CREATE TABLE user_major (
    user_id INT REFERENCES swe_user(id),
    major_id INT REFERENCES major(id),
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, major_id)
);

CREATE TABLE user_position (
    user_id INT REFERENCES swe_user(id),
    position_id INT REFERENCES position(id),
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

\copy company (id,name,website,logo,citizenship_requirement,description) FROM '/var/lib/postgresql/data/pgdata/company/company.csv' DELIMITER ',' CSV HEADER;
\copy contact (id,first_name,last_name,email,phone,misc) FROM '/var/lib/postgresql/data/pgdata/company/contact.csv' DELIMITER ',' CSV HEADER;
\copy company_contact (company_id,contact_id) FROM '/var/lib/postgresql/data/pgdata/company/company_contact.csv' DELIMITER ',' CSV HEADER;
\copy ucla_major (id,code,major,abbreviation,department,department_abbreviation,school,division) FROM '/var/lib/postgresql/data/pgdata/company/ucla_major.csv' DELIMITER ',' CSV HEADER;
\copy major (id,name,ucla_id) FROM '/var/lib/postgresql/data/pgdata/company/major.csv' DELIMITER ',' CSV HEADER;
\copy company_major (company_id,major_id) FROM '/var/lib/postgresql/data/pgdata/company/company_major.csv' DELIMITER ',' CSV HEADER;
\copy position (id,role) FROM '/var/lib/postgresql/data/pgdata/company/position.csv' DELIMITER ',' CSV HEADER;
\copy company_position (company_id,position_id) FROM '/var/lib/postgresql/data/pgdata/company/company_position.csv' DELIMITER ',' CSV HEADER;

\copy address (id,name,street)  FROM '/var/lib/postgresql/data/pgdata/event/address.csv' DELIMITER ',' CSV HEADER;
\copy location (id,name,address_id,description)  FROM '/var/lib/postgresql/data/pgdata/event/location.csv' DELIMITER ',' CSV HEADER;
\copy event (fb_id,name,starts_at,ends_at,location_id,description,fb_event,picture)  FROM '/var/lib/postgresql/data/pgdata/event/event.csv' DELIMITER ',' CSV HEADER;
\copy category (id,name)  FROM '/var/lib/postgresql/data/pgdata/event/category.csv' DELIMITER ',' CSV HEADER;
\copy event_category (event_id,category_id)  FROM '/var/lib/postgresql/data/pgdata/event/event_category.csv' DELIMITER ',' CSV HEADER;
\copy event_company (event_id,company_id)  FROM '/var/lib/postgresql/data/pgdata/event/event_company.csv' DELIMITER ',' CSV HEADER;

\copy swe_user (id,first_name,last_name,password,email,phone,university_id,is_admin)  FROM '/var/lib/postgresql/data/pgdata/user/swe_user.csv' DELIMITER ',' CSV HEADER;
\copy event_host (event_id,host_id)  FROM '/var/lib/postgresql/data/pgdata/event/event_host.csv' DELIMITER ',' CSV HEADER;
\copy event_checkin (event_id,user_id,checked_in)  FROM '/var/lib/postgresql/data/pgdata/event/event_checkin.csv' DELIMITER ',' CSV HEADER;
\copy event_registration (event_id,user_id,has_paid)  FROM '/var/lib/postgresql/data/pgdata/event/event_registration.csv' DELIMITER ',' CSV HEADER;
\copy user_company_rank (user_id,company_id,rank)  FROM '/var/lib/postgresql/data/pgdata/user/user_company_rank.csv' DELIMITER ',' CSV HEADER;
\copy occupation (id,name)  FROM '/var/lib/postgresql/data/pgdata/user/occupation.csv' DELIMITER ',' CSV HEADER;
\copy user_occupation (user_id,occupation_id)  FROM '/var/lib/postgresql/data/pgdata/user/user_occupation.csv' DELIMITER ',' CSV HEADER;
\copy diet (id,type)  FROM '/var/lib/postgresql/data/pgdata/user/diet.csv' DELIMITER ',' CSV HEADER;
\copy user_diet (user_id,diet_id)  FROM '/var/lib/postgresql/data/pgdata/user/user_diet.csv' DELIMITER ',' CSV HEADER;
\copy user_major (user_id,major_id)  FROM '/var/lib/postgresql/data/pgdata/user/user_major.csv' DELIMITER ',' CSV HEADER;
\copy user_position (user_id,position_id)  FROM '/var/lib/postgresql/data/pgdata/user/user_position.csv' DELIMITER ',' CSV HEADER;
