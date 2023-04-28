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

// POST REQUESTS :
// ----------------------------------------------------------------------------------------------------------------


//1. post req for sign up
router.post("/signup", (req, res) => {

    const userID = req.body.id;
    const username = req.body.username;
    const profilepicpath = "";
    db.query('select * from user_details where userID = $1', [userID], (err, result) => {
        if (err) {
            console.log(err);
        }
        if(result.rows.length==0){
            db.query('INSERT INTO user_details (userID,username,profilepicpath) VALUES ($1,$2,$3)', [userID,username,profilepicpath], (err, result) => {
                if (err) {
                    console.log(err);
                }
                else {
                    res.send(req.body);
                }
            });
        }
        else{
            res.send(req.body);
        }
    });
});


2. // 	Add post to the database

router.post("/user/post", (req, res) => {

    const userID = req.body.userId;
    const postDescr = req.body.postDesc;
    const postDate = new Date();
    const postImgPath = "";

    db.query('INSERT INTO post (userID,postDescr,postDate,postImgPath) VALUES ($1, $2, $3,$4)', [userID, postDescr, postDate, postImgPath], (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            // send the postID of the post inserted as response

            var final = {
            userId : userID,
            postDesc : postDescr

          }
          res.send(final);
        }
    });
});

// 3. Add subscription to the database
router.post("/user/subscription", (req, res) => {
    
    // const subscriptionID = req.body.subscriptionID;
     const mentorID = req.body.mentorId;
     const subscriptionTitle = req.body.title;
     const subscriptionDesc = req.body.subsDesc;
     const category = req.body.category;
     const price = 100;

 
     db.query('INSERT INTO subscription (mentorID,title,subsDescr,catagory,price) VALUES ($1, $2, $3, $4, $5)', [mentorID,subscriptionTitle,subscriptionDesc,category,price], (err, result) => {
         if (err) {
             console.log(err);
         }
         else{
             var final = {
                mentorId : mentorID,
                title : subscriptionTitle,
                subsDesc : subscriptionDesc,
                category : category,
             }

            res.send(final);
         }
     });
     
 });

// ----------------------------------------------------------------------------------------------------------------



// GET REQUESTS :
// ----------------------------------------------------------------------------------------------------------------

//1. send all posts 
router.get("/post", (req, res) => {
    db.query('SELECT * FROM post,user_details where post.userID = user_details.userID ORDER BY postDate', (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result.rows);
    });
});

//2. send all posts of a particular user

router.get("/post/:user_id", (req, res) => {
    const user_id = req.params.user_id;
    db.query('SELECT * FROM post WHERE userID = $1', [user_id], (err, result) => {
        if (err) {
            console.log(err);
        }
        
    });
});

// 3. send all subscriptions
router.get("/subscription/all/:userid", (req, res) => {
    const user = req.params.userid;
    db.query('SELECT mentorID as mentorId,title,catagory as category,subsDescr as subsDesc,price,username as mentorname,ProfilePicPath as mentorProfileImagePath  FROM subscription,user_details where mentorID = userID and mentorID <> $1', [user], (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result.rows);
    });
});

// 4.1. send all subscriptions created by a particular user

router.get("/subscription/:userid", (req, res) => {
    const userID = req.params.userid;
    db.query('SELECT mentorID as mentorId,title,catagory as category,subsDescr as subsDesc,price FROM subscription where mentorid = $1',[userID], (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result.rows);
    });
});

// 4.2.	Returns subscriptions of taken by user

router.get("/subscription/taken/:user_id", (req, res) => {
    const user_id = req.params.user_id;
    db.query('SELECT * FROM subscription where subscriptionID IN (SELECT subscriptionID FROM user_subscription WHERE userID = $1)', [user_id], (err, result) => {
        if (err) {
            // console.log(err);
            console.log(result);
        }
       
        res.send(result.rows);
    });
});


// 5. send all catagories and exercises under those catagories

router.get("/exercise", async (req, res) => {
    var final = {
        "categories": [],
        "exercises": []
    }


    var result = await db.query('SELECT DISTINCT s_title FROM exercise_set');
    for(var i=0;i<result.rows.length;i++){
        final.categories.push(result.rows[i].s_title);
        var result2 = await db.query('SELECT * FROM exercise WHERE title IN (SELECT e_title FROM exercise_set where s_title = $1)', [result.rows[i].s_title]);
        var ex = [];
        for(var j=0;j<result2.rows.length;j++){
            
            var exercise_title = result2.rows[j].title;
            ex.push(exercise_title);
        }
        final.exercises.push(ex);
    }
    res.send(final);
});

