## MVP API Endpoints

##### Companies API

| Endpoint                               | HTTP Method | CRUD Method | Result                                                      | DB Query                                                     |
| -------------------------------------- | ----------- | ----------- | ----------------------------------------------------------- | ------------------------------------------------------------ |
| /companies/ping                        | GET         | READ        | `pong` - Sanity Check                                       | -                                                            |
| /companies                             | GET         | READ        | Get all companies' info                                     | SELECT id FROM company;                                      |
| /companies/names                       | GET         | READ        | Get all company names                                       | SELECT id, name FROM company ORDER BY name;                  |
| /companies/logos                       | GET         | READ        | Get all company names and logos                             | SELECT id, name, logo FROM company ORDER BY name;            |
| /companies/websites                    | GET         | READ        | Get all company names, logos, and websites                  | SELECT id, name, logo, website FROM company ORDER BY name;   |
| /companies?...                         | POST        | CREATE      | Add a company                                               |                                                              |
| /companies/<company_id>                | GET         | READ        | Get company info by `company_id`                            | SELECT * FROM company WHERE id = `company_id`;               |
| /companies/<company_id>?...            | PUT         | UPDATE      | Update company info by `company_id`                         |                                                              |
| /companies/<company_id>                | DELETE      | DELETE      | Delete a company by `company_id`                            |                                                              |
| /companies/<company_id>/events         | GET         | READ        | Get all events associated with a given company              | SELECT event_id FROM event_company WHERE company_id = `company_id`; |
| /companies/<company_id>/positions      | GET         | READ        | Get all positions a given company is hiring                 | SELECT position_id FROM company_position WHERE company_id = `company_id`; |
| /companies/<company_id>/positions?pid= | POST        | CREATE      | Add a position that a given company is hiring               |                                                              |
| /companies/<company_id>/positions?pid= | DELETE      | DELETE      | Delete a position from those that a given company is hiring |                                                              |
| /companies/<company_id>/majors         | GET         | READ        | Get all majors a given company is hiring                    | SELECT major_id FROM company_major WHERE company_id = `company_id`; |
| /companies/<company_id>/majors?mid=    | POST        | CREATE      | Add a major that a given company is hiring                  |                                                              |
| /companies/<company_id>/majors?mid=    | DELETE      | DELETE      | Delete a major from those that a given company is hiring    |                                                              |
| /companies/<company_id>/contacts       | GET         | READ        | Get all contacts for a given company                        | SELECT contact_id FROM company_contact WHERE company_id = `company_id`; |
| /companies/<company_id>/users          | GET         | READ        | Get all users interested in a given company                 | SELECT user_id FROM user_company_rank WHERE company_id = `company_id`; |
| /companies/search?term=                | GET         | READ        | Get all companies containing `term` substring in their name | SELECT id FROM company WHERE name ILIKE '%`term`%';          |
| /companies/filter?pid=                 | GET         | READ        | Get all companies hiring a specific position                | SELECT company_id FROM company_position WHERE position_id = `pid`; |
| /companies/filter?mid=                 | GET         | READ        | Get all companies hiring a specific major                   | SELECT company_id FROM company_major WHERE major_id = `mid`; |
| TODO                                   |             |             |                                                             |                                                              |



##### Events API

