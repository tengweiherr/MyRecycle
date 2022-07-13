import Batch from "../models/batchModel.js";
import Reward from "../models/rewardModel.js";

const createBatch = (req, res, next) => {

    // Validate request
    if (!req.body.rewards_name || !req.body.rewards_category || !req.body.rewards_cost  ) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }
  
    // Create
    const batch = {
      rewards_name: req.body.rewards_name,
      rewards_category: req.body.rewards_category,
      rewards_cost: req.body.rewards_cost,
      amount_available: req.body.amount_available,
      amount_left: req.body.amount_available,
      media: req.file.filename,
    };

    console.log(batch);
  
    // Save reward in the database
    Batch.create(batch)
      .then(data => {
        res.send(data);
        // console.log(data.dataValues.batch_id);

        var rewardArray = [];

        for (let index = 0; index < data.dataValues.amount_available; index++) {
          rewardArray[index] = {batch_id:data.dataValues.batch_id, redeemed:0 };
        }

        //create single rewards as well
        Reward.bulkCreate(rewardArray)
        .then(data => {
          console.log(data.dataValues);
          // res.send(data);
        })
        .catch(err => {
          console.log(err);
          // res.status(500).send({
          //   message:
          //     err.message || "Some error occurred while creating the reward."
          // });
        });

      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the reward batches."
        });
      });
  };

  const getBatch = (req, res, next) => {

    Batch.findAll()
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

  const getBatchByCategory = (req, res, next) => {

    Batch.findAll({ where : {
        rewards_category: req.params.rewards_category
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

const updateBatchById = (req, res, next) => {

    // Validate request
    if (!req.params.batch_id || !req.body.rewards_name || !req.body.reward_category || !req.body.reward_cost) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }
  
    // Save reward in the database
    Batch.update(
    {
      rewards_name: req.body.rewards_name,
      rewards_category: req.body.rewards_category,
      rewards_cost: req.body.rewards_cost,
      amount_available: req.body.amount_available,
      amount_left: req.body.amount_left,
      media: req.body.media
    }, {returning:true, where: {batch_id:req.params.batch_id}})
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the reward."
        });
      });
  };

  const deleteBatchById = (req, res, next) => {

    let target = req.params.batch_id.split(",");
    console.log(target);
    Batch.destroy({ where : {
        batch_id: [target]
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

  export { createBatch, getBatch, getBatchByCategory, updateBatchById, deleteBatchById };