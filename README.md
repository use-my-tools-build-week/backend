**API Documentation**
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

**List Tools**
----
Responds with an array of tools

* **URL**

  /tools

* **Method:**

  `GET`

* **URL Params**

  **Optional:**
  ```
  search=[string of search terms]
  ```

  **Example**
  ```
  /tools?search=some+tool
  ```

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**
    ```json
    [
      {
          "id": 1075,
          "created_at": "2019-04-16T18:29:47.659Z",
          "updated_at": "2019-04-16T18:29:47.659Z",
          "name": "Awesome Soft Gloves",
          "image_url": "http://lorempixel.com/400/400/technics",
          "user_id": 919,
          "category_id": 41,
          "condition_id": 14
      },
    }
    ```

**Create Tool**
----
Creates a tool

* **URL**

  /tools

* **Method:**

  `POST`

* **Headers**

  **Required:**
  ```
  Authorization=[string, valid token]
  ```

* **Data Params**

  **Required:**
  ```
  name=[string]
  ```

  **Optional:**
  ```
  image_url=[string, url]
  category_id=[integer]
  condition_id=[integer]
  ```

  **Example Body**
  ```json
  {
    name="test tool"
  }
  ```

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**
    ```json
    {
      "id": 2075,
      "created_at": "2019-04-16T19:46:07.532Z",
      "updated_at": "2019-04-16T19:46:07.532Z",
      "name": "test tool",
      "image_url": null,
      "user_id": 802,
      "category_id": null,
      "condition_id": null
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
          "param": "name",
          "value": "test tool",
          "msg": "name already in use"
        }
      ]
    }
    ```

**Update Tool**
----
Updates a tool

* **URL**

  /tools/:tool_id

  **Example**

  `/tools/1`

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
  name=[string]
  category_id=[integer]
  condition_id=[integer]
  ```

  **Optional:**
  ```
  name=[string]
  category_id=[integer]
  condition_id=[integer]
  ```

  **Example Body**
  ```json
  {
    name="test tool2"
  }
  ```

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**
    ```json
    {
      "id": 2076,
      "created_at": "2019-04-16T20:02:21.071Z",
      "updated_at": "2019-04-16T20:02:21.071Z",
      "name": "test tool2",
      "image_url": null,
      "user_id": 802,
      "category_id": null,
      "condition_id": null
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
          "param": "name",
          "value": "test tool",
          "msg": "name already in use"
        }
      ]
    }
    ```

**Show Tool**
----
Responds with one tool including reviews and loan requests

* **URL**

  /tools/:tool_id

  **Example**

  `/tools/1`

* **Method:**

  `GET`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**
    ```json
    {
      "id": 2076,
      "created_at": "2019-04-16T20:02:21.071Z",
      "updated_at": "2019-04-16T20:02:21.071Z",
      "name": "test tool2",
      "image_url": null,
      "user_id": 802,
      "category_id": null,
      "condition_id": null
    }
    ```
* **Error Response:**

  * **Code:** 404 NOT FOUND <br />
    **Content:**
    ```json
    {
      "errors": [
         {
             "msg": "Tool not found"
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
**Delete Tool**
----
Responds with one tool including reviews and loan requests

* **URL**

  /tools/:tool_id

  **Example**

  `/tools/1`

* **Method:**

  `DELETE`

* **Headers**

  **Required:**
  ```
  Authorization=[string, valid token]
  ```
* **Success Response:**

  * **Code:** 200 <br />
    **Content:**
    ```json
    {
      "id": 2076,
      "created_at": "2019-04-16T20:02:21.071Z",
      "updated_at": "2019-04-16T20:02:21.071Z",
      "name": "deleted tool",
      "image_url": null,
      "user_id": 802,
      "category_id": null,
      "condition_id": null
    }
    ```
* **Error Response:**

  * **Code:** 404 NOT FOUND <br />
    **Content:**
    ```json
    {
      "errors": [
         {
             "msg": "Tool not found"
         }
      ]
    }
    ```

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:**
    ```json
    {
      "errors": [
         {
             "msg": "Unauthorized"
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
