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
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Plus, Menu, X } from "lucide-react";
import { getChatToken } from "@/services/chatAPI";
import { apiClient } from "@/lib/api/config";
import { Layout } from "@/components/ui/layout";

/* ✅ Channel inner content (messages, input, thread overlay) */
const ChannelInner = () => {
  const { thread } = useChannelStateContext();

  return (
    <div className="relative flex flex-col h-full bg-white overflow-hidden">
      <ChannelHeader />
      <div className="flex-1 overflow-y-auto pb-20 bg-white">
        <MessageList />
      </div>

      {/* Fixed input bar */}
      <div className="fixed md:absolute bottom-0 left-0 right-0 bg-white border-t p-2 z-10 md:z-0">
        <MessageInput focus />
      </div>

      {/* Thread overlay */}
      {thread && (
        <div className="fixed inset-0 md:inset-auto md:right-0 md:top-0 md:h-full md:w-[420px] bg-white border-l shadow-lg z-40 overflow-hidden">
          <Thread />
        </div>
      )}
    </div>
  );
};

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
    return () => client?.disconnectUser();
  }, []);

  // ✅ Fetch Paralegals
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

  // ✅ Start new chat
const handleStartChat = async () => {
  if (!client || !selectedParalegal) {
    toast.error("Select a paralegal to start chatting");
    return;
  }

  try {
    // 🔥 Call backend to create or get existing channel
    const res = await apiClient.post("/api/chat/create-channel", {
      targetId: selectedParalegal,
    });

    if (!res.data?.channelId) {
      throw new Error("Channel ID missing in response");
    }

    // ✅ Get the channel from Stream
    const channel = client.channel("messaging", res.data.channelId);
    await channel.watch();

    toast.success("Chat channel ready!");
    setSidebarOpen(false);
    setIsCreating(false);
  } catch (err: any) {
    console.error("❌ createChatChannel error:", err);
    toast.error(err?.response?.data?.error || "Failed to create chat");
  }
};


useEffect(() => {
  const fetchExistingChannels = async () => {
    if (!client || !user) return;
    try {
      const filter = { members: { $in: [user.id] } };
      const channels = await client.queryChannels(filter);
      const existingIds = new Set();

      channels.forEach((ch) => {
        Object.values(ch.state.members).forEach((member: any) => {
          if (member.user_id !== user.id) existingIds.add(member.user_id);
        });
      });

      // remove existing ones from paralegal list
      setParalegalList((prev) =>
        prev.filter((p) => !existingIds.has(p._id))
      );
    } catch (err) {
      console.error("❌ Failed to filter paralegals:", err);
    }
  };

  fetchExistingChannels();
}, [client, user]);


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
          <div className="flex h-full w-full bg-white relative">
            {/* 🧭 Sidebar (collapsible for mobile) */}
            <div
              className={`fixed md:static top-0 left-0 z-40 bg-white border-r shadow-lg md:shadow-none transition-transform duration-300 ease-in-out
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
                w-[80vw] sm:w-[70vw] md:w-80 h-full flex flex-col`}
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

              {/* Channel list */}
              <div className="flex-1 overflow-y-auto">
                <ChannelList
                  filters={{ members: { $in: [user.id] } }}
                  sort={{ last_message_at: -1 }}
                  options={{ presence: true, state: true }}
                  onSelect={() => setSidebarOpen(false)}
                />
              </div>
            </div>

            {/* 💬 Main Chat Section */}
           <div className="flex-1 relative min-w-0 overflow-hidden flex justify-center bg-gray-50">
  {/* Fixed width chat container */}
  <div className="chat-container w-full md:max-w-4xl lg:max-w-5xl xl:max-w-6xl bg-white border-l border-r h-full">
    <div className="md:hidden border-b flex items-center justify-between p-3 bg-muted/30 sticky top-0 z-20">
      <Button size="icon" variant="ghost" onClick={() => setSidebarOpen(true)}>
        <Menu className="h-5 w-5" />
      </Button>
      <h2 className="text-base font-semibold">Chat</h2>
      <div className="w-8" />
    </div>

    <Channel>
      <ChannelInner />
    </Channel>
  </div>
</div>
          </div>
        </Chat>
      </div>
    </Layout>
  );
};

export default AttorneyChat;
