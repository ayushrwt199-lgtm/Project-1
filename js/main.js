'use strict';

class AnimationObserver {
  constructor() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          requestAnimationFrame(() => {
            entry.target.classList.add('show');
            this.observer.unobserve(entry.target);
          });
        }
      });
    }, { threshold: 0.1 });
  }

  observe(element) {
    this.observer.observe(element);
  }
}

class AIChat {
  constructor() {
    this.responses = {
      pricing: {
        keywords: ['cost', 'price', 'pricing', 'package', 'fee', 'charge'],
        responses: [
          'Our pricing varies based on project scope. Here\'s a general overview:\n- Cloud Migration: Starting from $5,000\n- Security Audit: Starting from $3,000\n- Application Development: Custom quotes based on requirements\n- Support Plans: From $1,000/month\n\nWould you like to schedule a consultation for a detailed quote?',
          'Based on our standard packages:\n- Basic: $3,000 - $5,000\n- Professional: $5,000 - $10,000\n- Enterprise: Custom pricing\n\nShall we schedule a call to discuss your specific needs?'
        ]
      },
      timeline: {
        keywords: ['time', 'long', 'duration', 'timeline', 'schedule', 'when'],
        responses: [
          'Typical project timelines:\n- Cloud Migration: 2-8 weeks\n- Security Implementation: 1-4 weeks\n- Application Development: 4-12 weeks\n\nWould you like to discuss your project timeline in detail?',
          'Project duration varies based on complexity. Generally:\n- Assessment Phase: 1-2 weeks\n- Implementation: 2-8 weeks\n- Testing & Optimization: 1-2 weeks\n\nLet\'s schedule a consultation to create a detailed timeline for your project.'
        ]
      },
      services: {
        keywords: ['service', 'offer', 'provide', 'help', 'support', 'solution'],
        responses: [
          'We specialize in:\n1. Cloud Migration & Infrastructure\n2. Security & Compliance\n3. Application Development\n4. Managed IT Support\n5. Data Analytics\n6. DevOps Solutions\n\nWhich service interests you most?',
          'Our core services include:\n- Cloud Solutions (AWS, Azure, GCP)\n- Security Services (Audits, Implementation)\n- Custom Software Development\n- 24/7 IT Support\n\nWould you like more details about any specific service?'
        ]
      }
    };

    this.elements = {
      toggle: document.getElementById('aiToggle'),
      drawer: document.getElementById('aiDrawer'),
      input: document.getElementById('aiInput'),
      send: document.getElementById('aiSend'),
      messages: document.getElementById('aiMessages')
    };

    this.initialize();
  }

  initialize() {
    if (!Object.values(this.elements).every(Boolean)) return;

    this.elements.toggle.addEventListener('click', () => this.toggleDrawer());
    this.elements.send.addEventListener('click', () => this.sendMessage());
    this.elements.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });
  }

  toggleDrawer() {
    const isOpen = this.elements.drawer.style.display !== 'none';
    this.elements.drawer.style.display = isOpen ? 'none' : 'flex';
  }

  appendMessage(text, type) {
    const message = document.createElement('div');
    message.className = `msg ${type}`;
    message.textContent = text;
    this.elements.messages.appendChild(message);
    this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
    return message;
  }

  generateResponse(text) {
    const lowercaseText = text.toLowerCase();
    
    for (const [category, data] of Object.entries(this.responses)) {
      if (data.keywords.some(keyword => lowercaseText.includes(keyword))) {
        return data.responses[Math.floor(Math.random() * data.responses.length)];
      }
    }

    return 'Thank you for your interest! While I can provide general information about our services, pricing, and timelines, it would be best to discuss your specific needs in a consultation. Would you like to schedule one?';
  }

  async sendMessage() {
    const text = this.elements.input.value.trim();
    if (!text) return;

    this.appendMessage(text, 'user');
    this.elements.input.value = '';

    const loading = this.appendMessage('...', 'ai typing');
    const response = this.generateResponse(text);

    await new Promise(resolve => setTimeout(resolve, 1200));
    loading.className = 'msg ai';
    loading.textContent = response;
    this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
  }
}

class ContactForm {
  constructor() {
    this.form = document.getElementById('contactForm');
    if (!this.form) return;
    
    this.initialize();
  }

  initialize() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    this.setupValidation();
  }

  validateForm() {
    const inputs = this.form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    const errors = [];

    inputs.forEach(input => {
      input.classList.remove('error');
      const label = input.getAttribute('aria-label') || input.getAttribute('name');

      if (!input.value.trim()) {
        isValid = false;
        input.classList.add('error');
        errors.push(`${label} is required`);
        return;
      }

      if (input.type === 'email' && !this.validateEmail(input.value)) {
        isValid = false;
        input.classList.add('error');
        errors.push('Please enter a valid email address');
      }
    });

    return { isValid, errors };
  }

  validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  showFeedback(message, type = 'success') {
    const existingFeedback = this.form.querySelector('.form-feedback');
    if (existingFeedback) {
      existingFeedback.remove();
    }

    const feedback = document.createElement('div');
    feedback.className = `form-feedback ${type}`;
    feedback.textContent = type === 'success' ? message : `Please correct the following:\n${message}`;
    
    const submitBtn = this.form.querySelector('button[type="submit"]');
    submitBtn.parentNode.insertBefore(feedback, submitBtn);

    if (type === 'success') {
      feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    const { isValid, errors } = this.validateForm();
    if (!isValid) {
      this.showFeedback(errors.join('\n'), 'error');
      return;
    }

    const submitBtn = this.form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      const formData = {
        name: this.form.querySelector('input[name="name"]').value,
        company: this.form.querySelector('input[name="company"]').value,
        email: this.form.querySelector('input[name="email"]').value,
        phone: this.form.querySelector('input[name="phone"]').value,
        message: this.form.querySelector('textarea[name="message"]').value
      };

      await emailjs.send('service_5flqfvl', 'template_0s8a6z5', {
        to_name: 'Admin',
        from_name: formData.name,
        from_email: 'mukey127@gmail.com',
        company: formData.company,
        phone: formData.phone,
        message: formData.message,
        to_email: 'ayushrwt199@gmail.com',
        reply_to: formData.email
      });

      this.showFeedback('Thank you for your request! Our team will contact you within 24 hours.');
      this.form.reset();
      
      if (typeof gtag !== 'undefined') {
        gtag('event', 'consultation_request', {
          'event_category': 'forms',
          'event_label': 'consultation_form'
        });
      }
    } catch (error) {
      console.error('Email sending failed:', error);
      this.showFeedback(`Error: ${error.message}`, 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  }

  setupValidation() {
    const inputs = this.form.querySelectorAll('input[required], textarea[required]');
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        if (!input.value.trim()) {
          input.classList.add('error');
        } else if (input.type === 'email' && !this.validateEmail(input.value)) {
          input.classList.add('error');
        } else {
          input.classList.remove('error');
        }
      });

      input.addEventListener('input', () => {
        if (input.classList.contains('error')) {
          if (input.value.trim() && (input.type !== 'email' || this.validateEmail(input.value))) {
            input.classList.remove('error');
          }
        }
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', function() {
  document.documentElement.style.scrollBehavior = 'smooth';
  emailjs.init("xrPmWogYA-Bx1timJ");
  
  const animationObserver = new AnimationObserver();
  document.querySelectorAll('.fade-up').forEach(el => animationObserver.observe(el));
  
  new AIChat();
  new ContactForm();
});