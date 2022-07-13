import { Sequelize } from 'sequelize';
import sequelize from '../utils/database.js';

const Game = sequelize.define('games', {
   id: {
      type: Sequelize.STRING,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   question: {
      type: Sequelize.STRING,
      allowNull: false,
   },
   options: {
      type: Sequelize.STRING,
      allowNull: false,
      get() {
        return this.getDataValue('options') ? this.getDataValue('options').split(",") : [];
      },
      set(value){
        let result = "";
        for (let index = 0; index < value.length; index++) {
          if(index === 0) result = value[0];
          else result = result.concat(",",value[index]);
        }
        console.log(result);
        this.setDataValue('options', result);
      }
   },
   answer: {
      type: Sequelize.STRING,
      allowNull: false,
   },
   point: {
      type: Sequelize.INTEGER,
      allowNull: false,
   },
   tips: {
      type: Sequelize.STRING,
      allowNull: true,
   },
   origin: {
      type: Sequelize.STRING,
      allowNull: true,
   },
   level: {
      type: Sequelize.INTEGER,
      allowNull: false,
   },
});


export default Game;