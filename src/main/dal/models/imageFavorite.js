import sequelize from "./db";
import { DataTypes } from "sequelize";

const ImageFavorite = sequelize.define('ImageFavorite', {
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
});

export default ImageFavorite;