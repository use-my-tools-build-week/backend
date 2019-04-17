**Tool Endpoints**
----

**List Tools**
----
Responds with an array of tools

* **URL**

  /tools

* **Method:**

  `GET`

* **Headers**

  **Required:**
  ```
  Authorization=[string, valid token]

* **URL Params**

  **Optional:**
  ```
  search=[string of search terms]
  limit=[integer]
  page=[integer]
  ```

  **Example**
  ```
  /tools?search=some+tool
  ```

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**
    ```json
    {
      "total": 12639,
      "per_page": "1",
      "offset": 0,
      "to": 1,
      "last_page": 12639,
      "current_page": 1,
      "from": 0,
      "results": [
        {
          "id": 797,
          "distance": 1,
          "description": "Omnis esse nam. Est numquam et.",
          "created_at": "2019-04-17T08:12:28.269Z",
          "updated_at": "2019-04-17T08:12:28.269Z",
          "name": "Practical Soft Car",
          "img_url": "http://lorempixel.com/400/400/technics",
          "user_id": 83,
          "category_id": 4,
          "condition_id": 3,
          "firstname": "Lawrence",
          "lastname": "Raynor",
          "loaner_img_url": "https://s3.amazonaws.com/uifaces/faces/twitter/kanickairaj/128.jpg",
          "category_name": "Air Tools",
          "condition_name": "Well Used",
          "is_favorited": 0,
          "is_requested": 0
        }
      ]
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
      "total": 12639,
      "per_page": "1",
      "offset": 0,
      "to": 1,
      "last_page": 12639,
      "current_page": 1,
      "from": 0,
      "results": [
        {
          "id": 797,
          "distance": 1,
          "description": "Omnis esse nam. Est numquam et.",
          "created_at": "2019-04-17T08:12:28.269Z",
          "updated_at": "2019-04-17T08:12:28.269Z",
          "name": "Practical Soft Car",
          "img_url": "http://lorempixel.com/400/400/technics",
          "user_id": 83,
          "category_id": 4,
          "condition_id": 3,
          "firstname": "Lawrence",
          "lastname": "Raynor",
          "loaner_img_url": "https://s3.amazonaws.com/uifaces/faces/twitter/kanickairaj/128.jpg",
          "category_name": "Air Tools",
          "condition_name": "Well Used",
          "is_favorited": 0,
          "is_requested": 0
        }
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
      "id": 1001,
      "distance": 560,
      "description": null,
      "created_at": "2019-04-17T17:13:29.100Z",
      "updated_at": "2019-04-17T17:13:29.100Z",
      "name": "test tool",
      "img_url": null,
      "user_id": 4,
      "category_id": null,
      "condition_id": null,
      "firstname": "Jeremie",
      "lastname": "testname",
      "loaner_img_url": "https://s3.amazonaws.com/uifaces/faces/twitter/antongenkin/128.jpg",
      "category_name": null,
      "condition_name": null,
      "is_favorited": 0,
      "is_requested": 0
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
      "id": 1,
      "distance": 225,
      "description": "Aut dolor laborum perspiciatis earum laboriosam quis. Recusandae eos quidem est aut officiis aut. Deserunt tenetur explicabo sunt.",
      "created_at": "2019-04-17T08:12:28.269Z",
      "updated_at": "2019-04-17T08:12:28.269Z",
      "name": "Generic Fresh Hat",
      "img_url": "http://lorempixel.com/400/400/technics",
      "user_id": 142,
      "category_id": 5,
      "condition_id": 3,
      "firstname": "Caden",
      "lastname": "Conroy",
      "loaner_img_url": "https://s3.amazonaws.com/uifaces/faces/twitter/greenbes/128.jpg",
      "category_name": "Automotive",
      "condition_name": "Well Used",
      "is_favorited": 0,
      "is_requested": 0
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
      "id": 1,
      "distance": 225,
      "description": "Aut dolor laborum perspiciatis earum laboriosam quis. Recusandae eos quidem est aut officiis aut. Deserunt tenetur explicabo sunt.",
      "created_at": "2019-04-17T08:12:28.269Z",
      "updated_at": "2019-04-17T08:12:28.269Z",
      "name": "Generic Fresh Hat",
      "img_url": "http://lorempixel.com/400/400/technics",
      "user_id": 142,
      "category_id": 5,
      "condition_id": 3,
      "firstname": "Caden",
      "lastname": "Conroy",
      "loaner_img_url": "https://s3.amazonaws.com/uifaces/faces/twitter/greenbes/128.jpg",
      "category_name": "Automotive",
      "condition_name": "Well Used",
      "is_favorited": 0,
      "is_requested": 0
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

