import randomstring from "randomstring";

export const getOrbitDbPath = (roomId: string) => (`/orbitdb/${roomId}`);

export const generateRandomRoomName = () => (randomstring.generate({
    length: 12
}))