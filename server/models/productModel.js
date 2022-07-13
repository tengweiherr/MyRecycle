import { Sequelize } from 'sequelize';
import sequelize from '../utils/database.js';
import Material from './materialModel.js';

const Product = sequelize.define('products', {
   gtin: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
   },
   productName: {
      type: Sequelize.STRING,
      allowNull: false,
   },
   material_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
   },
   material: {
      type: Sequelize.STRING,
      allowNull: false,
   },
   recyclable: {
      type: Sequelize.STRING,
      allowNull: false,
   },
   status: {
      type: Sequelize.STRING,
      allowNull: false,
   },
   submit_email: {
      type: Sequelize.STRING,
      allowNull: true,
   },
   media: {
      type: Sequelize.STRING,
      allowNull: true,
   },
});

// Product.associate = () => {
//    Product.hasOne(Material, {
//       foreignKey: ''
//    });
// }


export default Product;