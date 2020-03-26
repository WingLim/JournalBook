import { openDB } from 'idb';

export class DB {
  db;

  constructor(dbPromise) {
    this.db = dbPromise || openDB('entries-store');
  }

  async get(table, key) {
    return this.db.then(async db =>
      await db
        .transaction(table)
        .objectStore(table)
        .get(key)
    );
  }

  set(table, key, val) {
    return this.db.then(async db => {
      const tx = db.transaction(table, 'readwrite');
      await tx.objectStore(table).put(val, key);
      return tx.done;
    });
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

  keys(table) {
    return this.db.then(async db => {
      const tx = db.transaction(table);
      const keys = [];
      const store = tx.objectStore(table);
      let cursor = await store.openCursor();

      while(cursor) {
        if (!cursor) return;
        keys.push(cursor.key);
        cursor = await cursor.continue();
      }

      return tx.done.then(() => {
        keys.reverse();
        return keys;
      });
    });
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
