const router = require("express").Router();
const { User, Post, Comment } = require("../../models");
const session = require("express-session");
const withAuth = require("../../utils/auth");
const SequelizeStore =require("connect-session-sequelize")(session.Store);

//routing to get all users

router.get("/", (req, res) => {
    
    User.findAll({
        attributes: {exclude: ['password']},
    })
    .then((dbUserData)=> res.json(dbUserData))
    .catch((err)=>{
        console.log(err);
        res.status(500).json(err);
    });
});

router.get("/:id", (req, res)=>{
    User.findOne({
        attributes: {exclude: ["password"]},
        where: {
            id: req.params.id,
        },
        include:[
            {
                model: Post,
                attributes: ["id", "title", "body"],
            },
            {
                model: Comment,
                attributes: ["id", "comment_text", "post_id", "user_id"],
                include: {
                    model: Post,
                    attributes: ["title"],
                },
            },
        ],
    })
    .then((userData)=>{
        if (!userData) {
            res.status(404).json({message: "Unable to locate user with ths id"});
            return;
        }
        res.json(userData);
    })
    .catch((err)=>{
     res.status(500).json(err);   
    });
});
// create a new user with router.post
router.post("/", async (req, res) => {
  try {
    const dbUserData = await User.create({
      username: req.body.name,
      password: req.body.password,
    });

    req.session.save(() => {
      req.session.user_id = dbUserData.id;
      req.session.user_name = dbUserData.username;
      req.session.logged_in = true;

      res.json(dbUserData);
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        name: req.body.name,
      },
    });

    if (!user) {
      res
        .status(400)
        .json({ message: "Incorrect username or password. Please try again!" });
      return;
    }

    const validPassword = await user.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: "Incorrect username or password. Please try again!" });
      return;
    }

    req.session.save(() => {
      req.session.user_id = user.id;
      req.session.username = user.name;
      req.session.logged_in = true;

      res.json({ user, message: "Welcome to the Bookclub Blogpost" });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Logout
router.post("/logout", (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

router.put("/:id", withAuth, (req, res) => {
  User.update(req.body, {
    individualHooks: true,
    where: {
      id: req.params.id,
    },
  })
    .then((userData) => {
      if (!userData[0]) {
        res.status(404).json({ message: "Unable to find user with this id" });
        return;
      }
      res.json(userData);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

router.delete("/:id", (req, res) => {
  User.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((userData) => {
      if (!userData) {
        res
          .status(404)
          .json({ message: "Unable to locate a user with this id." });
        return;
      }
      res.json(userData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
