**User Endpoints**
----

**List Users**
----
Responds with an array of users

* **URL**

  /users

* **Method:**

  `GET`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**
    ```json
    [
      {
        "id": 801,
        "created_at": "2019-04-16T18:29:47.584Z",
        "updated_at": "2019-04-16T18:29:47.584Z",
        "firstname": Montana,
        "lastname": Hand,
        "username": "Montana.Hand",
        "email": "test0@test.com",
        "address": "4794 Jayde Rapids Crossing West Everardo NY",
        "loan_range": 72
      },
    ]
    ```

**Update User**
----
Updates a user

* **URL**

  /users/:user_id

  **Example**

  `/users/1`

* **Method:**

  `POST`

* **Headers**

  **Required:**
  ```
  Authorization=[string, valid token]
  ```
* **Data Params**

  **Required (At Least One Of):**
  ```
  email=[string, email format]
  firstname=[string]
  lastname=[string]
  loan_range=[integer]
  address=[address string]
  ```

  **Example Body**
  ```json
  {
    "firstname": "test user2"
  }
  ```

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**
    ```json
    {
      "id": 801,
      "created_at": "2019-04-16T18:29:47.584Z",
      "updated_at": "2019-04-16T18:29:47.584Z",
      "firstname": Montana,
      "lastname": Hand,
      "username": "test user2",
      "email": "test0@test.com",
      "address": "4794 Jayde Rapids Crossing West Everardo NY",
      "loan_range": 72
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
          "param": "firstname",
          "value": "test user2",
          "msg": "name already in use"
        }
      ]
    }
    ```

**Show User**
----
Responds with one user including reviews and loan requests

* **URL**

  /users/:user_id

  **Example**

  `/users/1`

* **Method:**

  `GET`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**
    ```json
    {
      "id": 801,
      "created_at": "2019-04-16T18:29:47.584Z",
      "updated_at": "2019-04-16T18:29:47.584Z",
      "firstname": Montana,
      "lastname": Hand,
      "username": "Montana.Hand",
      "email": "test0@test.com",
      "address": "4794 Jayde Rapids Crossing West Everardo NY",
      "loan_range": 72
    }
    ```
* **Error Response:**

  * **Code:** 404 NOT FOUND <br />
    **Content:**
    ```json
    {
      "errors": [
         {
             "msg": "User not found"
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
          "location": "params",
          "param": "id",
          "value": "test",
          "msg": "Invalid value"
        }
      ]
    }
    ```
