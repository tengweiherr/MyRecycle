import { Sequelize } from 'sequelize';
import sequelize from '../utils/database.js';

const Guide = sequelize.define('guides', {
   id: {
      type: Sequelize.STRING,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   content: {
      type: Sequelize.STRING,
      allowNull: true,
   },
});


export default Guide;