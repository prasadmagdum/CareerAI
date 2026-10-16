import { useEffect, useRef, useState } from "react";
import { sendCareerChat } from "../services/careerChatService";
import "./CareerChatbot.css";

const suggestions = [
    "How can I improve my resume?",
    "Help me prepare for an interview",
    "How do I plan my job search?",
];
const maxMessageLength = 1500;
const maxHistoryMessages = 12;

function CareerChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");
    const transcriptRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            transcriptRef.current?.scrollTo({
                top: transcriptRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [isOpen, messages, sending]);

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
        }
    }, [isOpen]);

    async function submitMessage(text) {
        const content = text.trim();
        if (!content || sending) return;

        if (content.length > maxMessageLength) {
            setError(`Please keep your message under ${maxMessageLength} characters.`);
            return;
        }

        const userMessage = { role: "user", content };
        const conversation = [...messages, userMessage].slice(-maxHistoryMessages);
        const requestMessages = conversation.map((message) => ({
            role: message.role,
            content: message.content.slice(-maxMessageLength),
        }));

        setMessages(conversation);
        setInput("");
        setError("");
        setSending(true);

        try {
            const response = await sendCareerChat(requestMessages);
            if (!response?.reply) {
                throw new Error("The assistant returned an empty reply.");
            }

            setMessages((current) => [
                ...current,
                { role: "assistant", content: response.reply },
            ]);
        } catch (requestError) {
            console.error("CareerAI chat error:", requestError);
            setError(
                requestError.response?.data?.message ||
                requestError.message ||
                "Unable to send your message. Please try again."
            );
        } finally {
            setSending(false);
        }
    }

    function handleSubmit(event) {
        event.preventDefault();
        submitMessage(input);
    }

    return (
        <div className="career-chatbot">
            {isOpen && (
                <section
                    className="career-chat-panel"
                    aria-label="CareerAI chat assistant"
                >
                    <header className="career-chat-header">
                        <span className="career-chat-mark" aria-hidden="true">AI</span>
                        <div>
                            <h2>CareerAI Assistant</h2>
                            <p>Career advice, powered by AI</p>
                        </div>
                        <button
                            type="button"
                            className="career-chat-close"
                            aria-label="Close chat"
                            onClick={() => setIsOpen(false)}
                        >
                            ×
                        </button>
                    </header>

                    <div
                        className="career-chat-transcript"
                        ref={transcriptRef}
                        aria-live="polite"
                    >
                        <div className="career-chat-message assistant">
                            <p>
                                Hi! Ask me about resumes, job searches, interview
                                preparation, or your next career step.
                            </p>
                        </div>

                        {messages.map((message, index) => (
                            <div
                                className={`career-chat-message ${message.role}`}
                                key={`${index}-${message.role}`}
                            >
                                <p>{message.content}</p>
                            </div>
                        ))}

                        {messages.length === 0 && (
                            <div className="career-chat-suggestions">
                                {suggestions.map((suggestion) => (
                                    <button
                                        type="button"
                                        key={suggestion}
                                        disabled={sending}
                                        onClick={() => submitMessage(suggestion)}
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        )}

                        {sending && (
                            <div
                                className="career-chat-message assistant career-chat-typing"
                                role="status"
                            >
                                <span />
                                <span />
                                <span />
                                <span className="career-chat-sr-only">
                                    CareerAI is responding
                                </span>
                            </div>
                        )}
                    </div>

                    {error && (
                        <p className="career-chat-error" role="alert">
                            {error}
                        </p>
                    )}

                    <form className="career-chat-form" onSubmit={handleSubmit}>
                        <label className="career-chat-sr-only" htmlFor="career-chat-input">
                            Message the CareerAI assistant
                        </label>
                        <input
                            id="career-chat-input"
                            ref={inputRef}
                            value={input}
                            onChange={(event) => setInput(event.target.value)}
                            placeholder="Ask a career question..."
                            maxLength={maxMessageLength}
                            aria-describedby="career-chat-character-count"
                            disabled={sending}
                        />
                        <span
                            id="career-chat-character-count"
                            className="career-chat-character-count"
                            aria-live="polite"
                        >
                            {input.length}/{maxMessageLength}
                        </span>
                        <button
                            type="submit"
                            disabled={sending || !input.trim()}
                        >
                            {sending ? "Sending" : "Send"}
                        </button>
                    </form>
                </section>
            )}

            <button
                type="button"
                className={`career-chat-toggle ${isOpen ? "is-open" : ""}`}
                aria-expanded={isOpen}
                aria-label={isOpen ? "Close CareerAI assistant" : "Open CareerAI assistant"}
                onClick={() => setIsOpen((open) => !open)}
            >
                <span className="career-chat-toggle-mark" aria-hidden="true">AI</span>
                <span>{isOpen ? "Close" : "Ask CareerAI"}</span>
            </button>
        </div>
    );
}

export default CareerChatbot;
