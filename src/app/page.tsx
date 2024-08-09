"use client";
import Image from "next/image";
import { Box, Button, Stack, TextField } from "@mui/material";
import { useState } from "react";

interface Message {
  role: string;
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi, I'm the Customer Service Agent, how can I help you today?",
    },
  ]);
  const [message, setMessage] = useState<string>("");

  const sendMessage = async () => {
    const userMessage: Message = { role: "user", content: message };
    setMessages((prevMessages) => [
      ...prevMessages,
      userMessage,
      { role: "assistant", content: "" },
    ]);

    const response = await fetch("api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([...messages, userMessage]),
    });

    if (!response.body) {
      console.error("Response body is null");
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let result = "";

    const processText = async ({
      done,
      value,
    }: {
      done: boolean;
      value?: Uint8Array;
    }) => {
      if (done) {
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          updatedMessages[updatedMessages.length - 1].content = result;
          return updatedMessages;
        });
        return;
      }

      const text = decoder.decode(value, { stream: true });
      result += text;
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        updatedMessages[updatedMessages.length - 1].content = result;
        return updatedMessages;
      });

      reader.read().then(processText);
    };

    reader.read().then(processText);
    setMessage("");
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex"></div>

      <div className="justify-between relative z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Stack
          direction="column"
          width="1100px"
          flexGrow={1}
          overflow={"auto"}
          maxHeight="100%"
          p={2}
          spacing={2}
        >
          {messages.map((msg, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                msg.role === "assistant" ? "flex-end" : "flex-start"
              }
            >
              <Box
                bgcolor={msg.role === "assistant" ? "fffaf9" : "#f9efec"}
                color={"black"}
                borderRadius={16}
                p={3}
              >
                {msg.content}
              </Box>
            </Box>
          ))}
          <Stack direction="row" spacing={2}>
            <TextField
              placeholder="Ask a question?"
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button
              sx={{
                backgroundColor: "#d4cdcb",
                color: "white",
                "&:hover": { backgroundColor: "#cfc8c5" },
              }}
              onClick={sendMessage}
              variant="contained"
            >
              {">"}
            </Button>
          </Stack>
        </Stack>
      </Box>
      <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left"></div>
    </main>
  );
}
