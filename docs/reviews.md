**Review Endpoints**
----

**Create Review**
----
Creates a review

* **URL**

  /reviews

* **Method:**

  `POST`

* **Headers**

  **Required:**
  ```
  Authorization=[string, valid token]
  ```

* **Data Params**

  **Required:**
  `tool_id=[integer]`

  **(At least one of these):**
  ```
  message=[string]
  score=[integer, min=1, max=5]
  ```

  **Optional:**
  ```
  message=[string]
  score=[integer, min=1, max=5]
  ```

  **Example Body**
  ```json
  {
    "tool_id": 1,
    "message": "test review",
    "score": 5
  }
  ```

* **Success Response:**

  * **Code:** 201 <br />
    **Content:**
    ```json
    {
      "id": 2006,
      "created_at": "2019-04-16T21:15:50.400Z",
      "updated_at": "2019-04-16T21:15:50.400Z",
      "user_id": 802,
      "tool_id": 1080,
      "message": "test review",
      "score": 5
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
          "value": "test review",
          "msg": "error msg"
        }
      ]
    }
    ```

**Update Review**
----
Updates a review

* **URL**

  /reviews/:review_id

  **Example**

  `/reviews/1`

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
  message=[string]
  score=[string]
  ```

  **Optional:**
  ```
  message=[string]
  score=[string]
  ```

  **Example Body**
  ```json
  {
    "message": "test review2"
  }
  ```

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**
    ```json
    {
      "id": 2006,
      "created_at": "2019-04-16T21:15:50.400Z",
      "updated_at": "2019-04-16T21:15:50.400Z",
      "user_id": 802,
      "tool_id": 1080,
      "message": "test review2",
      "score": 5
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
          "param": "message",
          "value": "test review",
          "msg": "error message"
        }
      ]
    }
    ```

**Delete Review**
----
Responds with one review including reviews and loan requests

* **URL**

  /reviews/:review_id

  **Example**

  `/reviews/1`

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
      "id": 2006,
      "created_at": "2019-04-16T21:15:50.400Z",
      "updated_at": "2019-04-16T21:15:50.400Z",
      "user_id": 802,
      "tool_id": 1080,
      "message": "test review",
      "score": null
    }
    ```
* **Error Response:**

  * **Code:** 404 NOT FOUND <br />
    **Content:**
    ```json
    {
      "errors": [
         {
             "msg": "Review not found"
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

