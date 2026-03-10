import sequelize from "./db";
import { DataTypes } from "sequelize";

const VideoFavorite = sequelize.define('VideoFavorite', {
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
    }
});

export default VideoFavorite;