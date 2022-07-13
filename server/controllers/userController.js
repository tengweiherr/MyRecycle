import User from '../models/userModel.js';


const add = (a, b) => {
    return a + b;
}

  const getUser = (req, res, next) => {
  
          User.findAll()
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
                    err.message || "Some error occurred while retrieving users."
                });
          });
  
  };

  const getUserById = (req, res, next) => {
  
    User.findOne({ where:{
        id: req.params.id
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

const getUserByRole = (req, res, next) => {
  
    User.findAll({ where:{
        role: req.params.role
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

const getUserByState = (req, res, next) => {
  
    User.findAll({ where:{
        state: req.params.state
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

  const getUserByEmail = (req, res, next) => {
  
    User.findOne({ where:{
        email: req.params.email
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

const updateUserByEmail = (req, res, next) => {
  
    User.update(
    {
      mr_points: req.body.mr_points,
    }, {returning:true, where: {email:req.params.email}})
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

  const deleteUserById = (req, res, next) => {

    let target = req.params.id.split(",");
    console.log(target);
    User.destroy({ where : {
        id: [target]
    }})
    .then(data => {
        console.log(JSON.stringify(data));
        res.send(JSON.stringify(data));
        
    })
    .catch(err => {
        res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving Users."
          });
    });
  
  };
  export { add, getUser, getUserById, getUserByRole, getUserByState, getUserByEmail, updateUserByEmail, deleteUserById };