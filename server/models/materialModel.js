import { Sequelize } from 'sequelize';
import sequelize from '../utils/database.js';
import Product from './productModel.js';

const Material = sequelize.define('materials', {
   id: {
      type: Sequelize.STRING,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   material: {
      type: Sequelize.STRING,
      allowNull: false,
   },
   time: {
      type: Sequelize.STRING,
      allowNull: true,
   },
   guide: {
      type: Sequelize.STRING,
      allowNull: true,
   },
   category: {
      type: Sequelize.STRING,
      allowNull: false,
   },
   recyclable: {
      type: Sequelize.STRING,
      allowNull: true,
      get() {
         return this.getDataValue('recyclable') ? this.getDataValue('recyclable').split(",") : [];
      },
      // set(val) {
      //    this.setDataValue('favColors',val.join(';'));
      // },
   },
   non_recyclable: {
      type: Sequelize.STRING,
      allowNull: true,
      get() {
         return this.getDataValue('non_recyclable') ? this.getDataValue('non_recyclable').split(",") : [];
      }
   },
   conversion_rate: {
      type: Sequelize.INTEGER,
      allowNull: true
   },
   recyclable_media:{
      type: Sequelize.STRING,
      allowNull: true,
      get() {
         return this.getDataValue('recyclable_media') ? this.getDataValue('recyclable_media').split(",") : [];
      },
   },
   non_recyclable_media:{
      type: Sequelize.STRING,
      allowNull: true,
      get() {
         return this.getDataValue('non_recyclable_media') ? this.getDataValue('non_recyclable_media').split(",") : [];
      },
   }
});

Material.associate = () => {
   Material.hasMany(Product, {as: 'material_id', onUpdate:"CASCADE", onDelete: "CASCADE"});
}

export default Material;