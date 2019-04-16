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
        "image_url": "http://lorempixel.com/400/400/abstract",
        "user_id": 950
      },
      {
        "id": 38,
        "created_at": "2019-04-16t18:29:47.646z",
        "updated_at": "2019-04-16t18:29:47.646z",
        "name": "lawncare",
        "image_url": "http://lorempixel.com/400/400/abstract",
        "user_id": 826
      },
    ]
    ```

**Create Category**
----
Creates a category

* **URL**

  /categories

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
  ```

  **Example Body**
  ```json
  {
    "name": "test category"
  }
  ```

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**
    ```json
    {
      "id": 38,
      "created_at": "2019-04-16T18:29:47.646Z",
      "updated_at": "2019-04-16T18:29:47.646Z",
      "name": "lawncare",
      "image_url": "http://lorempixel.com/400/400/abstract",
      "user_id": 826
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
          "value": "test category",
          "msg": "name already in use"
        }
      ]
    }
    ```
