import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
  Window,
  ChannelList,
  useChannelStateContext,
  useChatContext,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Plus, Menu, X } from "lucide-react";
import { getChatToken } from "@/services/chatAPI";
import { apiClient } from "@/lib/api/config";
import { Layout } from "@/components/ui/layout";

/* -------------------------------------------
   ✅ Inner Channel Layout
------------------------------------------- */
const ChannelInner = () => {
  const { thread } = useChannelStateContext();

  return (
    <div className="flex flex-col h-full bg-white relative">
      <ChannelHeader />
      <div className="flex-1 overflow-y-auto">
        <MessageList />
      </div>
      <div className="border-t p-2 bg-white">
        <MessageInput focus />
      </div>

      {thread && (
        <div className="absolute inset-0 bg-white z-30 md:right-0 md:left-auto md:w-[420px] md:border-l md:shadow-lg">
          <Thread />
        </div>
      )}
    </div>
  );
};

/* -------------------------------------------
   ✅ Main Component
------------------------------------------- */
const AttorneyChat = () => {
  const [client, setClient] = useState<StreamChat | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedParalegal, setSelectedParalegal] = useState("");
  const [paralegalList, setParalegalList] = useState<any[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ✅ Initialize Stream client
  useEffect(() => {
    const initChat = async () => {
      try {
        const res = await getChatToken();
        const chatClient = StreamChat.getInstance(res.apiKey);

        await chatClient.connectUser(
          {
            id: res.user.id,
            name: res.user.name,
            image: res.user.avatar || undefined,
          },
          res.token
        );

        setClient(chatClient);
        setUser(res.user);
      } catch (err: any) {
        console.error("❌ Chat init error:", err);
        toast.error("Failed to initialize chat");
      }
    };

    initChat();
    return () => {
      client?.disconnectUser();
    };
  }, []);

  // ✅ Fetch paralegals
  useEffect(() => {
    const loadParalegals = async () => {
      try {
        const res = await apiClient.get("/api/paralegals");
        const list = Array.isArray(res.data) ? res.data : res.data.data || [];
        setParalegalList(list);
      } catch (err) {
        console.error("❌ Failed to load paralegals:", err);
        toast.error("Failed to load paralegal list");
      }
    };
    loadParalegals();
  }, []);

  // ✅ Create chat channel (and select it)
  const handleStartChat = async () => {
    if (!client || !selectedParalegal) {
      toast.error("Select a paralegal to start chatting");
      return;
    }

    try {
      const newChannel = client.channel("messaging", {
        members: [client.userID!, selectedParalegal],
      });
      await newChannel.watch();
      newChannel.query(); // Ensure messages load
      setSidebarOpen(false);
      newChannel.watch();
      toast.success("Chat channel created!");
    } catch (err) {
      console.error("❌ createChatChannel error:", err);
      toast.error("Failed to create channel");
    }
  };

  if (!client || !user)
    return (
      <Layout>
        <div className="flex items-center justify-center h-[calc(100vh-8rem)] text-gray-600">
          Initializing chat...
        </div>
      </Layout>
    );

  return (
    <Layout>
      <div className="flex flex-col w-full h-[calc(100vh-4.5rem)] bg-white overflow-hidden rounded-none md:rounded-xl">
        <Chat client={client} theme="str-chat__theme-light">
          <div className="flex h-full w-full relative bg-white">
            {/* 🧭 Sidebar (collapsible for mobile) */}
            <div
              className={`fixed md:static top-0 left-0 z-40 bg-white border-r shadow-lg md:shadow-none transition-transform duration-300 ease-in-out
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
                w-[85vw] md:w-80 h-full flex flex-col`}
            >
              <div className="p-4 border-b flex items-center justify-between bg-muted/30">
                <h2 className="text-lg font-semibold">Paralegal Chats</h2>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setIsCreating(!isCreating)}
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                  <Button
                    id="mobile-sidebar-close-button"
                    size="icon"
                    variant="ghost"
                    className="md:hidden"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {isCreating && (
                <div className="p-4 border-b space-y-3 bg-muted/30">
                  <p className="text-sm font-medium">Start Chat with Paralegal</p>
                  <select
                    onChange={(e) => setSelectedParalegal(e.target.value)}
                    className="w-full p-2 border rounded-md text-sm"
                    value={selectedParalegal}
                  >
                    <option value="">Select Paralegal</option>
                    {paralegalList.length > 0 ? (
                      paralegalList.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.firstName} {p.lastName}
                        </option>
                      ))
                    ) : (
                      <option disabled>No paralegals found</option>
                    )}
                  </select>
                  <Button size="sm" onClick={handleStartChat} className="w-full">
                    Start Chat
                  </Button>
                </div>
              )}

              {/* ✅ Channel list that directly updates Stream context */}
              <div className="flex-1 overflow-y-auto">
                <ChannelList
                  filters={{ members: { $in: [user.id] } }}
                  sort={{ last_message_at: -1 }}
                  options={{ presence: true, state: true }}
                  onSelect={() => setSidebarOpen(false)} // Close sidebar on mobile
                />
              </div>
            </div>

            {/* 💬 Main Chat Section */}
            <div className="flex-1 relative min-w-0">
              {/* Mobile Header */}
              <div className="md:hidden border-b flex items-center justify-between p-3 bg-muted/30 sticky top-0 z-10">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <h2 className="text-base font-semibold">Chat</h2>
                <div className="w-8" />
              </div>

              {/* ✅ Default Active Channel Render */}
              
              <Channel>
                <ChannelInner />
              </Channel>
            </div>
          </div>
        </Chat>
      </div>
    </Layout>
  );
};

export default AttorneyChat;
