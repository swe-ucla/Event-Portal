# Postgres Database



## Overview

TODO: the databases

TODO: Amazon RDS for PostgreSQL??



## TODO: Database Schemas

each table created_at and updated_at datetime columns

![image-20190122071122253](../../../Library/Application Support/typora-user-images/image-20190122071122253.png)

##### Companies Table

| ID   | Name   | Website        | Contact Email     | US Citizenship Required | Description                                                  | Logo               | Misc. |
| ---- | ------ | -------------- | ----------------- | ----------------------- | ------------------------------------------------------------ | ------------------ | ----- |
| 0    | Google | www.google.com | google@google.com | N                       | Organize the world's information and make it universally accessible and useful. | https://linktologo |       |
| 1    | Boeing | www.boeing.com | boeing@boeing.com | Depends on position     | People working together as a global enterprise for aerospace industry leadership. | https://linktologo |       |



#### Major Table

| ID   | Major       |
| ---- | ----------- |
| 0    | CS          |
| 1    | Aerospace E |



##### Position Table

| ID   | Position  |
| ---- | --------- |
| 0    | Intern    |
| 1    | Co-op     |
| 2    | Full-time |



##### Company Majors Table

| Company ID | Major ID |
| ---------- | -------- |
| 2          | 1        |
| 4          | 1        |



##### Company Positions Table

| Company ID | Position ID |
| ---------- | ----------- |
| 1          | 1           |
| 1          | 2           |
| 2          | 1           |



##### User Majors Table

| Company ID | Major ID |
| ---------- | -------- |
| 2          | 1        |
| 4          | 1        |



##### User Positions Table

| Company ID | Position ID |
| ---------- | ----------- |
| 1          | 1           |
| 1          | 2           |
| 2          | 1           |



##### Events Table (Including Featured/Past Events)

| ID   | Name    | FB Event            | Host     | Host Email        | Location                                  | Date    | Start Time | End Time | Description   | Category     | Picture               |
| ---- | ------- | ------------------- | -------- | ----------------- | ----------------------------------------- | ------- | ---------- | -------- | ------------- | ------------ | --------------------- |
| 0    | Fall GM | https://linktoevent | Jane Doe | janedoe@gmail.com | Boelter Penthouse (JSON of location data) | 9/30/18 | 5 PM       | 7 PM     | UCLA SWE's GM | Club, Social | https://linktopicture |

TODO: Locations DB? Add to DB if not already present



##### Event Companies Table

| Event ID | Company ID |
| -------- | ---------- |
| 0        | 1          |
| 0        | 3          |
| 3        | 1          |



##### Event Check In Table

| Event ID | User ID | Checked In | Last Updated    |
| -------- | ------- | ---------- | --------------- |
| 1        | 0       | Y          | 4/20/18 4:20 PM |



##### Featured Event Registration Table

| Event ID | User ID | Paid | TODO |
| -------- | ------- | ---- | ---- |
| 2        | 4       | N    |      |



##### User Featured Event Companies Table

| Event ID | User ID | Company ID | Preference Rank |
| -------- | ------- | ---------- | --------------- |
| 2        | 1       | 4          | 2               |
| 4        | 1       | 2          | 1               |
| 5        | 5       | 1          | 3               |



##### Users Table

| ID   | First Name | Last Name | Email             | Major | Year   | Password | Dietary Restrictions | Admin | Last Active     | Time Joined    |
| ---- | ---------- | --------- | ----------------- | ----- | ------ | -------- | -------------------- | ----- | --------------- | -------------- |
| 0    | Jane       | Doe       | janedoe@gmail.com | CS    | Junior | password | N/A                  | Y     | 4/20/18 4:20 PM | 1/1/18 5:00 PM |



##### User Companies Table

| User ID | Company ID |
| ------- | ---------- |
| 3       | 1          |
| 3       | 2          |
| 4       | 5          |
