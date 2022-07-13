import Product from "../models/productModel.js";
import Material from "../models/materialModel.js";

const createProduct = (req, res, next) => {

  // Validate request
  if (!req.body.gtin || !req.body.productName || !req.body.recyclable || !req.body.material ) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create
  const product = {
    gtin: req.body.gtin,
    productName: req.body.productName,
    material: req.body.material,
    material_id: req.body.material_id,
    recyclable: req.body.recyclable,
    status: req.body.status,
    submit_email: req.body.submit_email,
    media: req.file?req.file.filename:null
  };

  // Save product in the database
  Product.create(product)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Product."
      });
    });

};


const createBulkProduct = (req, res, next) => {

  console.log(req.body[0]);

  let productArray = req.body;

  if(req.body.length !== 0){

  // Save product in the database
  Product.bulkCreate(productArray)
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating the Product."
    });
  });
  }
};


const getProduct = (req, res, next) => {

        Product.findAll()
        .then(data => {
            // res.send(data);
            // var result = data[1].dataValues;
            console.log(JSON.stringify(data));
            res.send(JSON.stringify(data));
            // res.status(200).json({message: "Product found.", "alamat": result.alamat, "name": result.name});            
        })
        .catch(err => {
            res.status(500).send({
                message:
                  err.message || "Some error occurred while retrieving Products."
              });
        });

};

const getProductByGTIN = (req, res, next) => {

//   Product.findOne({ where : {
//     gtin: req.params.gtin
// }})

  Product.findOne({ where : {
    gtin: req.params.gtin
}})
    .then(data => {
        // res.send(data);
        // var result = data[1].dataValues;
        console.log(JSON.stringify(data));
        res.send(JSON.stringify(data));
        // res.status(200).json({message: "Product found.", "alamat": result.alamat, "name": result.name});
        
    })
    .catch(err => {
        res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving Products."
          });
    });

};

const getProductByStatus = (req, res, next) => {

  console.log(req.params.status);
  Product.findAll({ where : {
      status: req.params.status
  }})
  .then(data => {
      console.log(JSON.stringify(data));
      res.send(JSON.stringify(data));        
  })
  .catch(err => {
      res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving reports."
        });
  });

};

const updateProductByStatus = (req, res, next) => {

  let target = req.params.gtin.split(",");
  // Save product in the database
  Product.update(
  {
    status: req.body.status,
  }, {returning:true, where: {gtin:[target]}})
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the report."
      });
    });
  }

const updateProductByGTIN = (req, res, next) => {

  // Validate request
  if (!req.body.gtin || !req.body.productName || req.body.recyclable == null) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Save product in the database
  Product.update(
  {
    productName: req.body.productName,
    material: req.body.material,
    material_id:req.body.material_id,
    recyclable: req.body.recyclable,
    status: req.body.status,
    submit_email: req.body.submit_email,
    media: req.file?req.file.filename:null

  }, {returning:true, where: {gtin:req.body.gtin}})
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Product."
      });
    });
};

const deleteProductByGTIN = (req, res, next) => {

  let target = req.params.gtin.split(",");
  Product.destroy({ where : {
      gtin: [target]
  }})
  .then(data => {
      // res.send(data);
      // var result = data[1].dataValues;
      console.log(JSON.stringify(data));
      res.send(JSON.stringify(data));
      // res.status(200).json({message: "Product found.", "alamat": result.alamat, "name": result.name});
      
  })
  .catch(err => {
      res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Products."
        });
  });

};



export { createProduct, createBulkProduct, getProduct, getProductByGTIN, getProductByStatus, updateProductByStatus, updateProductByGTIN, deleteProductByGTIN };