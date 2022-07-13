import { Sequelize } from 'sequelize';
import Reward from './rewardModel.js';
import Report from './reportModel.js';
import MRPoint from './mrpointModel.js';
import sequelize from '../utils/database.js';

const User = sequelize.define('users', {
   id: {
      type: Sequelize.STRING,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   email: {
      type: Sequelize.STRING,
      allowNull: false,
   },
   name: {
      type: Sequelize.STRING,
      // allowNull: false,
   },
   password: {
      type: Sequelize.STRING,
      allowNull: false,
   },
   role: {
      type: Sequelize.STRING,
      allowNull: false,
   },
   mr_points: {
      type: Sequelize.INTEGER,
      allowNull: false,
   },
   state: {
      type: Sequelize.STRING,
      allowNull: true,      
   },
   last_played: {
      type: Sequelize.DATE,
      allowNull: true, 
   }
});

User.associate = () => {
   User.hasMany(Report, {as: 'userId', onUpdate:"CASCADE", onDelete: "CASCADE"});
}

User.associate = () => {
   User.hasMany(MRPoint, {as: 'user_id', onUpdate:"CASCADE", onDelete: "CASCADE"});
}

User.associate = () => {
   User.hasMany(Reward, {as: 'user_id', onUpdate:"CASCADE", onDelete:"NO ACTION"});
}

export default User;