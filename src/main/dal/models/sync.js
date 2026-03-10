import ImageLocal from "./ImageLocal";
import VideoLocal from "./videoLocal";
import ImageFavorite from "./imageFavorite";
import VideoFavorite from "./videoFavorite";

export default () => {
    // ImageLocal.sync({alter: true});
    ImageLocal.sync();
    VideoLocal.sync();
    ImageFavorite.sync();
    VideoFavorite.sync();
}