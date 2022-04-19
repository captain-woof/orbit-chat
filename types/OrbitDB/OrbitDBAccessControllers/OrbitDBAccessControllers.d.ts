declare module "orbit-db-access-controllers" {
    import OrbitDB from 'orbit-db'
    import { EventEmitter } from 'events'

    export default class AccessControllers extends EventEmitter {
        static isSupported (type: string): boolean

        static addAccessController (options: {AccessController: any}): void

        static addAccessControllers (options: {AccessControllers: string[]}): void

        static removeAccessController (type: string): void

        static resolve (orbitdb: OrbitDB, manifestAddress: string, options: string): any

        static create (orbitdb: OrbitDB, type: string, options: any): string
    }
}
