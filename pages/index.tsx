import { Box, Button, Divider, Input } from "@chakra-ui/react";
import { useState } from "react";
import { useRoom } from "../hooks/useRoom";

function App() {
  const [message, setMessage] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");
  const { createRoom, joinRoom, sendMessage, getMessages } = useRoom();

  return (
    <>

      {/* Join room */}
      <Box as="section" marginTop="8" padding="4">
        <form onSubmit={async (e) => {
          e.preventDefault();
          await joinRoom(roomId);
          setRoomId("");
        }}>
          <Input value={roomId} onChange={(e) => { setRoomId(e.target.value); }} />
          <Button type="submit">Join room</Button>
        </form>
      </Box>

      {/* Create room */}
      <Box as="section" marginTop="4" padding="4">
        <Button type="submit" onClick={async () => { await createRoom() }}>Create room</Button>
      </Box>

      {/* All messages */}
      <Divider />

      <Box as="section" marginTop="4" padding="4">
        <Button type="submit" onClick={async () => {
          const messages = await getMessages();
          console.log(messages);
        }}>Get messages</Button>
      </Box>

      <Divider />

      {/* Send message */}
      <Box as="section" padding="4">
        <form onSubmit={async (e) => {
          e.preventDefault();
          await sendMessage(message);
          setMessage("");
        }}>
          <Input placeholder="Type your message..." value={message} onChange={(e) => { setMessage(e.target.value); }} />
          <Button type="submit" marginTop="4">Send</Button>
        </form>
      </Box>
    </>
  )
}

export default App
