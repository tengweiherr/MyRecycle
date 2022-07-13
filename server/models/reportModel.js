import { Sequelize } from 'sequelize';

import sequelize from '../utils/database.js';

const Report = sequelize.define('reports', {
   id: {
      type: Sequelize.STRING,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   title: {
      type: Sequelize.STRING,
      allowNull: false,
   },
   description: {
      type: Sequelize.STRING,
      allowNull: false,
   },
   date: {
      type: Sequelize.DATE,
      allowNull: false,
   },
   category: {
      type: Sequelize.STRING,
      allowNull: false,
   },
   location: {
    type: Sequelize.STRING,
    allowNull: false,
    },
   status: {
    type: Sequelize.STRING,
    allowNull: false,
   },
   media: {
    type: Sequelize.STRING,
    allowNull: true,
   },
   verified_comment: {
    type: Sequelize.STRING,
    allowNull: true,
   },
   in_progress_comment: {
    type: Sequelize.STRING,
    allowNull: true,
   },
   solved_comment: {
    type: Sequelize.STRING,
    allowNull: true,
   },
   rejected_comment: {
    type: Sequelize.STRING,
    allowNull: true,
   },
   verified_time: {
    type: Sequelize.DATE,
    allowNull: true,
   },
   in_progress_time: {
    type: Sequelize.DATE,
    allowNull: true,
   },
   solved_time: {
    type: Sequelize.DATE,
    allowNull: true,
   },
   rejected_time: {
    type: Sequelize.DATE,
    allowNull: true,
   },
   userId: {
    type: Sequelize.STRING,
    allowNull:false
   }

});

export default Report;