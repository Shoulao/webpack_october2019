import { t } from './test';
import './css/style.css';

const x = t;
x();

const h = document.createElement("h2");
h.textContent = "Test";
document.body.appendChild(h)