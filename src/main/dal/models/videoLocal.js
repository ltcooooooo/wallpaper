import sequelize from "./db";
import { DataTypes } from "sequelize";

const VideoLocal = sequelize.define('VideoLocal', {
  cover: {
    type: DataTypes.STRING,
    allowNull: false
  },
  url: {
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

export default VideoLocal;