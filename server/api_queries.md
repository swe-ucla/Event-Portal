## MVP API Endpoints

##### Companies API

| Endpoint                               | HTTP Method | CRUD Method | Result                                                      | DB Query                                                   |
| -------------------------------------- | ----------- | ----------- | ----------------------------------------------------------- | ---------------------------------------------------------- |
| /companies/ping                        | GET         | READ        | `pong` - Sanity Check                                       | -                                                          |
| /companies                             | GET         | READ        | Get all companies' info                                     | SELECT * FROM company;                                     |
| /companies/names                       | GET         | READ        | Get all company names                                       | SELECT id, name FROM company ORDER BY name;                |
| /companies/logos                       | GET         | READ        | Get all company names and logos                             | SELECT id, name, logo FROM company ORDER BY name;          |
| /companies/websites                    | GET         | READ        | Get all company names, logos, and websites                  | SELECT id, name, logo, website FROM company ORDER BY name; |
| /companies?...                         | POST        | CREATE      | Add a company                                               |                                                            |
| /companies/<company_id>                | GET         | READ        | Get company info by `company_id`                            |                                                            |
| /companies/<company_id>?...            | PUT         | UPDATE      | Update company info by `company_id`                         |                                                            |
| /companies/<company_id>                | DELETE      | DELETE      | Delete a company by `company_id`                            |                                                            |
| /companies/<company_id>/events         | GET         | READ        | Get all events associated with a given company              |                                                            |
| /companies/<company_id>/positions      | GET         | READ        | Get all positions a given company is hiring                 |                                                            |
| /companies/<company_id>/positions?pid= | POST        | CREATE      | Add a position that a given company is hiring               |                                                            |
| /companies/<company_id>/positions?pid= | DELETE      | DELETE      | Delete a position from those that a given company is hiring |                                                            |
| /companies/<company_id>/majors         | GET         | READ        | Get all majors a given company is hiring                    |                                                            |
| /companies/<company_id>/majors?mid=    | POST        | CREATE      | Add a major that a given company is hiring                  |                                                            |
| /companies/<company_id>/majors?mid=    | DELETE      | DELETE      | Delete a major from those that a given company is hiring    |                                                            |
| /companies/<company_id>/contacts       | GET         | READ        | Get all contacts for a given company                        |                                                            |
| /companies/<company_id>/users          | GET         | READ        | Get all users interested in a given company                 |                                                            |
| /companies/search?term=                | GET         | READ        | Get all companies containing `term` substring in their name |                                                            |
| /companies/filter?position=            | GET         | READ        | Get all companies hiring a specific `position`              |                                                            |
| /companies/filter?major=               | GET         | READ        | Get all companies hiring a specific `major`                 |                                                            |
| TODO                                   |             |             |                                                             |                                                            |



##### Events API

