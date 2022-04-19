declare module "orbit-db-access-controllers/src/ipfs-access-controller" {
    import AccessController from "orbit-db-access-controllers/src/access-controller-interface"
    import { IdentityProvider } from 'orbit-db-identity-provider'
    import OrbitDB from "orbit-db"

    export default class IPFSAccessController extends AccessController {
        constructor (orbitdb: OrbitDB, options: any)

        // Returns the type of the access controller
        static get type (): string

        get write (): string[]

        // Return true if entry is allowed to be added to the database
        canAppend (entry: LogEntry<any>, identityProvider: typeof IdentityProvider): Promise<boolean>

        load (address: string): Promise<void>

        save(): Promise<{ address: string }>

        /* Factory */
        static create (orbitdb: OrbitDB, options: any): Promise<IPFSAccessController>
    }

}
