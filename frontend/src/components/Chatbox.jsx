import React, { useState } from 'react';
import { motion } from 'framer-motion';
import chatbot from '../assets/chatbox.avif';

const Chatbot = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    const handleUserInputChange = (e) => {
        setUserInput(e.target.value);
    };

    const sendMessage = () => {
        if (userInput.trim() === '') return;

        setMessages([...messages, { sender: 'user', text: userInput }]);
        setUserInput('');
        setIsTyping(true);

        setTimeout(() => {
            setIsTyping(false);
            const botResponse = getBotResponse(userInput);
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: 'bot', text: botResponse },
            ]);
        }, 1000);
    };

    const getBotResponse = (input) => {
        const responses = {
            hello: '👋 Hi there! How can I help you?',
            'how are you': `😊 I'm just a bot, but I'm doing well!`,
            bye: '👋 Goodbye! Have a great day!',
            help: '💡 Sure! What do you need help with?',
        };

        const normalizedInput = input.toLowerCase();
        return responses[normalizedInput] || `🤔 I'm not sure how to respond to that.`;
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div>
            <motion.img
                src={chatbot} 
                alt="Chatbot"
                onClick={toggleChat}
                className="fixed bottom-5 right-5 w-16 cursor-pointer transition-transform transform hover:scale-110"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
            />
            {isChatOpen && (
                <motion.div 
                    initial={{ opacity: 0, y: 50 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.3 }}
                    className="fixed bottom-20 right-5 w-80 max-w-[90%] bg-white border border-gray-300 rounded-lg shadow-lg flex flex-col">
                    <div className="bg-blue-500 text-white p-2 text-center cursor-pointer relative" onClick={toggleChat}>
                        Chat with Us
                        <span className="absolute right-2 top-2 text-2xl cursor-pointer">&times;</span>
                    </div>
                    <div className="p-3 flex flex-col h-80">
                        <div className="flex-1 overflow-y-auto mb-3 p-2 border border-gray-200 rounded-lg bg-gray-50">
                            {messages.map((message, index) => (
                                <motion.div 
                                    key={index} 
                                    initial={{ opacity: 0, x: message.sender === 'user' ? 50 : -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className={`p-2 mb-2 rounded-lg ${message.sender === 'user' ? 'bg-teal-100 text-right' : 'bg-gray-200 text-left'}`}>
                                    {message.text}
                                </motion.div>
                            ))}
                            {isTyping && <div className="italic text-gray-500">Bot is typing...</div>}
                        </div>
                        <div className="flex">
                            <input
                                type="text"
                                value={userInput}
                                onChange={handleUserInputChange}
                                onKeyDown={handleKeyPress} 
                                className="p-2 border border-gray-300 rounded-l-lg flex-1"
                                placeholder="Type a message..."
                            />
                            <button
                                onClick={sendMessage}
                                className="p-2 bg-blue-500 text-white rounded-r-lg transition-colors duration-300 hover:bg-blue-700"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default Chatbot;
