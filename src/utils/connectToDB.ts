import config from 'config';
import mysql from 'mysql2/promise';
import log from './logger';

async function connectToDB(){

    const host = config.get<string>('mysql.host');

    const port = config.get<number>('mysql.port');

    const user = config.get<string>('mysql.user');

    const password = config.get<string>('mysql.password');

    const database = config.get<string>('mysql.database');

    try{
        const connection = await mysql.createConnection({
            host: host,
            port: port,
            user: user,
            password: password,
            database: database
        });
        log.info('Connected to database ');
        return connection;
    }catch(e){
        process.exit(1);
    }
}

export const connection = connectToDB();