| Endpoint                                    | HTTP Method | CRUD Method | Result                                                       | DB Query                                                     |
| ------------------------------------------- | ----------- | ----------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| /events/ping                                | GET         | READ        | `pong` - Sanity Check                                        | -                                                            |
| /events                                     | GET         | READ        | Get all events                                               | SELECT fb_id FROM event;                                     |
| /events?...                                 | POST        | CREATE      | Add a single event                                           |                                                              |
| /events/names                               | GET         | READ        | Get all event names                                          | SELECT fb_id, name FROM event;                               |
| /events/locations                           | GET         | READ        | Get all unique event locations                               | SELECT  DISTINCT location_id FROM event ORDER BY location_id; |
| /events/<event_id>                          | GET         | READ        | Get event by `event_id`                                      | SELECT * FROM event WHERE fb_id = `event_id`;                |
| /events/<event_id>?...                      | PUT         | UPDATE      | Update a single event by `event_id`                          |                                                              |
| /events/<event_id>                          | DELETE      | DELETE      | Delete a single event by `event_id`                          |                                                              |
| /events/<event_id>/favorites                | GET         | READ        | Get all users that have favorited the given event            | SELECT user_id FROM favorite_events WHERE event_id = `event_id`; |
| /events/<event_id>/register                 | GET         | READ        | Get all users registered to a given event                    | SELECT user_id FROM event_registration WHERE event_id = `event_id`; |
| /events/<event_id>/register?paid=           | GET         | READ        | Get all users that registered and have `paid` or not `paid` for a given event | SELECT user_id FROM event_registration WHERE event_id = `event_id` AND has_paid = `paid`; |
| /events/<event_id>/register/<user_id>?paid= | POST        | CREATE      | Register a user for a given event                            |                                                              |
| /events/<event_id>/register/<user_id>?paid= | PUT         | UPDATE      | Update user registration for an event                        |                                                              |
| /events/<event_id>/register/<user_id>       | DELETE      | DELETE      | Delete user registration for an event                        |                                                              |
| /events/<event_id>/checkin                  | GET         | READ        | Get all users checked in to a given event                    | SELECT user_id FROM event_checkin WHERE event_id = `event_id`; |
| /events/<event_id>/checkin/<user_id>        | POST        | CREATE      | Check in a user for an event                                 |                                                              |
| /events/<event_id>/checkin/<user_id>        | DELETE      | DELETE      | Delete check in for a user for an event                      |                                                              |
| /events/<event_id>/host                     | GET         | READ        | Get all hosts for a given event                              | SELECT host_id FROM event_host WHERE event_id = `event_id`;  |
| /events/<event_id>/host/<user_id>           | POST        | CREATE      | Add a user as a host for a given event                       |                                                              |
| /events/<event_id>/host/<user_id>           | DELETE      | DELETE      | Delete a host for a given event                              |                                                              |
| /events/<event_id>/companies                | GET         | READ        | Get all companies for a given event                          | SELECT company_id FROM event_company WHERE event_id = `event_id`; |
| /events/<event_id>/companies/<company_id>   | POST        | CREATE      | Add a company for a given event                              |                                                              |
| /events/<event_id>/companies/<company_id>   | DELETE      | DELETE      | Delete a company for a given event                           |                                                              |
| /events/<event_id>/categories               | GET         | READ        | Get all categories for a given event                         | SELECT category_id FROM event_category WHERE event_id = `event_id`; |
| /events/<event_id>/categories/<category_id> | POST        | CREATE      | Add a category for a given event                             |                                                              |
| /events/<event_id>/categories/<category_id> | DELETE      | DELETE      | Delete a category for a given event                          |                                                              |
| /events/search?term=                        | GET         | READ        | Get all events containing `term` substring                   | SELECT fb_id FROM event WHERE name ILIKE '%`term`%';         |
| /events/filter?date=                        | GET         | READ        | Get all events on a given `date`                             | SELECT fb_id FROM event WHERE date(starts_at) <= `date` AND `date` <= date(ends_at); |
| /events/filter?month=                       | GET         | READ        | Get all events in a given `month`                            | SELECT fb_id FROM event WHERE EXTRACT(MONTH FROM starts_at) = `month` OR EXTRACT(MONTH FROM ends_at) = `month`; |
| /events/filter?year=                        | GET         | READ        | Get all events in a given calendar `year`                    | SELECT fb_id FROM event WHERE EXTRACT(YEAR FROM starts_at) = `year` OR EXTRACT(YEAR FROM ends_at) = `year`; |
| /events/filter?quarter=                     | GET         | READ        | Get all events in a given academic `quarter`                 | SELECT fb_id FROM event WHERE quarter = `quarter`;           |
| /events/filter?start_date=                  | GET         | READ        | Get all events starting on or after given `start_date`       | SELECT fb_id FROM event WHERE starts_at >= `start_date`;     |
| /events/filter?end_date=                    | GET         | READ        | Get all events starting before given `end_date`              | SELECT fb_id FROM event WHERE ends_at < `end_date`;          |
| /events/filter?category=                    | GET         | READ        | Get all events of a given `category`                         | SELECT event_id FROM event_category WHERE category_id = `category`; |
| /events/filter?company=                     | GET         | READ        | Get all events associated with a given `company`             | SELECT event_id FROM event_company WHERE company_id = `company`; |
| /events/filter?featured=                    | GET         | READ        | Get all `featured` events                                    | SELECT fb_id FROM event WHERE is_featured = `featured`;      |
| /events/filter?past=                        | GET         | READ        | Get all `past` events                                        | SELECT fb_id FROM event WHERE ends_at < now();               |
| TODO                                        |             |             |                                                              |                                                              |



