**Category Endpoints**
----

**List Categories**
----
Responds with an array of categories

* **URL**

  /categories

* **Method:**

  `GET`

* **URL Params**

  **Optional:**
  ```
  search=[string of search terms]
  ```

  **Example**
  ```
  /categories?search=some+category
  ```

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**
    ```json
    [
      {
        "id": 37,
        "created_at": "2019-04-16t18:29:47.646z",
        "updated_at": "2019-04-16t18:29:47.646z",
        "name": "treework",
        "img_url": "http://lorempixel.com/400/400/abstract",
        "user_id": 950
      },
      {
        "id": 38,
        "created_at": "2019-04-16t18:29:47.646z",
        "updated_at": "2019-04-16t18:29:47.646z",
        "name": "lawncare",
        "img_url": "http://lorempixel.com/400/400/abstract",
        "user_id": 826
      },
    ]
    ```

**Show Category**
----
Shows a category

* **URL**

  /categories/:category_id

  **Example**

  /categories/1

* **Method:**

  `GET`

* **Headers**

  **Required:**
  ```
  Authorization=[string, valid token]
  ```

* **URL Params**

  **Optional:**
  ```
  page=[integer, tools page number]
  limit=[integer, number of tools]
  ```

  **Example Body**
  ```json
  /api/categories/1?limit=1
  ```

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**
    ```json
    {
      "id": 1,
      "created_at": "2019-04-17T08:12:28.234Z",
      "updated_at": "2019-04-17T08:12:28.234Z",
      "name": "Lawn and Garden",
      "img_url": "http://lorempixel.com/400/400/abstract",
      "blurb": "Make that yard beautiful!",
      "user_id": 69,
      "tools": {
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
            "description": "Omnis esse nam. Est numquam et. Dolor cupiditate facere quaerat placeat distinctio ducimus.",
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
    }
    ```

* **Error Response:**

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
          "location": "body",
          "param": "id",
          "value": "test category",
          "msg": "Invalid input"
        }
      ]
    }
    ```
