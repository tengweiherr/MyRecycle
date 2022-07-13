import Collector from "../models/collectorModel.js";
import pdf2table from 'pdf2table';
import fs from 'fs';

const createCollector = (req, res, next) => {

  // Validate request
  if (!req.body.daerah || !req.body.name || !req.body.alamat || !req.body.lat || !req.body.long || !req.body.category || !req.body.status ) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create
  const collector = {
    daerah: req.body.daerah,
    name: req.body.name,
    alamat: req.body.alamat,
    telefon: req.body.telefon ? req.body.telefon : "",
    faks: req.body.faks ? req.body.faks : "",
    pic: req.body.pic ? req.body.pic : "",
    type: req.body.type,
    lat: req.body.lat,
    long: req.body.long,
    status: req.body.status,
    category: req.body.category
  };

  // Save Tutorial in the database
  Collector.create(collector)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Collector."
      });
    });

};

const createBulkCollector = (req, res, next) => {

  console.log(req.body[0]);

  let collectorArray = req.body;

  if(req.body.length !== 0){

  // Save Collector in the database
  Collector.bulkCreate(collectorArray)
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating the Collector."
    });
  });
  }
};

const getCollector = (req, res, next) => {

        Collector.findAll()
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
                  err.message || "Some error occurred while retrieving collectors."
              });
        });

};

const getCollectorByStatus = (req, res, next) => {

  Collector.findAll({ where : {
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

const getCollectorByStatusAndCategory = (req, res, next) => {

  Collector.findAll({ where : {
      category: req.params.category,
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

const updateCollectorById = (req, res, next) => {

  let target = req.params.id.split(",");
  // Save Tutorial in the database
  Collector.update(
  {
    daerah: req.body.daerah,
    name: req.body.name,
    alamat: req.body.alamat,
    telefon: req.body.telefon ? req.body.telefon : "",
    faks: req.body.faks ? req.body.faks : "",
    pic: req.body.pic ? req.body.pic : "",
    type: req.body.type,
    lat: req.body.lat,
    long: req.body.long,
    status: req.body.status,
    category: req.body.category
  }, {returning:true, where: {id:[target]}})
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

const updateCollectorByStatus = (req, res, next) => {

  let target = req.params.id.split(",");
  // Save Tutorial in the database
  Collector.update(
  {
    status: req.body.status,
  }, {returning:true, where: {id:[target]}})
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

const collectorScrap = (req, res, next) => {

  if(req.file){

    try {
      fs.readFile(`./uploads/pdf/${req.file.filename}`, function (err, buffer) {
        if (err) return console.log(err);
     
        pdf2table.parse(buffer, function (err, rows, rowsdebug) {
            if(err) return console.log(err);
            // console.log(rowsdebug[0][0].data[0]);
            // console.log(rowsdebug[0][4].data[0]);

            const newrows = rows.filter(element => isNaN(element[0]) === false);     
            // const newrows = rows.splice(0, 3);
            res.send(newrows);
        });
    });

    } catch (error) {
      res.status(500).send({
        message:
          error.message || "Some error occurred while scrapping."
      });
    }

  }
  
}

const deleteCollectorById = (req, res, next) => {

  let target = req.params.id.split(",");
  Collector.destroy({ where : {
      id: [target]
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


export { createCollector, createBulkCollector, getCollector ,getCollectorByStatus, getCollectorByStatusAndCategory, updateCollectorById, updateCollectorByStatus, collectorScrap, deleteCollectorById };