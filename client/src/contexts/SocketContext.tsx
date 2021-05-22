import React, { useContext, createContext, useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";

export type GlobalContentSocket = {
  socket: Socket | undefined;
};

const SocketContext = createContext<GlobalContentSocket>({
  socket: undefined,
});

export function useSocket() {
  return useContext(SocketContext);
}

export const SocketProvider: React.FC = ({ children }) => {
  const [socket, setSocket] = useState<Socket | undefined>();

  useEffect((): (() => void) => {
    const newSocket = io("http://localhost:3001");
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  const value = {
    socket: socket,
  };
  return (
    <SocketContext.Provider value={value}>
      {socket && children}
    </SocketContext.Provider>
  );
};
