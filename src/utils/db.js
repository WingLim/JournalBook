import { openDB } from 'idb';
import axios from 'axios';

export class DB {
    db;

    constructor(dbPromise) {
        this.db = dbPromise || openDB('entries-store');
        this.server = localStorage.getItem('server');
        this.pwd = localStorage.getItem('server_pwd');
        axios.defaults.headers.common['Authorization'] = 'Token ' + this.pwd
    }

    async get(table, key) {
        if (this.server == null || this.server == "") {
            return this.db.then(async db =>
                await db
                    .transaction(table)
                    .objectStore(table)
                    .get(key)
            );
        } else {
            return await axios.get('http://127.0.0.1:5000/journal', {
                params: {
                    table: table,
                    key: key
                }
            }).then(function (res) {
                return res.data
            })
        }
    }

    async set(table, key, val) {
        if (this.server == null || this.server == "") {
            return this.db.then(async db => {
                const tx = db.transaction(table, 'readwrite');
                await tx.objectStore(table).put(val, key);
                return tx.done;
            });
        } else {
            val = JSON.stringify(val);
            return await axios.post('http://127.0.0.1:5000/journal', {
                table: table,
                key: key,
                val: val
            })
        }
    }

    delete(table, key) {
        return this.db.then(async db => {
            const tx = db.transaction(table, 'readwrite');
            await tx.objectStore(table).delete(key);
            return tx.done;
        });
    }

    clear(table) {
        return this.db.then(async db => {
            const tx = db.transaction(table, 'readwrite');
            await tx.objectStore(table).clear();
            return tx.done;
        });
    }

    async keys(table) {
        if (this.server == null || this.server == "") {
            return this.db.then(async db => {
                const tx = db.transaction(table);
                const keys = [];
                const store = tx.objectStore(table);
                let cursor = await store.openCursor();

                while (cursor) {
                    if (!cursor) return;
                    keys.push(cursor.key);
                    cursor = await cursor.continue();
                }

                return tx.done.then(() => {
                    keys.reverse();
                    console.log(keys);
                    return keys;
                });
            });
        } else {

            return await axios.get('http://127.0.0.1:5000/journal', {
                params: {
                    table: table,
                    type: 'keys',
                    pwd: this.pwd
                }
            }).then(function (res) {
                return res.data
            })
        }

    }

    getAll(table) {
        return this.db.then(async db =>
            await db
                .transaction(table)
                .objectStore(table)
                .getAll()
        );
    }

    async getObject(table) {
        const keys = await this.keys(table);
        const values = await Promise.all(keys.map(key => this.get(table, key)));

        return values.reduce((current, entry, index) => {
            current[keys[index]] = entry;
            return current;
        }, {});
    }
}
