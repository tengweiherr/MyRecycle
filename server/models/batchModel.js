import { Sequelize } from 'sequelize';
import sequelize from '../utils/database.js';
import Reward from './rewardModel.js';

const Batch = sequelize.define('rewards_batches', {
   batch_id: {
      type: Sequelize.STRING,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   rewards_name: {
      type: Sequelize.STRING,
      allowNull: false,
   },
   rewards_category: {
      type: Sequelize.STRING,
      allowNull: false,
   },
   rewards_cost: {
      type: Sequelize.INTEGER,
      allowNull: false,
   },
   amount_available: {
      type: Sequelize.INTEGER,
      allowNull: false,
   },
   amount_left: {
      type: Sequelize.INTEGER,
      allowNull: true,
   },
   media: {
      type: Sequelize.STRING,
      allowNull: true,
   }, 
});

Batch.associate = () => {
   Batch.hasMany(Reward, {as: 'batch_id', onDelete: "CASCADE"});
}

export default Batch;