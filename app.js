// File: docs/app.js

const sections = {};
let isTransitioning = false;
let currentSection = 'dashboard';

const navButtons = document.querySelectorAll('.nav-link');
const main = document.querySelector('main');
const burger = document.querySelector('.burger');
const nav = document.querySelector('nav');

function loadSection(id) {
  if (isTransitioning || id === currentSection) return;
  isTransitioning = true;

  if (sections[id]) {
    showSection(id);
    return;
  }

  fetch(`./${id}.html`)
    .then((res) => {
      if (!res.ok) throw new Error(`${id}.html nicht gefunden.`);
      return res.text();
    })
    .then((html) => {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = html;
      const section = wrapper.querySelector('section');
      if (section) {
        section.style.opacity = '0';
        section.style.transition = 'opacity 0.3s';
        main.innerHTML = '';
        main.appendChild(section);
        requestAnimationFrame(() => (section.style.opacity = '1'));
        sections[id] = section;
        currentSection = id;
      }
    })
    .catch((err) => {
      console.error(err);
      main.innerHTML = '<section><h2>Fehler</h2><p>Seite konnte nicht geladen werden.</p></section>';
    })
    .finally(() => {
      isTransitioning = false;
    });
}

function showSection(id) {
  const section = sections[id];
  if (section) {
    main.innerHTML = '';
    main.appendChild(section);
    currentSection = id;
    section.style.opacity = '0';
    requestAnimationFrame(() => (section.style.opacity = '1'));
    isTransitioning = false;
  }
}

navButtons.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    navButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    loadSection(btn.dataset.target);
    nav.classList.remove('active');
  });
});

burger?.addEventListener('click', () => {
  nav.classList.toggle('active');
});

document.addEventListener('click', (e) => {
  if (!nav.contains(e.target) && nav.classList.contains('active')) {
    nav.classList.remove('active');
  }
});

// Dark Mode Umschalter
const toggle = document.getElementById('darkmode-toggle');
toggle?.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  document.documentElement.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
});

window.addEventListener('DOMContentLoaded', () => {
  loadSection('dashboard');
});
