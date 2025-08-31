import sequelize from "./db";
import { DataTypes } from "sequelize";

const ImageLocal = sequelize.define('ImageLocal', {
  smallSrc: {
    type: DataTypes.STRING,
    allowNull: false
  },
  imgSrc: {
    type: DataTypes.STRING,
    allowNull: false
  },
  size: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  savePath: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

export default ImageLocal;