import ImageLocal from "./ImageLocal";
import VideoLocal from "./videoLocal";
import ImageFavorite from "./imageFavorite";

export default () => {
    // ImageLocal.sync({alter: true});
    ImageLocal.sync();
    VideoLocal.sync();
    ImageFavorite.sync();
}