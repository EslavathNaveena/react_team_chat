
import React, { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  Send,
  Smile,
  Heart,
  Hash,
  Users,
  Plus,
  AtSign,
  Menu,
  X
} from "lucide-react";
import "./App.css";

const people = ["Alan", "Bob", "Carol", "Dean", "Elin"];

const channels = [
  { id: "india", name: "India Office" },
  { id: "poland", name: "Poland Office" },
  { id: "intro", name: "Introductions" }
];

const emojis = ["😊", "😂", "❤️", "👍", "🎉", "🔥", "👏", "😍"];

function App() {
  const [activeChannel, setActiveChannel] = useState("india");
  const [sender, setSender] = useState("Alan");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState({
    india: [],
    poland: [],
    intro: []
  });

  const [showEmojis, setShowEmojis] = useState(false);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionSearch, setMentionSearch] = useState("");
  const [showPeople, setShowPeople] = useState(false);

  const inputRef = useRef(null);

  const currentChannel = channels.find(
    (channel) => channel.id === activeChannel
  );

  const currentMessages = messages[activeChannel] || [];

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [activeChannel]);

  const sendMessage = () => {
    const text = message.trim();

    if (!text) return;

    const newMessage = {
      id: Date.now() + Math.random(),
      sender,
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      }),
      likes: 0
    };

    setMessages((previous) => ({
      ...previous,
      [activeChannel]: [
        ...(previous[activeChannel] || []),
        newMessage
      ]
    }));

    setMessage("");
    setShowEmojis(false);
    setShowMentions(false);
  };

  const addEmoji = (emoji) => {
    setMessage((previous) => previous + emoji);
    inputRef.current?.focus();
  };

  const insertMention = (person) => {
    const cursor = inputRef.current?.selectionStart ?? message.length;
    const before = message.slice(0, cursor);
    const after = message.slice(cursor);
    const mentionStart = before.lastIndexOf("@");

    const newMessage =
      before.slice(0, mentionStart) + "@" + person + " " + after;

    setMessage(newMessage);
    setShowMentions(false);
    setMentionSearch("");

    setTimeout(() => {
      inputRef.current?.focus();
      const newPosition = mentionStart + person.length + 2;
      inputRef.current?.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const handleMessageChange = (event) => {
    const value = event.target.value;
    const cursor = event.target.selectionStart;

    setMessage(value);

    const beforeCursor = value.slice(0, cursor);
    const lastAt = beforeCursor.lastIndexOf("@");
    const lastSpace = beforeCursor.lastIndexOf(" ");

    if (lastAt > lastSpace) {
      const search = beforeCursor.slice(lastAt + 1);
      setMentionSearch(search);
      setShowMentions(true);
    } else {
      setShowMentions(false);
    }
  };

  const toggleLike = (messageId) => {
    setMessages((previous) => ({
      ...previous,
      [activeChannel]: previous[activeChannel].map((item) =>
        item.id === messageId
          ? { ...item, likes: item.likes === 0 ? 1 : 0 }
          : item
      )
    }));
  };

  const renderMessageText = (text) => {
    return text.split(/(@[A-Za-z]+)/g).map((part, index) =>
      part.startsWith("@") ? (
        <span className="mention" key={index}>{part}</span>
      ) : (
        <React.Fragment key={index}>{part}</React.Fragment>
      )
    );
  };

  const filteredPeople = people.filter((person) =>
    person.toLowerCase().startsWith(mentionSearch.toLowerCase())
  );

  return (
    <div className="app-container">

      {/* Sidebar */}
      <aside className="sidebar">

        <div className="brand">
          <div className="brand-icon">
            <MessageCircle size={24} />
          </div>
          <div>
            <h2>TeamChat</h2>
            <p>Workspace</p>
          </div>
        </div>

        <div className="sidebar-section">
          <div className="section-heading">
            <span>CHANNELS</span>
            <Plus size={17} />
          </div>

          {channels.map((channel) => (
            <button
              key={channel.id}
              className={`channel-item ${
                activeChannel === channel.id ? "active" : ""
              }`}
              onClick={() => setActiveChannel(channel.id)}
            >
              <Hash size={17} />
              <span>{channel.name}</span>
            </button>
          ))}
        </div>

        <div className="sidebar-section people-section">
          <div className="section-heading">
            <span>PEOPLE</span>
            <Users size={17} />
          </div>

          {people.map((person, index) => (
            <div className="person-item" key={person}>
              <div className={`avatar avatar-${index}`}>
                {person[0]}
              </div>
              <span>{person}</span>
              <span className="online-dot"></span>
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="avatar avatar-0">A</div>
          <div>
            <strong>Team Workspace</strong>
            <p>5 team members</p>
          </div>
        </div>

      </aside>

      {/* Main chat */}
      <main className="chat-main">

        <header className="chat-header">
          <div>
            <h2>
              <Hash size={21} />
              {currentChannel.name}
            </h2>
            <p>Team conversation</p>
          </div>

          <div className="header-right">
            <Users size={19} />
            <span>5 members</span>
          </div>
        </header>

        {/* Messages */}
        <section className="messages-area">

          {currentMessages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <MessageCircle size={38} />
              </div>
              <h2>Welcome to {currentChannel.name}!</h2>
              <p>
                This conversation is empty.
                Send the first message to start chatting.
              </p>
            </div>
          ) : (
            currentMessages.map((item) => {
              const personIndex = people.indexOf(item.sender);

              return (
                <div className="message-row" key={item.id}>
                  <div className={`avatar avatar-${personIndex}`}>
                    {item.sender[0]}
                  </div>

                  <div className="message-content">
                    <div className="message-info">
                      <strong>{item.sender}</strong>
                      <span>{item.time}</span>
                    </div>

                    <div className="message-bubble">
                      {renderMessageText(item.text)}
                    </div>

                    <button
                      className={`like-button ${
                        item.likes ? "liked" : ""
                      }`}
                      onClick={() => toggleLike(item.id)}
                    >
                      <Heart size={15} fill={item.likes ? "currentColor" : "none"} />
                      {item.likes > 0 && <span>{item.likes}</span>}
                    </button>
                  </div>
                </div>
              );
            })
          )}

        </section>

        {/* Composer */}
        <footer className="composer-area">

          <div className="sender-row">
            <label>Sending as:</label>
            <select
              value={sender}
              onChange={(event) => setSender(event.target.value)}
            >
              {people.map((person) => (
                <option key={person} value={person}>
                  {person}
                </option>
              ))}
            </select>
            <span className="sender-hint">
              Choose who is sending this message
            </span>
          </div>

          <div className="input-container">

            <input
              ref={inputRef}
              type="text"
              value={message}
              placeholder="Type a message... Use @ to mention someone"
              onChange={handleMessageChange}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !showMentions) {
                  sendMessage();
                }

                if (event.key === "Escape") {
                  setShowMentions(false);
                }
              }}
            />

            {/* Mention dropdown */}
            {showMentions && filteredPeople.length > 0 && (
              <div className="mention-dropdown">
                <div className="dropdown-title">
                  <AtSign size={15} />
                  Mention someone
                </div>

                {filteredPeople.map((person, index) => (
                  <button
                    key={person}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => insertMention(person)}
                  >
                    <div className={`avatar avatar-${index}`}>
                      {person[0]}
                    </div>
                    {person}
                  </button>
                ))}
              </div>
            )}

            {/* Emoji dropdown */}
            {showEmojis && (
              <div className="emoji-dropdown">
                {emojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => addEmoji(emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}

            <div className="input-actions">
              <button
                className="icon-button"
                title="Add emoji"
                onClick={() => {
                  setShowEmojis(!showEmojis);
                  setShowMentions(false);
                }}
              >
                <Smile size={21} />
              </button>

              <button
                className="icon-button"
                title="Mention someone"
                onClick={() => {
                  setMessage((previous) => previous + "@");
                  setShowMentions(true);
                  setMentionSearch("");
                  inputRef.current?.focus();
                }}
              >
                <AtSign size={20} />
              </button>

              <button
                className="send-button"
                onClick={sendMessage}
                disabled={!message.trim()}
              >
                Send <Send size={17} />
              </button>
            </div>

          </div>

          <p className="composer-help">
            Press Enter to send · Type @ to mention a team member
          </p>

        </footer>

      </main>
    </div>
  );
}

export default App;
