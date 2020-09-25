import low from 'lowdb'
import path from 'path'
import { app } from 'electron'
import { nanoid } from 'nanoid'
import { DBData } from '@/types/utils'
import FileSync from 'lowdb/adapters/FileSync'

const userDataPath: string = app.getPath('userData')

const dbPath: string = path.join(userDataPath, 'db.json')

const adapter: low.AdapterSync<any> = new FileSync(dbPath)

const db: low.LowdbSync<any> = low(adapter)

db.defaults({ casino_config: [] }).write()

export const dbHas = (name: string, newData: DBData): boolean => !!(db.get(name) as any).find(newData).value()

export const read = (name: string) => {
    return db.get(name).value()
}

export const update = (name: string, newData: DBData): void => {
    newData.id = newData.id || `ID-${nanoid()}`
    if (dbHas(name, { id: newData.id })) {
        (db.get(name) as any).find({ id: newData.id }).assign(newData).write()
    } else {
        (db.get(name) as any).push(newData).write()
    }
}

export const remove = (name: string, newData: DBData): void => {
    if (dbHas(name, { id: newData.id })) {
        (db.get(name) as any).remove({ id: newData.id }).write()
    }
}

export default db
