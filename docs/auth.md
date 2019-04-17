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
  img_url=[string]
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
      "id": 4,
      "created_at": "2019-04-17T08:12:28.179Z",
      "updated_at": "2019-04-17T08:12:28.179Z",
      "firstname": "Jeremie",
      "lastname": "testname",
      "username": "Emiliano_Kunze",
      "email": "valid@email.com",
      "address": "84786 Jillian Village Lodge Keonland KS",
      "img_url": "https://s3.amazonaws.com/uifaces/faces/twitter/antongenkin/128.jpg",
      "loan_range": 8,
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
        "id": 4,
        "created_at": "2019-04-17T08:12:28.179Z",
        "updated_at": "2019-04-17T08:12:28.179Z",
        "firstname": "Jeremie",
        "lastname": "testname",
        "username": "Emiliano_Kunze",
        "email": "test3@test.com",
        "address": "84786 Jillian Village Lodge Keonland KS",
        "img_url": "https://s3.amazonaws.com/uifaces/faces/twitter/antongenkin/128.jpg",
        "loan_range": 8,
        "token": "auth token",
        "categories": [
          {
            "id": 1,
            "created_at": "2019-04-17T08:12:28.234Z",
            "updated_at": "2019-04-17T08:12:28.234Z",
            "name": "Lawn and Garden",
            "img_url": "http://lorempixel.com/400/400/abstract",
            "blurb": "Make that yard beautiful!",
            "user_id": 69
          },
        ],
        "conditions": [
          {
            "id": 1,
            "created_at": "2019-04-17T08:12:28.229Z",
            "updated_at": "2019-04-17T08:12:28.229Z",
            "name": "Excellent",
            "img_url": "http://lorempixel.com/400/400/abstract",
            "user_id": 39
          },
        ]
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

