const express = require('express');
const db = require('../services/db_connection');
const router = express.Router()
const fs = require('fs');

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

router.get("/user/details/:user_id", (req, res) => {
    const user_id = req.params.user_id;
    db.query('SELECT * FROM user_details WHERE userID = $1', [user_id], (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result.rows);
    });
});

// router.post for inserting values into user details table

router.post("/signup", (req, res) => {

    const userID = req.body.id;
    const response = {
        status: "success",
    }
    console.log(req.body)
    db.query('INSERT INTO user_details (userID) VALUES ($1)', [userID], (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send(response);
        }
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

// /api/user/post/
// Add post to the database

router.post("/user/post", (req, res) => {

    const userID = req.body.userID;
    const postDescr = req.body.postDescr;
    const postDate = new Date();

    db.query('INSERT INTO post (userID,postDescr,postDate) VALUES ($1, $2, $3)', [userID, postDescr, postDate], (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            // send the postID of the post inserted as response
            db.query('SELECT postID FROM post WHERE userID = $1 AND postDescr = $2 AND postDate = $3', [userID, postDescr, postDate], (err, result) => {
                if (err) {
                    console.log(err);
                }
                res.send(result.rows);
            });
        }
    });
});


// /api/post/like/
// Add like to the database

router.post("user/post/like", (req, res) => {
    const postID = req.body.postID;
    const userID = req.body.userID;

    db.query('INSERT INTO likes (postID,userID) VALUES ($1, $2)', [postID, userID], (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send('like inserted successfully');
        }
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

// api/user/post/comment/
// Add comment to the database

router.post("/user/post/comment", (req, res) => {
    const postID = req.body.postID;
    const userID = req.body.userID;
    const commentDescr = req.body.commentDescr;
    const commentDate = new Date();

    db.query('INSERT INTO comment (postID,userID,commentDescr,commentDate) VALUES ($1, $2, $3, $4)', [postID, userID, commentDescr, commentDate], (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send('comment inserted successfully');
        }
    });
});


// /api/subscription/:user_id:
// 	Subscription_title, subscription_desc, category, price, count_of_userid, list_of_uid,

router.get("/subscription", (req, res) => {
    db.query('SELECT * FROM subscription', (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result.rows);
    });
});

router.get("/subscription/:user_id", (req, res) => {
    const user_id = req.params.user_id;
    db.query('SELECT * FROM subscription where subscriptionID IN (SELECT subscriptionID FROM user_subscription WHERE userID = $1)', [user_id], (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result.rows);
    });
});

// /api/user/subscription/
// 	Add subscription to the database

router.post("/user/subscription", (req, res) => {

    // const subscriptionID = req.body.subscriptionID;
    const mentorID = req.body.mentorid;
    const subscriptionTitle = req.body.title;
    const subscriptionDesc = req.body.subsdescr;
    const category = req.body.catagory;
    const price = req.body.price;

    db.query('INSERT INTO subscription (mentorID,title,subsDescr,catagory,price) VALUES ($1, $2, $3, $4, $5)', [mentorID, subscriptionTitle, subscriptionDesc, category, price], (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send('subscription inserted successfully');
        }
    });

});

// /api/user/subscription/insert
// 	Add subscription taken by user to the database

router.post("/user/subscription/insert", (req, res) => {

    const subscriptionID = req.body.subscriptionID;
    const userID = req.body.userID;
    var default_rating = 5;

    db.query('INSERT INTO user_subscription (subscriptionID,userID,userRating) VALUES ($1, $2,$3)', [subscriptionID, userID, default_rating], (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            // find mentorID from subscriptionID
            console.log("subscribed");
            db.query('SELECT mentorID FROM subscription WHERE subscriptionID = $1', [subscriptionID], (err, result) => {
                if (err) {
                    console.log(err);
                }
                else {
                    const mentorID = result.rows[0].mentorID;
                    // create conversation between mentor and user
                    db.query('INSERT INTO conversation (mentorID,userID) VALUES ($1, $2)', [mentorID, userID], (err, result) => {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            res.send('conversation created successfully b/w', mentorID, 'and', userID);
                        }
                    });
                }
            });

        }
    });

});


// /api/home: 
//     return Post_id, post_image, post_description,Date_time,count_of_likes,

router.get("/home", (req, res) => {
    db.query('SELECT* FROM post ORDER BY postDate', (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result.rows);
    });
});

// /api/exercise : Return s_title,all exercises .

router.get("/exercise", async (req, res) => {
    var final = {
        "categories": [],
        "exercises": []
    }

    var exercise = {
        "title": "",
        "steps": "",
        "duration": "",
        "gifpath": ""
    }

    var result = await db.query('SELECT DISTINCT s_title FROM exercise_set');
    for (var i = 0; i < result.rows.length; i++) {
        final.categories.push(result.rows[i].s_title);
        var result2 = await db.query('SELECT * FROM exercise WHERE title IN (SELECT e_title FROM exercise_set where s_title = $1)', [result.rows[i].s_title]);
        var ex = [];
        for (var j = 0; j < result2.rows.length; j++) {
            exercise.title = result2.rows[j].title;
            exercise.steps = result2.rows[j].steps;
            exercise.duration = result2.rows[j].duration;
            exercise.gifpath = result2.rows[j].gifpath;
            ex.push(exercise);
        }
        final.exercises.push(ex);
    }
    res.send(final);
});

// router.get("/exercise", (req, res) => {
//     db.query('SELECT DISTINCT s_title FROM exercise_set', (err, result) => {
//         if (err) {
//             console.log(err);
//         }
//         res.send(result.rows);
//     });
// });

// // /api/exercise/:set_name: return - list(title, steps, duration, gif(binary data))

// router.get("/exercise/:set_name", (req,res) => {
//     const set_name = req.params.set_name;
//     db.query('SELECT * FROM exercise WHERE title IN (SELECT e_title FROM exercise_set where s_title = $1)', [set_name], (err, result) => {
//         if (err) {
//             console.log(err);
//         }
//         res.send(result.rows);
//     });
// });


//  /api/chat/chats/:user_id : 
//  return all conversation_id , user_id

router.get("/chat/chats/:user_id", (req, res) => {
    const user_id = req.params.user_id;
    db.query('SELECT * FROM conversation WHERE userID1 = $1 or userID2 = $1', [user_id], (err, result) => {
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

// /api/chat/conversation/sendmessage : send message to the database
// add message to the database

router.post("/chat/conversation.sendmessage", (req, res) => {
    const conversationID = req.body.conversationID;
    const userID = req.body.userID;
    const messageDesc = req.body.messageDesc;
    const messageDate = new Date();

    db.query('INSERT INTO message (conversationID,userID,messageDesc,messageDate) VALUES ($1, $2, $3, $4)', [conversationID, userID, messageDesc, messageDate], (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send('message inserted successfully');
        }
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

