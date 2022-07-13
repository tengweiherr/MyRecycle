import Material from "../models/materialModel.js";


const createMaterial = (req, res, next) => {

    // Validate request
    if (!req.body.material || !req.body.time ) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }
  
    // Create
    const material = {
      material: req.body.material,
      time: req.body.time,
      guide: req.body.guide,
      category: req.body.category,
      recyclable: req.body.recyclable,
      non_recyclable: req.body.non_recyclable,
      conversion_rate: req.body.conversion_rate,
      recyclable_media: req.file.filename,
      non_recyclable_media: req.file.filename
    };
  
    // Save material in the database
    Material.create(material)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the material."
        });
      });
  
  };

  const getMaterial = (req, res, next) => {
  
          Material.findAll()
          .then(data => {
              // res.send(data);
              // var result = data[1].dataValues;
              // console.log(JSON.stringify(data));
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

  const getMaterialByCategory = (req, res, next) => {
  
    Material.findAll({ where : {
      category: req.params.category
  }})
    .then(data => {
        // res.send(data);
        // var result = data[1].dataValues;
        // console.log(JSON.stringify(data));
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

  const getOneMaterial = (req, res, next) => {
  
    Material.findOne({ where : {
        material: req.params.material
    }})
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

const updateMaterialById = (req, res, next) => {

    // Validate request
    if (!req.body.id || !req.body.material || !req.body.time) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }

    var media = "";

    for (let index = 0; index < req.files.length; index++) {
  
      if(index === 0) media = req.files[0].filename;
      else media = media.concat(",",req.files[index].filename);
    }
  
    // Save material in the database
    Material.update(
    {
      material: req.body.material,
      time: req.body.time,
      guide: req.body.guide,
      category: req.body.category,
      recyclable: req.body.recyclable,
      non_recyclable: req.body.non_recyclable,
      conversion_rate: req.body.conversion_rate,
      recyclable_media: req.body.recyclable_media,
      non_recyclable_media: req.body.non_recyclable_media

    }, {returning:true, where: {id:req.body.id}})
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the material."
        });
      });
  };

  const deleteMaterialById = (req, res, next) => {

    let target = req.params.id.split(",");
    console.log(target);
    Material.destroy({ where : {
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

  export { createMaterial, getMaterial, getMaterialByCategory, getOneMaterial, updateMaterialById, deleteMaterialById };