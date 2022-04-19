declare module "orbit-db-store" {
    import IPFS = require("ipfs");
    import Log from "ipfs-log";
    import { Identity } from "orbit-db-identity-provider";
    import { EventEmitter } from 'events';
    import * as elliptic from "elliptic";
    import AccessController from "orbit-db-access-controllers/src/access-controller-interface"

    export default class Store {

        /**
         * The identity is used to sign the database entries.
         */
        readonly identity: Identity;

        address: { root: string, path: string };
        /**
         * Contains all entries of this Store
         */
        all: unknown;
        type: string;
        /**
         * Returns an instance of `elliptic.ec.KeyPair`.
         * The keypair is used to sign the database entries.
         * The key can also be accessed from the OrbitDB instance: `orbitdb.key.getPublic('hex')`.
         */
        key: elliptic.ec.KeyPair;
        replicationStatus: IReplicationStatus;
        id: string;

        events: EventEmitter;

        access: AccessController;
        _oplog: Log

        /**
         * Apparently not meant for outside usage
         * @param ipfs
         * @param identity
         * @param address
         * @param options
         */
        protected constructor (ipfs: IPFS, identity: Identity, address: string, options: IStoreOptions);

        close(): Promise<void>;
        drop(): Promise<void>;

        setIdentity(identity: Identity): void;

        /**
         * Load the locally persisted database state to memory.
         * @param amount Amount of entries loaded into memory
         * @returns a `Promise` that resolves once complete
         */
        load(amount?: number): Promise<void>;

        protected _addOperation(data: any, options: { onProgressCallback?: (entry: any) => any, pin?: boolean }): Promise<string>;
    }
}
