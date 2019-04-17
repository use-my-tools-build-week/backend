**Tool Endpoints**
----

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
          "img_url": "http://lorempixel.com/400/400/technics",
          "user_id": 919,
          "category_id": 41,
          "condition_id": 14
      },
    ]
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
  img_url=[string, url]
  category_id=[integer]
  condition_id=[integer]
  ```

  **Example Body**
  ```json
  {
    "name": "test tool"
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
      "img_url": null,
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
    "name": "test tool2"
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
      "img_url": null,
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
      "img_url": null,
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
      "img_url": null,
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

