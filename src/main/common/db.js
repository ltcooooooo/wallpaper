import ImageLocal from '../models/ImageLocal'
export async function insertImageDB(data) {
    try {
        await ImageLocal.create(data);
    } catch (error) {
        Elog.error('Error saving to database:', error);
        return Promise.reject(error);
    }
}

export async function findImageDB(data) {
    const { imgSrc } = data
    try {
       const result = await ImageLocal.findOne({
           where: {
               imgSrc
           }
       })
       return result ? result.toJSON() : null
    } catch (error) {
        Elog.error('Error finding image in database:', error);
        return Promise.reject(error);
    }
}

export async function deleteImageDB(id) {
    try {
        await ImageLocal.destroy({
            where: { id }
        });
        const a = await ImageLocal.findAll()
        console.log('All images after deletion:', a);
    } catch (error) {
        Elog.error('Error deleting image from database:', error);
        return Promise.reject(error);
    }
}

export async function getLocalImageListDB({ page, pageSize }) {
    try {
        const { count, rows } = await ImageLocal.findAndCountAll({
            limit: pageSize,
            offset: (page - 1) * pageSize,
            order: [['createdAt', 'DESC']]
        });
        return { success: true, data: rows.map(row => row.toJSON()), total: count };
    } catch (error) {
        Elog.error('Error fetching all images from database:', error);
        return Promise.reject(error);
    }
}