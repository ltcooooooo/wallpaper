import { Sequelize } from "sequelize";
import { app } from 'electron';
import { join } from 'path';
import { is } from '@electron-toolkit/utils'

const path = join(app.getPath('userData'), 'database.db');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path,
    // logging: null
    logging: is.dev ? console.log : null
});

export default sequelize;
