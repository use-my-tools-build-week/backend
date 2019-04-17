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
        "id": 553,
        "created_at": "2019-04-16T18:29:47.875Z",
        "updated_at": "2019-04-16T18:29:47.875Z",
        "user_id": 802,
        "target_user_id": 815
      },
      {
        "id": 994,
        "created_at": "2019-04-16T18:29:47.875Z",
        "updated_at": "2019-04-16T18:29:47.875Z",
        "user_id": 802,
        "target_user_id": 823
      }
    ]
    ```

**Create Favorite**
----
Creates a favorite

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
  target_user_id=[integer]
  ```

  **Example Body**
  ```json
  {
    "target_user_id": "815"
  }
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
          "param": "target_user_id",
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

