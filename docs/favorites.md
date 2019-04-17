**Favorite Endpoints**
----

**List Favorites**
----
Responds with an array of favorites

* **URL**

  /favorites

* **Method:**

  `GET`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**
    ```json
    [
      {
        "id": 343,
        "created_at": "2019-04-17T08:12:28.515Z",
        "updated_at": "2019-04-17T08:12:28.515Z",
        "user_id": 4,
        "tool_id": 506,
        "name": "Licensed Fresh Computer",
        "distance": 163,
        "tool_img_url": "http://lorempixel.com/400/400/technics",
        "'condition'": "Ancient",
        "condition_id": 4,
        "condition_img_url": "http://lorempixel.com/400/400/abstract",
        "category": "Lawn and Garden",
        "category_id": 1,
        "category_img_url": "http://lorempixel.com/400/400/abstract",
        "loaner_id": 12,
        "firstname": "Abdul",
        "lastname": "Waelchi",
        "loaner_img_url": "https://s3.amazonaws.com/uifaces/faces/twitter/m_kalibry/128.jpg"
      }
    ]
    ```

**Create Favorite**
----
Creates a favorite if one doesn't exist

* **URL**

  /favorites

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
  tool_id=[integer]
  ```

  **Example Body**
  ```json
  {
    "tool_id": "815"
  }
  ```

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**
    ```json
    {
      "id": 343,
      "created_at": "2019-04-17T08:12:28.515Z",
      "updated_at": "2019-04-17T08:12:28.515Z",
      "user_id": 4,
      "tool_id": 506,
      "name": "Licensed Fresh Computer",
      "distance": 163,
      "tool_img_url": "http://lorempixel.com/400/400/technics",
      "'condition'": "Ancient",
      "condition_id": 4,
      "condition_img_url": "http://lorempixel.com/400/400/abstract",
      "category": "Lawn and Garden",
      "category_id": 1,
      "category_img_url": "http://lorempixel.com/400/400/abstract",
      "loaner_id": 12,
      "firstname": "Abdul",
      "lastname": "Waelchi",
      "loaner_img_url": "https://s3.amazonaws.com/uifaces/faces/twitter/m_kalibry/128.jpg"
    }
    ```

* **Error Response:**

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:**
    ```json
    {
      "errors": [
         {
             "msg": "Unauthorized."
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
          "param": "tool_id",
          "value": "bad id",
          "msg": "Invalid value"
        }
      ]
    }
    ```

**Delete Favorite**
----
Responds with one favorite including reviews and loan requests

* **URL**

  /favorites/:favorite_id

  **Example**

  `/favorites/1`

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
      "id": 553,
      "created_at": "2019-04-16T18:29:47.875Z",
      "updated_at": "2019-04-16T18:29:47.875Z",
      "user_id": 802,
      "target_user_id": 815
    }
    ```
* **Error Response:**

  * **Code:** 404 NOT FOUND <br />
    **Content:**
    ```json
    {
      "errors": [
         {
             "msg": "Favorite not found"
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

