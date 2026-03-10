import VideoFavorite from '../models/VideoFavorite'
export async function insertVideoFavoriteDB(data) {
    const { cover, url, size } = data
    // console.log('insertVideoFavoriteDB', data)
    const dataToInsert = { cover, url, size }
    try {
        await VideoFavorite.create(dataToInsert);
    } catch (error) {
        Elog.error('Error saving to database:', error);
        return Promise.reject(error);
    }
}

export async function findVideoFavoriteDB(data) {
    const { url } = data
    try {
       const result = await VideoFavorite.findOne({
           where: { url }
       })
       return result ? result.toJSON() : null
    } catch (error) {
        Elog.error('Error finding favorite Video in database:', error);
        return Promise.reject(error);
    }
}

export async function deleteVideoFavoriteDB({ url }) {
    try {
        await VideoFavorite.destroy({
            where: { url }
        });
    } catch (error) {
        Elog.error('Error deleting favorite Video from database:', error);
        return Promise.reject(error);
    }
}

export async function getVideoFavoritesDB({ page, pageSize }) {
    try {
        const { count, rows } = await VideoFavorite.findAndCountAll({
            limit: pageSize,
            offset: (page - 1) * pageSize,
            order: [['createdAt', 'DESC']]
        });
        return { success: true, data: rows.map(row => row.toJSON()), total: count };
    } catch (error) {
        Elog.error('Error fetching all favorite Videos  from database:', error);
        return Promise.reject(error);
    }
}