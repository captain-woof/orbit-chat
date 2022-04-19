declare module "orbit-db-feedstore" {
    import Store from "orbit-db-store";

    export default class FeedStore<T> extends Store {
        add(data: T): Promise<string>;
        get(hash: string): LogEntry<T>;
        all: LogEntry<T>[];

        remove(hash: string): Promise<string>;

        iterator(options?: {
            gt?: string,
            gte?: string,
            lt?: string,
            lte?: string,
            limit?: number,
            reverse?: boolean
        }): {
            [Symbol.iterator](): Iterator<LogEntry<T>>,
            next(): { value: LogEntry<T>, done: boolean },
            collect(): LogEntry<T>[]
        };
    }
}
