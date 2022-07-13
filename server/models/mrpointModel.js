import { Sequelize } from 'sequelize';
import sequelize from '../utils/database.js';

const MRPoint = sequelize.define('mrpoints', {
   mrpoint_id: {
      type: Sequelize.STRING,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   collector_id: {
      type: Sequelize.STRING,
      allowNull: true,
   },
   collector_name: {
      type: Sequelize.STRING,
      allowNull: true,
   },
   user_id: {
      type: Sequelize.STRING,
      allowNull: false,
   },
   points_given: {
      type: Sequelize.INTEGER,
      allowNull: true,
   },
   time: {
      type: Sequelize.DATE,
      allowNull: false,
   },
   event:{
      type: Sequelize.STRING,
      allowNull: false,
   }
});

export default MRPoint;