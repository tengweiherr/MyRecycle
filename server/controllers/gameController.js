import Game from "../models/gameModel.js";


const createGame = (req, res, next) => {

    // Validate request
    if (req.body.question === "" || req.body.options.length ===0 ) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }
      
    // Create
    const game = {
        question: req.body.question,
        options: req.body.options,
        answer: req.body.answer,
        point: req.body.point,
        tips: req.body.tips,
        origin: req.body.origin,
        level: req.body.level,
    };

    // Save product in the database
    Game.create(game)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Game."
        });
      });
  
  };


const getGame = (req, res, next) => {
  
          Game.findAll()
          .then(data => {
              // res.send(data);
              // var result = data[1].dataValues;
              console.log(JSON.stringify(data));
              res.send(JSON.stringify(data));
              // res.status(200).json({message: "Collector found.", "status": result.status, "name": result.name});
              
          })
          .catch(err => {
              res.status(500).send({
                  message:
                    err.message || "Some error occurred while retrieving Games."
                });
          });
  
  };


const updateGameById = (req, res, next) => {

    // Validate request
    if (req.body.question === "" || req.body.options.length ===0 ) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }

    Game.update(
    {
        question: req.body.question,
        options: req.body.options,
        answer: req.body.answer,
        point: req.body.point,
        tips: req.body.tips,
        origin: req.body.origin,
        level: req.body.level,
    }, {returning:true, where: {id:req.params.id}})
    .then(data => {
        console.log(JSON.stringify(data));
        res.send(JSON.stringify(data));        
    })
    .catch(err => {
        res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving Games."
          });
    });

};

  const deleteGameById = (req, res, next) => {

    let target = req.params.id.split(",");
    console.log(target);
    Game.destroy({ where : {
        id: [target]
    }})
    .then(data => {
        console.log(JSON.stringify(data));
        res.send(JSON.stringify(data));
        
    })
    .catch(err => {
        res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving Games."
          });
    });
  
  };
  export { createGame, getGame, updateGameById, deleteGameById };