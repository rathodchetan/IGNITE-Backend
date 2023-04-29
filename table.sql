create table  user_details
(
    userID varchar(50) not null,
    userName varchar(50) not null,
    profilePicPath varchar(50),
    primary key (userID)
);

create table exercise
(
    title varchar(50) not null,
    steps varchar(1000) not null,
    duration varchar(10) not null,
    gifPath varchar(100) not null,
    primary key (title)
);

create table exercise_set
(
    s_title varchar(50) not null,
    e_title varchar(50) not null,
    s_desc varchar(1000) not null,
    primary key (s_title, e_title),
    foreign key (e_title) references exercise(title) on delete cascade
);

create table subscription
(
    subscriptionID SERIAL PRIMARY KEY,
    mentorID varchar(50) not null,
    title varchar(50) not null,
    catagory varchar(50) not null,
    subsDescr varchar(1000) not null,
    price decimal(10,2) not null,
    foreign key (mentorID) references   user_details(userID) on delete cascade
);

create table user_subscription
(
    userID varchar(50) not null,
    subscriptionID INTEGER not null,
    userRating decimal(10,2),       --default null
    primary key (userID, subscriptionID),
    foreign key (userID) references   user_details(userID) on delete cascade,
    foreign key (subscriptionID) references subscription(subscriptionID) on delete cascade
);

create table post
(
    postID SERIAL PRIMARY KEY,
    userID varchar(50) not null,
    postImgPath varchar(50),
    postDescr varchar(1000) not null,
    postDate date not null,
    foreign key (userID) references   user_details(userID) on delete cascade
);