##### Users API

| Endpoint                             | HTTP Method | CRUD Method | Result                                                   | DB Query                                                     |
| ------------------------------------ | ----------- | ----------- | -------------------------------------------------------- | ------------------------------------------------------------ |
| /users/ping                          | GET         | READ        | `pong` - Sanity Check                                    | -                                                            |
| /users                               | GET         | READ        | Get all user info                                        | SELECT id FROM swe_user;                                     |
| /users/names                         | GET         | READ        | Get all user names                                       | SELECT CONCAT(first_name, ' ', last_name) FROM swe_user;     |
| /users/emails                        | GET         | READ        | Get all user emails                                      | SELECT email FROM swe_user;                                  |
| /users/ids                           | GET         | READ        | Get all user university IDs                              | SELECT university_id FROM swe_user;                          |
| /users/register?...                  | POST        | CREATE      | Add a user                                               |                                                              |
| /users/login?...                     | PUT         | UPDATE      | Log in a user                                            |                                                              |
| /users/<user_id>                     | GET         | READ        | Get user info by `user_id`                               | SELECT * FROM swe_user WHERE id = `user_id`;                 |
| /users/<user_id>/admin               | GET         | READ        | Get whether user is admin or not                         | SELECT is_admin FROM swe_user WHERE id = `user_id`;          |
| /users/<user_id>?...                 | PUT         | UPDATE      | Update user info                                         |                                                              |
| /users/<user_id>/past                | GET         | READ        | Get a user's past events                                 | SELECT event_id FROM event_checkin INNER JOIN event ON event_checkin.event_id = event.fb_id WHERE event_checkin.user_id = 3 AND event.ends_at < now() UNION SELECT event_id FROM event_registration INNER JOIN event ON event_registration.event_id = event.fb_id WHERE event_registration.user_id = 3 AND event.ends_at < now(); |
| /users/<user_id>/companies           | GET         | READ        | Get all companies a user is interested in                | SELECT company_id, rank FROM user_company_rank WHERE user_id = `user_id`; |
| /users/<user_id>/events              | GET         | READ        | Get all events a user is attending                       | SELECT event_id FROM event_checkin WHERE user_id = `user_id` UNION SELECT event_id FROM event_registration WHERE user_id = `user_id`; |
| /users/<user_id>/host                | GET         | READ        | Get all events a user is hosting                         | SELECT event_id FROM event_host WHERE user_id = `user_id`;   |
| /users/<user_id>/majors              | GET         | READ        | Get all the user's majors                                | SELECT major_id FROM user_major WHERE user_id = `user_id`;   |
| /users/<user_id>/positions           | GET         | READ        | Get all positions a user is seeking                      | SELECT position_id FROM user_position WHERE user_id = `user_id`; |
| /users/<user_id>/occupations         | GET         | READ        | Get all the user's occupations                           | SELECT occupation_id FROM user_occupation WHERE user_id = `user_id`; |
| /users/<user_id>/diet                | GET         | READ        | Get the user's diet information                          | SELECT diet_id FROM user_diet WHERE user_id = `user_id`;     |
| /users/<user_id>/favorite            | GET         | READ        | Get a user's favorite events                             | SELECT event_id FROM favorite_events WHERE user_id = `user_id`; |
| /users/<user_id>/favorite/<event_id> | POST        | CREATE      | Add a favorite event to a user                           |                                                              |
| /users/<user_id>/favorite/<event_id> | DELETE      | DELETE      | Delete a favorite event from a user                      |                                                              |
| /users/search?name=                  | GET         | READ        | Get all users whose names contain the substring `name`   | SELECT id FROM swe_user WHERE CONCAT(first_name, ' ', last_name) ILIKE '%`name`%'; |
| /users/search?email=                 | GET         | READ        | Get all users whose emails contain the substring `email` | SELECT id FROM swe_user WHERE email ILIKE '%`email`%';       |
| /users/filter?cid=                   | GET         | READ        | Get all users interested in a given `company`            | SELECT user_id FROM user_company_rank WHERE company_id = `cid`; |
| /users/filter?oid=                   | GET         | READ        | Get all users of the given `occupation`                  | SELECT user_id FROM user_occupation WHERE occupation_id = `oid`; |
| /users/filter?mid=                   | GET         | READ        | Get all users of the given `major`                       | SELECT user_id FROM user_major WHERE major_id = `mid`;       |
| /users/filter?pid=                   | GET         | READ        | Get all users seeking the given `position`               | SELECT user_id FROM user_position WHERE position_id = `pid`; |
| /users/filter?admin=                 | GET         | READ        | Get all admin users                                      | SELECT id FROM swe_user WHERE is_admin = `admin`;            |
| TODO                                 |             |             |                                                          |                                                              |



