//CREATE
//READ
//UPDATE<--|
//DELETE --|
export const CREATE = (pool, query, values) => {
    return new Promise((resolve, reject) => {
        pool.execute(query, values, (err, data) => {
            if (!err) {
                resolve(data);
            } else {
                reject(err);
            }
        });
    });
}

export const READ = (pool, query, filter = [], isfieldsRequired = false) => {
    return pool.query(query, filter)
        .then(data => data)
        .catch(err => new Error(err));
}

export const TRANSACT = async () => {

}