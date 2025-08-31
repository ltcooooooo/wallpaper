import VideoLocal from '../models/videoLocal'

export async function insertVideoDB(data) {
    //@todo 只传需要的参数
    try {
        await VideoLocal.create(data);
    } catch (error) {
        Elog.error('Error saving to database:', error);
        return Promise.reject(error);
    }
}

export async function findVideoDB(data) {
    const { url } = data
    try {
       const result = await VideoLocal.findOne({
           where: {
               url
           }
       })
       return result ? result.toJSON() : null
    } catch (error) {
        Elog.error('Error finding Video in database:', error);
        return Promise.reject(error);
    }
}

export async function deleteVideoDB(id) {
    try {
        await VideoLocal.destroy({
            where: { id }
        });
    } catch (error) {
        Elog.error('Error deleting Video from database:', error);
        return Promise.reject(error);
    }
}

export async function getLocalVideoListDB({ page, pageSize }) {
    try {
        const { count, rows } = await VideoLocal.findAndCountAll({
            limit: pageSize,
            offset: (page - 1) * pageSize,
            order: [['createdAt', 'DESC']]
        });
        return { success: true, data: rows.map(row => row.toJSON()), total: count };
    } catch (error) {
        Elog.error('Error fetching all Videos from database:', error);
        return Promise.reject(error);
    }
}