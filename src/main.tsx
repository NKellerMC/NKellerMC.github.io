import { createRoot } from 'react-dom/client';
import './app.css';

import { App } from './app/App';

const root = document.getElementById('root');
if (!root) throw new Error('THERAN: ponto de montagem ausente.');

createRoot(root).render(<App />);
