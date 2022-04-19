import { useCallback, useEffect, useState } from "react"
import * as IPFSNode from 'ipfs-core';
import OrbitDB from "orbit-db";
import { generateRandomRoomName, getOrbitDbPath } from "../utils/chatroom";
import { Message } from "../types/message";
import FeedStore from "orbit-db-feedstore";

// roomId is like 'dvdmvkfmvldfnvjkfnvkdvndldvdfv'
export const useRoom = (onMessage?: (message: Message) => any) => {
    const [ipfsNode, setIpfsNode] = useState<IPFSNode.IPFS>();
    const [orbitDb, setOrbitDb] = useState<OrbitDB>();
    const [messageFeed, setMessageFeed] = useState<FeedStore<string>>();

    // Initialise IPFS node and OrbitDB instance
    useEffect(() => {
        (async () => {
            try {
                // Initialise IPFS node
                const newIpfsNode = await IPFSNode.create({
                    relay: {
                        enabled: true,
                        hop: {
                            active: true,
                            enabled: true
                        }
                    },                   
                    config: {
                        Pubsub: {
                            Enabled: true
                        },
                        /*Addresses: {
                            Swarm: [
                                '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',
                                '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',
                                '/dns4/webrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star/'
                            ]
                        },*/
                    }
                });
                setIpfsNode(newIpfsNode);
                const localNodeId = await newIpfsNode.id();
                console.log("Local IPFS node setup", localNodeId);

                // Initialise OrbitDB instance
                const newOrbitDb = await OrbitDB.createInstance(newIpfsNode);
                setOrbitDb(newOrbitDb);

                // Log peers
                setInterval(async () => {
                    const swarmPeers = await newIpfsNode.swarm.peers();
                    console.log(`Swarm peers: ${swarmPeers.length}`);
                }, 30 * 1000)
            } catch (e) {
                console.error(e);
            }
        })()
    }, [])

    // Setup listeners to db
    useEffect(() => {
        if (!!messageFeed) {
            const handleReplicationStart = (peerAddress: string) => {
                console.log(`Database replication started with peer ${peerAddress}`);
            }
            const handleReplicationProgress = (address: any, hash: any, entry: any, progress: any, have: any) => {
                console.log(`Database replication progress: ${progress}`);
            }
            const handleReplicationEnd = (peerAddress: string) => {
                console.log(`Database replicated with peer ${peerAddress}`);
            }

            messageFeed.events.on("replicate", handleReplicationStart);
            messageFeed.events.on("replicate.progress", handleReplicationProgress);
            messageFeed.events.on("replicated", handleReplicationEnd);
            console.log("Replication event listeners setup");

            return () => {
                messageFeed.events.off("replicate", handleReplicationStart);
                messageFeed.events.off("replicate.progress", handleReplicationProgress);
                messageFeed.events.off("replicated", handleReplicationEnd);
            }
        }
    }, [messageFeed])

    // Function to create a room
    const createRoom = useCallback(async (roomName: string = generateRandomRoomName()) => {
        if (!!orbitDb && !messageFeed) {
            const newMessageFeed = await orbitDb.feed(roomName, {
                create: true,
                accessController: {
                    write: ["*"]
                },
                replicate: true
            });
            await newMessageFeed.load(-1);
            setMessageFeed(newMessageFeed as FeedStore<string>);

            const feedPath = getOrbitDbPath(`${newMessageFeed.address.root}/${newMessageFeed.address.path}`);
            console.log("New room created", feedPath);
            return feedPath;
        }
    }, [orbitDb, messageFeed]);

    // Function to connect to a room
    const joinRoom = useCallback(async (roomId: string) => {
        if (!!orbitDb && !messageFeed) {
            const path = getOrbitDbPath(roomId);
            const newMessageFeed = await orbitDb.feed(path, {
                create: false,
                replicate: true
            });
            await newMessageFeed.load(-1);
            setMessageFeed(newMessageFeed as FeedStore<string>);
            const feedPath = getOrbitDbPath(`${newMessageFeed.address.root}/${newMessageFeed.address.path}`);
            console.log("Connected to room", feedPath);
        }
    }, [orbitDb, messageFeed]);

    // Function to send message
    const sendMessage = useCallback(async (message: string) => {
        if (!!messageFeed) {
            await messageFeed?.add(message);
        }
    }, [messageFeed])

    // Function to get all messages
    const getMessages = useCallback(async () => {
        if (!!messageFeed) {
            const messageEntries = messageFeed.iterator().collect();
            const messages = messageEntries.map((messageEntry) => (messageEntry.payload.value));
            return messages;
        }
    }, [messageFeed])

    return {
        sendMessage,
        ipfsNode,
        orbitDb,
        messageFeed,
        createRoom,
        joinRoom,
        getMessages
    }
}