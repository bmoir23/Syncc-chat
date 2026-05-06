"use client";

import { useChat } from "@ai-sdk/react";
import { Send, Bot, Database, Server, Settings, Zap } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const [activeTab, setActiveTab] = useState("connectors");

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      
      {/* Left Sidebar - Plugins & Connectors */}
      <div className="w-80 border-r border-zinc-800 bg-zinc-900/50 flex flex-col hidden md:flex">
        <div className="p-4 border-b border-zinc-800">
          <div className="flex items-center gap-2 font-semibold text-lg">
            <div className="h-8 w-8 rounded bg-blue-600 flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            AgentCore Hub
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="px-4 pt-4">
            <TabsList className="grid w-full grid-cols-2 bg-zinc-800/50">
              <TabsTrigger value="connectors">Connectors</TabsTrigger>
              <TabsTrigger value="agents">Deployer</TabsTrigger>
            </TabsList>
          </div>
          
          <ScrollArea className="flex-1 px-4 mt-4">
            <TabsContent value="connectors" className="mt-0 space-y-4">
              <div className="space-y-3">
                <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Storage</h3>
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-3 flex items-center gap-3">
                    <div className="p-2 rounded bg-emerald-500/10 text-emerald-500">
                      <Database className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Supabase Vector</p>
                      <p className="text-xs text-zinc-500">Persistent memory pgvector</p>
                    </div>
                  </CardContent>
                </Card>

                <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider pt-2">Compute</h3>
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-3 flex items-center gap-3">
                    <div className="p-2 rounded bg-orange-500/10 text-orange-500">
                      <Zap className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Cloudflare Workers</p>
                      <p className="text-xs text-zinc-500">Edge deployment ready</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-3 flex items-center gap-3">
                    <div className="p-2 rounded bg-yellow-500/10 text-yellow-500">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Hugging Face</p>
                      <p className="text-xs text-zinc-500">Inference endpoints</p>
                    </div>
                  </CardContent>
                </Card>

                <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider pt-2">MCP Servers</h3>
                <Card className="bg-zinc-900 border-zinc-800 opacity-60 flex flex-row items-center p-3 gap-3">
                    <div className="p-2 rounded bg-zinc-800 text-zinc-400">
                      <Server className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Local Data Tool</p>
                      <p className="text-xs text-zinc-500">Disconnected</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Settings className="h-3 w-3" />
                    </Button>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="agents" className="mt-0">
              <div className="space-y-4">
                <Card className="bg-zinc-900 border-indigo-500/50 shadow-[0_0_15px_-3px_rgba(99,102,241,0.2)]">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium text-indigo-400">Main Orchestrator</CardTitle>
                    <CardDescription className="text-xs">Routes queries to the right subsystem</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <Badge variant="outline" className="bg-indigo-500/10 text-indigo-300 border-indigo-500/20">Active</Badge>
                  </CardContent>
                </Card>
                
                <Card className="bg-zinc-900 border-zinc-800 border-dashed">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-2 min-h-[100px]">
                    <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-zinc-400" />
                    </div>
                    <p className="text-sm text-zinc-400">Deploy new LangChain Agent...</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-zinc-950 relative">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-zinc-800 bg-zinc-900/20 backdrop-blur-sm z-10">
          <div className="flex items-center gap-3">
            <h1 className="font-semibold tracking-tight text-zinc-100">Workflow & Chat</h1>
            <Badge variant="secondary" className="bg-zinc-800 text-zinc-300">LangChain Routing</Badge>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-zinc-400 font-mono">System Operational</span>
          </div>
        </header>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4 md:p-6 pb-32">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4 opacity-70">
                <div className="h-16 w-16 rounded-2xl bg-zinc-800 flex items-center justify-center shadow-lg">
                  <Bot className="h-8 w-8 text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-xl font-medium mb-2">How can I help you orchestrate today?</h2>
                  <p className="text-sm text-zinc-400 max-w-sm">
                    This agent integrates with Hugging Face models, Supabase vector persistence, and connects to remote MCP servers.
                  </p>
                </div>
              </div>
            )}
            
            {messages.map((m) => (
              <div key={m.id} className={`flex gap-4 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role !== "user" && (
                  <Avatar className="h-8 w-8 border border-zinc-800 mt-1">
                    <AvatarFallback className="bg-indigo-600">AI</AvatarFallback>
                  </Avatar>
                )}
                
                <div className={`
                  relative px-4 py-3 rounded-2xl max-w-[85%] sm:max-w-[75%] shadow-sm whitespace-pre-wrap flex flex-col gap-2
                  ${m.role === "user" 
                    ? "bg-zinc-100 text-zinc-900 rounded-tr-sm" 
                    : "bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-tl-sm"
                  }
                `}>
                  <div className="text-sm leading-relaxed">
                    {m.content}
                  </div>
                </div>
                
                {m.role === "user" && (
                  <Avatar className="h-8 w-8 border border-zinc-200 mt-1">
                    <AvatarFallback className="bg-zinc-200 text-zinc-800">U</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-4 justify-start">
                <Avatar className="h-8 w-8 border border-zinc-800 mt-1">
                  <AvatarFallback className="bg-indigo-600 hover:animate-pulse">AI</AvatarFallback>
                </Avatar>
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center space-x-2 h-11">
                  <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} className="h-1" />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-zinc-950 via-zinc-950 to-transparent pt-10 px-4 md:px-6 pb-6">
          <div className="max-w-3xl mx-auto border border-zinc-800 bg-zinc-900/80 backdrop-blur rounded-2xl p-1 shadow-lg shadow-black/50 focus-within:ring-2 focus-within:ring-indigo-500/50">
            <form 
              onSubmit={handleSubmit}
              className="flex items-end transition-all "
            >
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Message the agent network..."
                className="flex-1 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-3 py-3 resize-none min-h-[44px] shadow-none text-zinc-100 placeholder:text-zinc-500"
              />
              <Button 
                type="submit" 
                disabled={!input?.trim() || isLoading}
                size="icon"
                className="mb-1 mr-1 h-10 w-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shrink-0 transition-all duration-200"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
            </form>
          </div>
          <div className="mt-2 text-center">
            <p className="text-[10px] text-zinc-600 font-mono">
              Powered by Vercel AI SDK, LangChain, Hugging Face & Supabase.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
