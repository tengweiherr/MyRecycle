import { Sequelize } from 'sequelize';
import sequelize from '../utils/database.js';
import MRPoint from './mrpointModel.js';

const Collector = sequelize.define('collectors', {
   id: {
      type: Sequelize.STRING,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   daerah: {
      type: Sequelize.STRING,
      allowNull: false,
   },
   name: {
      type: Sequelize.STRING,
      allowNull: false,
   },
   alamat: {
      type: Sequelize.STRING,
      allowNull: false,
   },
   telefon: {
    type: Sequelize.STRING,
    allowNull: true,
   },
   faks: {
    type: Sequelize.STRING,
    allowNull: true,
   },
   pic: {
    type: Sequelize.STRING,
    allowNull: true,
   },
   type: {
    type: Sequelize.STRING,
    allowNull: true,
   },
   lat: {
    type: Sequelize.DOUBLE,
    allowNull: false,
   },
   long: {
    type: Sequelize.DOUBLE,
    allowNull: false,
   },
   status: {
      type: Sequelize.STRING,
      allowNull: false,
   },
   category: {
      type: Sequelize.STRING,
      allowNull: false,
   },
});

Collector.associate = () => {
   Collector.hasMany(MRPoint, {as: 'collector_id', onUpdate:"CASCADE", onDelete:"NO ACTION"});
}

export default Collector;