| Endpoint                                    | HTTP Method | CRUD Method | Result                                                       | DB Query |
| ------------------------------------------- | ----------- | ----------- | ------------------------------------------------------------ | -------- |
| /events/ping                                | GET         | READ        | `pong` - Sanity Check                                        | -        |
| /events                                     | GET         | READ        | Get all events                                               |          |
| /events?...                                 | POST        | CREATE      | Add a single event                                           |          |
| /events/names                               | GET         | READ        | Get all event names                                          |          |
| /events/locations                           | GET         | READ        | Get all unique event locations                               |          |
| /events/<event_id>                          | GET         | READ        | Get event by `event_id`                                      |          |
| /events/<event_id>?...                      | PUT         | UPDATE      | Update a single event by `event_id`                          |          |
| /events/<event_id>                          | DELETE      | DELETE      | Delete a single event by `event_id`                          |          |
| /events/<event_id>/favorites                | GET         | READ        | Get all users that have favorited the given event            |          |
| /events/<event_id>/register                 | GET         | READ        | Get all users registered to a given event                    |          |
| /events/<event_id>/register?paid=           | GET         | READ        | Get all users that registered and have `paid` or not `paid` for a given event |          |
| /events/<event_id>/register/<user_id>?paid= | POST        | CREATE      | Register a user for a given event                            |          |
| /events/<event_id>/register/<user_id>?paid= | PUT         | UPDATE      | Update user registration for an event                        |          |
| /events/<event_id>/register/<user_id>       | DELETE      | DELETE      | Delete user registration for an event                        |          |
| /events/<event_id>/checkin                  | GET         | READ        | Get all users checked in to a given event                    |          |
| /events/<event_id>/checkin/<user_id>        | POST        | CREATE      | Check in a user for an event                                 |          |
| /events/<event_id>/checkin/<user_id>        | DELETE      | DELETE      | Delete check in for a user for an event                      |          |
| /events/<event_id>/host                     | GET         | READ        | Get all hosts for a given event                              |          |
| /events/<event_id>/host/<user_id>           | POST        | CREATE      | Add a user as a host for a given event                       |          |
| /events/<event_id>/host/<user_id>           | DELETE      | DELETE      | Delete a host for a given event                              |          |
| /events/<event_id>/companies                | GET         | READ        | Get all companies for a given event                          |          |
| /events/<event_id>/companies/<company_id>   | POST        | CREATE      | Add a company for a given event                              |          |
| /events/<event_id>/companies/<company_id>   | DELETE      | DELETE      | Delete a company for a given event                           |          |
| /events/<event_id>/categories               | GET         | READ        | Get all categories for a given event                         |          |
| /events/<event_id>/categories/<category_id> | POST        | CREATE      | Add a category for a given event                             |          |
| /events/<event_id>/categories/<category_id> | DELETE      | DELETE      | Delete a category for a given event                          |          |
| /events/search?term=                        | GET         | READ        | Get all events containing `term` substring                   |          |
| /events/filter?date=                        | GET         | READ        | Get all events on a given `date`                             |          |
| /events/filter?month=                       | GET         | READ        | Get all events in a given `month`                            |          |
| /events/filter?year=                        | GET         | READ        | Get all events in a given calendar `year`                    |          |
| /events/filter?quarter=                     | GET         | READ        | Get all events in a given academic `quarter`                 |          |
| /events/filter?start_date=                  | GET         | READ        | Get all events starting on or after given `start_date`       |          |
| /events/filter?end_date=                    | GET         | READ        | Get all events starting before given `end_date`              |          |
| /events/filter?category=                    | GET         | READ        | Get all events of a given `category`                         |          |
| /events/filter?company=                     | GET         | READ        | Get all events associated with a given `company`             |          |
| /events/filter?featured=                    | GET         | READ        | Get all `featured` events                                    |          |
| /events/filter?past=                        | GET         | READ        | Get all `past` events                                        |          |
| TODO                                        |             |             |                                                              |          |



##### Users API

| Endpoint                             | HTTP Method | CRUD Method | Result                                                   | DB Query |
| ------------------------------------ | ----------- | ----------- | -------------------------------------------------------- | -------- |
| /users/ping                          | GET         | READ        | `pong` - Sanity Check                                    | -        |
| /users                               | GET         | READ        | Get all user info                                        |          |
| /users/names                         | GET         | READ        | Get all user names                                       |          |
| /users/emails                        | GET         | READ        | Get all user emails                                      |          |
| /users/ids                           | GET         | READ        | Get all user university IDs                              |          |
| /users/register?...                  | POST        | CREATE      | Add a user                                               |          |
| /users/login?...                     | PUT         | UPDATE      | Log in a user                                            |          |
| /users/<user_id>                     | GET         | READ        | Get user info by `user_id`                               |          |
| /users/<user_id>/admin               | GET         | READ        | Get whether user is admin or not                         |          |
| /users/<user_id>?...                 | PUT         | UPDATE      | Update user info                                         |          |
| /users/<user_id>/past                | GET         | READ        | Get a user's past events                                 |          |
| /users/<user_id>/companies           | GET         | READ        | Get all companies a user is interested in                |          |
| /users/<user_id>/events              | GET         | READ        | Get all events a user is attending                       |          |
| /users/<user_id>/host                | GET         | READ        | Get all events a user is hosting                         |          |
| /users/<user_id>/majors              | GET         | READ        | Get all the user's majors                                |          |
| /users/<user_id>/positions           | GET         | READ        | Get all positions a user is seeking                      |          |
| /users/<user_id>/occupations         | GET         | READ        | Get all the user's occupations                           |          |
| /users/<user_id>/diet                | GET         | READ        | Get the user's diet information                          |          |
| /users/<user_id>/favorite            | GET         | READ        | Get a user's favorite events                             |          |
| /users/<user_id>/favorite/<event_id> | POST        | CREATE      | Add a favorite event to a user                           |          |
| /users/<user_id>/favorite/<event_id> | DELETE      | DELETE      | Delete a favorite event from a user                      |          |
| /users/search?name=                  | GET         | READ        | Get all users whose names contain the substring `name`   |          |
| /users/search?email=                 | GET         | READ        | Get all users whose emails contain the substring `email` |          |
| /users/filter?company=               | GET         | READ        | Get all users interested in a given `company`            |          |
| /users/filter?occupation=            | GET         | READ        | Get all users of the given `occupation`                  |          |
| /users/filter?major=                 | GET         | READ        | Get all users of the given `major`                       |          |
| /users/filter?position=              | GET         | READ        | Get all users seeking the given `position`               |          |
| /users/filter?admin=                 | GET         | READ        | Get all admin users                                      |          |
| TODO                                 |             |             |                                                          |          |



