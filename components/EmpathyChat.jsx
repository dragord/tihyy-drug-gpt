import { useState } from 'react';

export default function EmpathyChat() {
  const [messages, setMessages] = useState([
    { from: 'gpt', text: 'Привіт! Я Тихий Друг. Як ти сьогодні почуваєшся?' },
  ]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { from: 'user', text: input }];
    setMessages(newMessages);
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input }),
    });
    const data = await res.json();
    setMessages([...newMessages, { from: 'gpt', text: data.response }]);
    setInput('');
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h2>Тихий Друг</h2>
      <div style={{ height: 300, overflowY: 'auto', border: '1px solid #ccc', padding: 10 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ margin: '10px 0', textAlign: msg.from === 'gpt' ? 'left' : 'right' }}>
            <b>{msg.from === 'gpt' ? 'Друг' : 'Ти'}:</b> {msg.text}
          </div>
        ))}
      </div>
      <textarea
        rows={3}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: '100%', marginTop: 10 }}
        placeholder="Напиши, як ти себе почуваєш..."
      />
      <button onClick={sendMessage} style={{ marginTop: 10 }}>Надіслати</button>
    </div>
  );
}