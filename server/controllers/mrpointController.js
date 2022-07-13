import MRPoint from "../models/mrpointModel.js";
import User from "../models/userModel.js";

const createMRPoint = (req, res, next) => {

    // Validate request
    if (!req.body.event || !req.body.user_id || !req.body.time ) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }
  
    // Create
    const mrpoint = {
      collector_id: req.body.collector_id,
      collector_name: req.body.collector_name,
      user_id: req.body.user_id,
      points_given: req.body.points_given,
      time: req.body.time,
      event: req.body.event,
    };
  
    // Save MRPoint in the database
    MRPoint.create(mrpoint)
      .then(data => {
        res.send(data);


        let payload = {
          mr_points: req.body.new_points
        }

        if(req.body.isGame) payload.last_played = req.body.time;

        User.update(payload, {returning:true, where: {id:req.body.user_id}})
          .then(data => {
            res.send(data);
          })
          .catch(err => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while creating the MRPoint."
            });
          });


      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the MRPoint."
        });
      });
  
  };

  const getMRPoint = (req, res, next) => {
  
        MRPoint.findAll()
          .then(data => {
              console.log(JSON.stringify(data));
              res.send(JSON.stringify(data));              
          })
          .catch(err => {
              res.status(500).send({
                  message:
                    err.message || "Some error occurred while retrieving users."
                });
          });
  
  };

  const getMRPointByUserId = (req, res, next) => {
  
    MRPoint.findAll({ where : {
      user_id: req.params.user_id
  }})
    .then(data => {
        console.log(JSON.stringify(data));
        res.send(JSON.stringify(data));        
    })
    .catch(err => {
        res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving users."
          });
    });
};

const updateMRPointById = (req, res, next) => {

    // Validate request
    if (!req.params.mrpoint_id || !req.body.user_id || !req.body.event || !req.body.time) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }
  
    // Save MRPoint in the database
    MRPoint.update(
    {
      user_id: req.body.user_id,
      collector_id: req.body.collector_id,
      collector_name: req.body.collector_name,
      points_given: req.body.points_given,
      time: req.body.time,
      event: req.body.event
    }, {returning:true, where: {mrpoint_id:req.params.mrpoint_id}})
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the MRPoint."
        });
      });
  };

  const deleteMRPointById = (req, res, next) => {

    let target = req.params.mrpoint_id.split(",");
    console.log(target);
    MRPoint.destroy({ where : {
        mrpoint_id: [target]
    }})
    .then(data => {
        console.log(JSON.stringify(data));
        res.send(JSON.stringify(data));
        
    })
    .catch(err => {
        res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving MRPoints."
          });
    });
  
  };

  export { createMRPoint, getMRPoint, getMRPointByUserId, updateMRPointById, deleteMRPointById };