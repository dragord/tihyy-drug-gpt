import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Mic, Send, Smile, Moon } from 'lucide-react';

export default function EmpathyChat() {
  const [messages, setMessages] = useState([
    { from: 'gpt', text: 'Привіт! Я Тихий Друг. Як ти сьогодні почуваєшся?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const sendMessage = async (customInput = null) => {
    const userInput = customInput || input;
    if (!userInput.trim()) return;
    const newMessages = [...messages, { from: 'user', text: userInput }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput }),
      });
      const data = await res.json();
      const gptResponse = data.response || 'Вибач, я не зміг відповісти зараз.';

      setMessages([...newMessages, { from: 'gpt', text: gptResponse }]);
      setInput('');
    } catch (error) {
      setMessages([...newMessages, { from: 'gpt', text: 'Сталася помилка. Спробуй пізніше.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'uk-UA';
    recognition.start();
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      sendMessage(transcript);
    };
  };

  return (
    <div className={`max-w-xl mx-auto p-4 space-y-4 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Тихий Друг</h1>
        <Button variant="ghost" onClick={() => setDarkMode(!darkMode)}>
          <Moon className="w-5 h-5" />
        </Button>
      </div>

      <Card className="h-[500px] overflow-y-auto p-4 space-y-2 bg-muted">
        <CardContent className="space-y-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`rounded-xl p-3 w-fit max-w-[80%] ${
                msg.from === 'gpt' ? 'bg-blue-100 text-left' : 'bg-green-100 self-end ml-auto'
              }`}
            >
              {msg.text}
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        {['Сум', 'Тривога', 'Радість', 'Злість'].map((emotion) => (
          <Button key={emotion} onClick={() => sendMessage(emotion)} variant="outline">
            {emotion}
          </Button>
        ))}
      </div>

      <div className="flex gap-2 items-center">
        <Textarea
          className="flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Напиши, що відчуваєш..."
        />
        <Button onClick={handleVoiceInput} variant="secondary">
          <Mic className="w-4 h-4" />
        </Button>
        <Button onClick={() => sendMessage()} disabled={loading}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}