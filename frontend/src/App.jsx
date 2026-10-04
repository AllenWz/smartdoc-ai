import { useState } from 'react';
import { uploadDocument } from './services/documents.js';
import { askQuestion } from './services/chat.js';

export default function App() {
    const [documents, setDocuments] = useState([]);
    const [question, setQuestion] = useState('');
    const [messages, setMessages] = useState([
        { role: 'assistant', text: 'Upload a document, then ask a question about it.' },
    ]);
    const [busy, setBusy] = useState(false);

    async function handleUpload(event) {
        const file = event.target.files?.[0];
        if (!file) return;
        setDocuments((current) => [...current, { name: file.name, status: 'Uploading' }]);
        try {
        await uploadDocument(file);
        setDocuments((current) => current.map((doc) => doc.name === file.name ? { ...doc, status: 'Uploaded' } : doc));
        } catch {
        setDocuments((current) => current.map((doc) => doc.name === file.name ? { ...doc, status: 'Ready for API integration' } : doc));
        }
        event.target.value = '';
    }

    async function handleAsk(event) {
        event.preventDefault();
        const prompt = question.trim();
        if (!prompt || busy) return;
        setMessages((current) => [...current, { role: 'user', text: prompt }]);
        setQuestion('');
        setBusy(true);
        try {
        const answer = await askQuestion(prompt);
        setMessages((current) => [...current, { role: 'assistant', text: answer }]);
        } catch {
        setMessages((current) => [...current, { role: 'assistant', text: 'Chat API is not connected yet. Configure VITE_API_BASE_URL to enable document Q&A.' }]);
        } finally {
        setBusy(false);
        }
    }

    return (
        <main className="app-shell">
        <header className="topbar">
            <a className="brand" href="#">
                <span className="brand-mark">S</span>
                <span>smartdoc<span className="brand-ai">.ai</span></span>
            </a>
            <div className="topbar-right"><span className="status-dot" /> Workspace <span className="avatar">JD</span></div>
        </header>
        <section className="welcome">
            <div className="eyebrow">YOUR DOCUMENT WORKSPACE</div>
            <h1>Make your documents <span>work smarter.</span></h1>
            <p>Bring your files together and get the answers you need, faster.</p>
        </section>
        <section className="workspace-grid">
            <aside className="panel documents-panel">
            <div className="panel-heading">
                <div>
                    <div className="panel-kicker">LIBRARY</div>
                    <h2>Your documents</h2></div>
                    <span className="count-pill">{documents.length}</span>
                </div>
            <label className="upload-area">
                <span className="upload-icon">↑</span>
                <strong>Drop files here or browse</strong>
                <small>PDF, DOCX or TXT · up to 25 MB</small>
                <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleUpload} />
            </label>
                {documents.length 
                    ? <ul className="document-list">
                        {documents.map((doc, index) => <li key={`${doc.name}-${index}`}>
                                                            <span className="file-icon">▤</span>
                                                            <span className="file-name">{doc.name}<small>{doc.status}</small></span>
                                                            <span className="file-menu">···</span></li>)}</ul> 
                    : <div className="empty-library">
                        <span className="empty-icon">▤</span>
                        <strong>Your library is waiting</strong>
                        <span>Uploaded files will appear here.</span>
                    </div>}
            <div className="library-note"><span>✦</span> Documents are private to your workspace</div>
            </aside>
            <section className="panel chat-panel">
                <div className="panel-heading chat-heading">
                    <div>
                        <div className="panel-kicker">SMART ASSISTANT</div>
                        <h2>Chat with your docs</h2>
                    </div>
                    <span className="online-badge"><i /> Ready</span>
                </div>
                <div className="chat-body">
                    {messages.map((message, index) => 
                        <div className={`message ${message.role}`} key={index}>
                            <span className="message-avatar">{message.role === 'assistant' ? '✦' : 'JD'}</span>
                            <p>{message.text}</p>
                        </div>)}
                    {busy && <div className="message assistant"><span className="message-avatar">✦</span><p>Thinking…</p></div>}
                </div>
                <form className="chat-form" onSubmit={handleAsk}>
                    <input aria-label="Ask a question" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask anything about your documents…" />
                    <button type="submit" disabled={busy || !question.trim()} aria-label="Send message">↑</button>
                </form>
                <div className="chat-footnote">AI can make mistakes. Verify important information.</div>
            </section>
        </section>
        <footer>SMARTDOC AI <span>·</span> DOCUMENTS, UNDERSTOOD.</footer>
        </main>
    );
}
