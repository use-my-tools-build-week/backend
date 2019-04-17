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
        "total": 200,
        "per_page": "1",
        "offset": 0,
        "to": 1,
        "last_page": 200,
        "current_page": 1,
        "from": 0,
        "results": [
          {
            "id": 1,
            "created_at": "2019-04-17T08:12:28.179Z",
            "updated_at": "2019-04-17T08:12:28.179Z",
            "firstname": "Maurine",
            "lastname": "Rath",
            "username": "Giuseppe_Jacobs",
            "img_url": "https://s3.amazonaws.com/uifaces/faces/twitter/iduuck/128.jpg"
          }
        ]
      }
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

  `PUT`

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
  img_url=[string]
  username=[string]
  ```

  **Example Body**
  ```json
  {
    "firstname": "testname"
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
      "loan_range": 8
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
      "id": 1,
      "created_at": "2019-04-17T08:12:28.179Z",
      "updated_at": "2019-04-17T08:12:28.179Z",
      "firstname": "Maurine",
      "lastname": "Rath",
      "username": "Giuseppe_Jacobs",
      "img_url": "https://s3.amazonaws.com/uifaces/faces/twitter/iduuck/128.jpg",
      "tools": [array of tools TODO]
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
