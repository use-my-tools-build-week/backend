**Condition Endpoints**
----

**List Conditions**
----
Responds with an array of conditions

* **URL**

  /conditions

* **Method:**

  `GET`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**
    ```json
      [
        {
          "id": 1,
          "created_at": "2019-04-17T08:12:28.229Z",
          "updated_at": "2019-04-17T08:12:28.229Z",
          "name": "Excellent",
          "img_url": "http://lorempixel.com/400/400/abstract",
          "user_id": 39
        },
        {
          "id": 2,
          "created_at": "2019-04-17T08:12:28.229Z",
          "updated_at": "2019-04-17T08:12:28.229Z",
          "name": "Okay",
          "img_url": "http://lorempixel.com/400/400/abstract",
          "user_id": 122
        },
        {
          "id": 3,
          "created_at": "2019-04-17T08:12:28.229Z",
          "updated_at": "2019-04-17T08:12:28.229Z",
          "name": "Well Used",
          "img_url": "http://lorempixel.com/400/400/abstract",
          "user_id": 104
        },
        {
          "id": 4,
          "created_at": "2019-04-17T08:12:28.229Z",
          "updated_at": "2019-04-17T08:12:28.229Z",
          "name": "Ancient",
          "img_url": "http://lorempixel.com/400/400/abstract",
          "user_id": 121
        }
      ]
    ```
