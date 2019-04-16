**Authentication Endpoints**
----

**Register**
----
Registers one user given a valid email address and password.

* **URL**

  /register

* **Method:**

  `POST`

* **Data Params**

  **Required:**
  ```
  email=[valid email format]
  password=[string, min-length: 5]
  ```

  **Optional:**<br>
  ```
  firstname=[string, max-length: 128]
  lastname=[string, max-length: 128]
  loan_range=[number of miles]
  address=[string]
  ```
  **Example Body**
  ```json
  {
    "email": "valid@email.com",
    "password": "password"
  }
  ```

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**
    ```json
    {
      "id": 1,
      "created_at": "2019-04-15T19:39:35.396Z",
      "updated_at": "2019-04-15T19:39:35.396Z",
      "firstname": "first name",
      "lastname": "last name",
      "username": "user name",
      "email": "valid@email.com",
      "address": "address",
      "loan_range": "range in miles",
      "token": "tokenstring"
    }
    ```

* **Error Response:**

  * **Code:** 422 UNPROCESSABLE ENTITY <br />
    **Content:** object containing array of validation errors
    ```json
    {
      "errors": [
          {
              "location": "body",
              "param": "email",
              "value": "not$a@valid_email.c0m",
              "msg": "Invalid value"
          }
      ]
    }
    ```

**Login**
----
Generates an Authentication token given valid email and password.

* **URL**

  /login

* **Method:**

  `POST`

* **Data Params**

  **Required:**
  ```
  email=[valid email format]
  password=[string, min-length: 5]
  ```

  **Example Body**
  ```json
  {
    "email": "valid@email.com",
    "password": "password"
  }
  ```

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**
    ```json
    {
      "id": 1,
      "created_at": "2019-04-15T20:27:48.555Z",
      "updated_at": "2019-04-15T20:27:48.555Z",
      "firstname": "firstname",
      "lastname": "lastname",
      "username": "username",
      "email": "valid@email.com",
      "address": "address",
      "loan_range": "loan range",
      "token": "token string"
    }
    ```

* **Error Response:**

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:**
    ```json
    {
      "errors": [
          {
              "msg": "Invalid credentials."
          }
      ]
    }
    ```

  * **Code:** 422 UNPROCESSABLE ENTITY <br />
    **Content:**
    ```json
    {
      "errors": [
          {
              "location": "body",
              "param": "email",
              "msg": "Invalid value"
          }
      ]
    }
    ```

