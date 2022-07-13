import Guide from "../models/guideModel.js";


const createGuide = (req, res, next) => {

    // Validate request
    if (!req.body.content ) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }
  
    // Create
    const guide = {
      content: req.body.content,
    };
  
    // Save product in the database
    Guide.create(guide)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Guide."
        });
      });
  
  };


const getGuide = (req, res, next) => {
  
          Guide.findAll()
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
                    err.message || "Some error occurred while retrieving Guides."
                });
          });
  
  };


const updateGuideById = (req, res, next) => {
  
    Guide.update(
    {
      content: req.body.content,
    }, {returning:true, where: {id:req.params.id}})
    .then(data => {
        console.log(JSON.stringify(data));
        res.send(JSON.stringify(data));        
    })
    .catch(err => {
        res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving Guides."
          });
    });

};

  const deleteGuideById = (req, res, next) => {

    let target = req.params.id.split(",");
    console.log(target);
    Guide.destroy({ where : {
        id: [target]
    }})
    .then(data => {
        console.log(JSON.stringify(data));
        res.send(JSON.stringify(data));
        
    })
    .catch(err => {
        res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving Guides."
          });
    });
  
  };
  export { createGuide, getGuide, updateGuideById, deleteGuideById };