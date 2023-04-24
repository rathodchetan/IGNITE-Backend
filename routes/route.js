const express = require('express');
const db = require('../services/db_connection');
const router = express.Router()

// db = require('../services/db_connection');

router.get('/up', (req, res) => {
    res.send('API is up and running')
});

router.get("/db", (req, res) => {
    db.query('SELECT * FROM test', (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result.rows);
    });
});

// /api/user/:user_id : 
// Returns {
// user_name, emailID, profilePic }

router.get("/user/:user_id", (req, res) => {
    const user_id = req.params.user_id;
    db.query('SELECT * FROM user_details WHERE userID = $1', [user_id], (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result.rows);  
    });
});

// /api/post/user_details/:user_id:
// 	Returns {Post_id, post_image, post_description,Date_time,count_of_likes}

router.get("/post/user_details/:user_id", (req, res) => {
    const user_id = req.params.user_id;
    db.query('SELECT * FROM post WHERE userID = $1', [user_id], (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result.rows);
    });
});

// /api/post/comments/:post_id:
// 	returns {Comment_desc, comment_date, comment_id, user_id}

router.get("/post/comments/:post_id", (req, res) => {
    const post_id = req.params.post_id;
    db.query('SELECT * FROM comment WHERE postID = $1', [post_id], (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result.rows);
    });
});

// /api/subscription/:user_id:
// 	Subscription_title, subscription_desc, category, price, count_of_userid, list_of_uid,

router.get("/subscription/:user_id", (req, res) => {
    const user_id = req.params.user_id;
    db.query('SELECT * FROM subscription where subscriptionID IN (SELECT subscriptionID FROM user_subscription WHERE userID = $1)', [user_id], (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result.rows);
    });
});


// /api/home: 
//     return Post_id, post_image, post_description,Date_time,count_of_likes,

router.get("/home", (req, res) => {
    db.query('SELECT TOP 12 * FROM post ORDER BY postDate', (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result.rows);
    });
});

// /api/exercise : Return s_title .

router.get("/exercise", (req, res) => {
    db.query('SELECT DISTINCT s_title FROM exercise_set', (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result.rows);
    });
});

// /api/exercise/:set_name: return - list(title, steps, duration, gif(binary data))

//  Binary data needs to be handled!
router.get("/exercise/:set_name", (req, res) => {
    const set_name = req.params.set_name;
    db.query('SELECT * FROM exercise_set WHERE s_title = $1', [set_name], (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result.rows);
    });
});

//  /api/chat/chats/:user_id : 
//  return all conversation_id , user_id

router.get("/chat/chats/:user_id", (req, res) => {
    const user_id = req.params.user_id;
    db.query('SELECT * FROM conversation WHERE userID1 = $1 or userID2 = $1' , [user_id], (err, result) => {
         if (err) {
            console.log(err);
        }
        res.send(result.rows);
    });
});

// /api/chat/conversation/:conversation_id : return : messageDesc, messageDate

router.get("/chat/conversation/:conversation_id", (req, res) => {
    const conversation_id = req.params.conversation_id;
    db.query('SELECT * FROM message WHERE conversationID = $1 order by messageDate', [conversation_id], (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result.rows);
    });
});


// /api/subscription/ :  returns {catagories of subscription}

router.get("/subscription/", (req, res) => {
    db.query('SELECT DISTINCT category FROM subscription', (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result.rows);
    });
});

// /api/subsciption/:category: subscription_id, subscription_desc, mentor_id, category, price, rating.

router.get("/subscription/:category", (req, res) => {
    const category = req.params.category;
    db.query('SELECT * FROM subscription WHERE category = $1 order by rating', [category], (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result.rows);
    });
});


module.exports = router;