##### Misc. API

| Endpoint                         | HTTP Method | CRUD Method | Result                     | DB Query |
| -------------------------------- | ----------- | ----------- | -------------------------- | -------- |
| /majors                          | GET         | READ        | Get all majors             |          |
| /majors/names                    | GET         | READ        | Get all major names        |          |
| /majors?...                      | POST        | CREATE      | Add a single major         |          |
| /majors/<major_id>?...           | PUT         | UPDATE      | Update a single major      |          |
| /majors/<major_id>               | DELETE      | DELETE      | Delete a single major      |          |
| /uclamajors                      | GET         | READ        | Get all UCLA majors        |          |
| /uclamajors?...                  | POST        | CREATE      | Add a single UCLA major    |          |
| /uclamajors/<major_id>?...       | PUT         | UPDATE      | Update a single UCLA major |          |
| /uclamajors/<major_id>           | DELETE      | DELETE      | Delete a single UCLA major |          |
| /positions                       | GET         | READ        | Get all positions          |          |
| /positions?...                   | POST        | CREATE      | Add a single positions     |          |
| /positions/<position_id>?...     | PUT         | UPDATE      | Update a single position   |          |
| /positions/<position_id>         | DELETE      | DELETE      | Delete a single position   |          |
| /occupations                     | GET         | READ        | Get all occupations        |          |
| /occupations?...                 | POST        | CREATE      | Add a single occupation    |          |
| /occupations/<occupation_id>?... | PUT         | UPDATE      | Update a single occupation |          |
| /occupations/<occupation_id>     | DELETE      | DELETE      | Delete a single occupation |          |
| /diet                            | GET         | READ        | Get all diet types         |          |
| /diet?...                        | POST        | CREATE      | Add a single diet type     |          |
| /diet/<diet_id>?...              | PUT         | UPDATE      | Update a single diet type  |          |
| /diet/<diet_id>                  | DELETE      | DELETE      | Delete a single diet type  |          |
| /contacts                        | GET         | READ        | Get all contacts           |          |
| /contacts?...                    | POST        | CREATE      | Add a single contact       |          |
| /contacts/<contact_id>?...       | PUT         | UPDATE      | Update a single contact    |          |
| /contacts/<contact_id>           | DELETE      | DELETE      | Delete a single contact    |          |
| /locations                       | GET         | READ        | Get all locations          |          |
| /locations/names                 | GET         | READ        | Get all location names     |          |
| /locations?...                   | POST        | CREATE      | Add a single location      |          |
| /locations/<location_id>?...     | PUT         | UPDATE      | Update a single location   |          |
| /locations/<location_id>         | DELETE      | DELETE      | Delete a single location   |          |
| /addresses                       | GET         | READ        | Get all addresses          |          |
| /addresses/names                 | GET         | READ        | Get all address names      |          |
| /addresses?...                   | POST        | CREATE      | Add a single address       |          |
| /addresses/<address_id>?...      | PUT         | UPDATE      | Update a single address    |          |
| /addresses/<address_id>          | DELETE      | DELETE      | Delete a single address    |          |
| /categories                      | GET         | READ        | Get all categories         |          |
| /categories?...                  | POST        | CREATE      | Add a single category      |          |
| /categories/<category_id>?...    | PUT         | UPDATE      | Update a single category   |          |
| /categories/<category_id>        | DELETE      | DELETE      | Delete a single category   |          |