##### Misc. API

| Endpoint                         | HTTP Method | CRUD Method | Result                     | DB Query                   |
| -------------------------------- | ----------- | ----------- | -------------------------- | -------------------------- |
| /majors                          | GET         | READ        | Get all majors             | SELECT id FROM major;      |
| /majors/names                    | GET         | READ        | Get all major names        | SELECT name FROM major;    |
| /majors?...                      | POST        | CREATE      | Add a single major         |                            |
| /majors/<major_id>?...           | PUT         | UPDATE      | Update a single major      |                            |
| /majors/<major_id>               | DELETE      | DELETE      | Delete a single major      |                            |
| /uclamajors                      | GET         | READ        | Get all UCLA majors        | SELECT id FROM ucla_major; |
| /uclamajors?...                  | POST        | CREATE      | Add a single UCLA major    |                            |
| /uclamajors/<major_id>?...       | PUT         | UPDATE      | Update a single UCLA major |                            |
| /uclamajors/<major_id>           | DELETE      | DELETE      | Delete a single UCLA major |                            |
| /positions                       | GET         | READ        | Get all positions          | SELECT id FROM position;   |
| /positions?...                   | POST        | CREATE      | Add a single positions     |                            |
| /positions/<position_id>?...     | PUT         | UPDATE      | Update a single position   |                            |
| /positions/<position_id>         | DELETE      | DELETE      | Delete a single position   |                            |
| /occupations                     | GET         | READ        | Get all occupations        | SELECT id FROM occupation; |
| /occupations?...                 | POST        | CREATE      | Add a single occupation    |                            |
| /occupations/<occupation_id>?... | PUT         | UPDATE      | Update a single occupation |                            |
| /occupations/<occupation_id>     | DELETE      | DELETE      | Delete a single occupation |                            |
| /diet                            | GET         | READ        | Get all diet types         | SELECT id FROM diet;       |
| /diet?...                        | POST        | CREATE      | Add a single diet type     |                            |
| /diet/<diet_id>?...              | PUT         | UPDATE      | Update a single diet type  |                            |
| /diet/<diet_id>                  | DELETE      | DELETE      | Delete a single diet type  |                            |
| /contacts                        | GET         | READ        | Get all contacts           | SELECT id FROM contact;    |
| /contacts?...                    | POST        | CREATE      | Add a single contact       |                            |
| /contacts/<contact_id>?...       | PUT         | UPDATE      | Update a single contact    |                            |
| /contacts/<contact_id>           | DELETE      | DELETE      | Delete a single contact    |                            |
| /locations                       | GET         | READ        | Get all locations          | SELECT id FROM location;   |
| /locations/names                 | GET         | READ        | Get all location names     | SELECT name FROM location; |
| /locations?...                   | POST        | CREATE      | Add a single location      |                            |
| /locations/<location_id>?...     | PUT         | UPDATE      | Update a single location   |                            |
| /locations/<location_id>         | DELETE      | DELETE      | Delete a single location   |                            |
| /addresses                       | GET         | READ        | Get all addresses          | SELECT id FROM address;    |
| /addresses/names                 | GET         | READ        | Get all address names      | SELECT name FROM address;  |
| /addresses?...                   | POST        | CREATE      | Add a single address       |                            |
| /addresses/<address_id>?...      | PUT         | UPDATE      | Update a single address    |                            |
| /addresses/<address_id>          | DELETE      | DELETE      | Delete a single address    |                            |
| /categories                      | GET         | READ        | Get all categories         | SELECT id FROM category;   |
| /categories?...                  | POST        | CREATE      | Add a single category      |                            |
| /categories/<category_id>?...    | PUT         | UPDATE      | Update a single category   |                            |
| /categories/<category_id>        | DELETE      | DELETE      | Delete a single category   |                            |