// 6. send for a particular exercise (title, steps, duration, gifpath)

router.get("/exercise/:title", (req,res) => {
    const title = req.params.title;
    console.log(title);
    db.query('SELECT * FROM exercise WHERE title = $1', [title], (err, result) => {
        if (err) {
            console.log(err);
        }
        console.log(result.rows);
        res.send(result.rows[0]);
    });
    
});

// ----------------------------------------------------------------------------------------------------------------


// GET/POST REQUESTS HELPFUL IN FUTURE:

// ->	Add subscription taken by user to the database and 
//      Create a conversation between mentor and user


// router.post("/user/subscription/insert", (req, res) => {

//     const subscriptionID = req.body.subscriptionID;
//     const userID = req.body.userID;
//     var default_rating = 5;

//     db.query('INSERT INTO user_subscription (subscriptionID,userID,userRating) VALUES ($1, $2,$3)', [subscriptionID, userID, default_rating], (err, result) => {
//         if (err) {
//             console.log(err);
//         }
//         else {
//             // find mentorID from subscriptionID
//             console.log("subscribed");
//             db.query('SELECT mentorID FROM subscription WHERE subscriptionID = $1', [subscriptionID], (err, result) => {
//                 if (err) {
//                     console.log(err);
//                 }
//                 else {
//                     const mentorID = result.rows[0].mentorID;
//                     // create conversation between mentor and user
//                     db.query('INSERT INTO conversation (mentorID,userID) VALUES ($1, $2)', [mentorID, userID], (err, result) => {
//                         if (err) {
//                             console.log(err);
//                         }
//                         else {
//                             res.send('conversation created successfully b/w', mentorID, 'and', userID);
//                         }
//                     });
//                 }
//             });

//         }
//     });

// });


// -> User Profile

// 	->Returns comments of the post
// router.get("/post/comments/:post_id", (req, res) => {
//     const post_id = req.params.post_id;
//     db.query('SELECT * FROM comment WHERE postID = $1', [post_id], (err, result) => {
//         if (err) {
//             console.log(err);
//         }
//         res.send(result.rows);
//     });
// });


// ->	Returns conversations of the user

// router.get("/chat/chats/:user_id", (req, res) => {
//     const user_id = req.params.user_id;
//     db.query('SELECT * FROM conversation WHERE userID1 = $1 or userID2 = $1', [user_id], (err, result) => {
//         if (err) {
//             console.log(err);
//         }
//         res.send(result.rows);
//     });
// });

// ->Returns messages of the conversation
// router.get("/chat/conversation/:conversation_id", (req, res) => {
//     const conversation_id = req.params.conversation_id;
//     db.query('SELECT * FROM message WHERE conversationID = $1 order by messageDate', [conversation_id], (err, result) => {
//         if (err) {
//             console.log(err);
//         }
//         res.send(result.rows);
//     });
// });

// ->Add message of a convo to the database


// router.post("/chat/conversation.sendmessage", (req, res) => {
//     const conversationID = req.body.conversationID;
//     const userID = req.body.userID;
//     const messageDesc = req.body.messageDesc;
//     const messageDate = new Date();

//     db.query('INSERT INTO message (conversationID,userID,messageDesc,messageDate) VALUES ($1, $2, $3, $4)', [conversationID, userID, messageDesc, messageDate], (err, result) => {
//         if (err) {
//             console.log(err);
//         }
//         else {
//             res.send('message inserted successfully');
//         }
//     });

// });


// 6. Post


// ->Add like to the database

// router.post("user/post/like", (req, res) => {
//     const postID = req.body.postID;
//     const userID = req.body.userID;

//     db.query('INSERT INTO likes (postID,userID) VALUES ($1, $2)', [postID, userID], (err, result) => {
//         if (err) {
//             console.log(err);
//         }
//         else {
//             res.send('like inserted successfully');
//         }
//     });
// });

// ->Add comment to the database

// router.post("/user/post/comment", (req, res) => {
//     const postID = req.body.postID;
//     const userID = req.body.userID;
//     const commentDescr = req.body.commentDescr;
//     const commentDate = new Date();

//     db.query('INSERT INTO comment (postID,userID,commentDescr,commentDate) VALUES ($1, $2, $3, $4)', [postID, userID, commentDescr, commentDate], (err, result) => {
//         if (err) {
//             console.log(err);
//         }
//         else {
//             res.send('comment inserted successfully');
//         }
//     });
// });


// ----------------------------------------------------------------------------------------------------------------


module.exports = router;

