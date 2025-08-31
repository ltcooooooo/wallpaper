import ImageFavorite from '../models/imageFavorite'
export async function insertImageFavoriteDB(data) {
    const { smallSrc, imgSrc, size } = data
    const dataToInsert = { smallSrc, imgSrc, size }
    try {
        await ImageFavorite.create(dataToInsert);
    } catch (error) {
        Elog.error('Error saving to database:', error);
        return Promise.reject(error);
    }
}

export async function findImageFavoriteDB(data) {
    const { imgSrc } = data
    try {
       const result = await ImageFavorite.findOne({
           where: { imgSrc }
       })
       return result ? result.toJSON() : null
    } catch (error) {
        Elog.error('Error finding favorite image in database:', error);
        return Promise.reject(error);
    }
}

export async function deleteImageFavoriteDB({ imgSrc }) {
    try {
        await ImageFavorite.destroy({
            where: { imgSrc }
        });
    } catch (error) {
        Elog.error('Error deleting favorite image from database:', error);
        return Promise.reject(error);
    }
}

export async function getImageFavoritesDB({ page, pageSize }) {
    try {
        const { count, rows } = await ImageFavorite.findAndCountAll({
            limit: pageSize,
            offset: (page - 1) * pageSize,
            order: [['createdAt', 'DESC']]
        });
        return { success: true, data: rows.map(row => row.toJSON()), total: count };
    } catch (error) {
        Elog.error('Error fetching all favorite images  from database:', error);
        return Promise.reject(error);
    }
}