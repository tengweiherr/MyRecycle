import { Sequelize } from 'sequelize';
import User from './userModel.js';
import sequelize from '../utils/database.js';
import Batch from './batchModel.js';

const Reward = sequelize.define('rewards', {
   reward_id: {
      type: Sequelize.STRING,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   batch_id: {
      type: Sequelize.STRING,
      allowNull: false,
   },
   redeemed: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
   },
   user_id: {
      type: Sequelize.STRING,
      allowNull: true,
   },
   redeem_time: {
      type: Sequelize.DATE,
      allowNull: true,
   },
});

Reward.associate = () => {
   Reward.belongsTo(Batch);
}

export default Reward;