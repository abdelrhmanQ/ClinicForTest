/* ============================================================
   MEDCORE CLINIC — script.js
   ============================================================ */

(function () {
  'use strict';

  /* ============================================================
     1. NAVBAR — scroll effect + hamburger + active links
     ============================================================ */
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  const allNavLinks = document.querySelectorAll('.nav-link');

  // Scroll: add shadow class
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
    updateActiveLink();
    toggleBackToTop();
  }, { passive: true });

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close mobile menu on link click
  allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Active link highlight based on scroll position
  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id], div[id]');
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) current = section.id;
    });
    allNavLinks.forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', href === current);
    });
  }

  /* ============================================================
     2. BACK TO TOP
     ============================================================ */
  const backToTopBtn = document.getElementById('backToTop');

  function toggleBackToTop() {
    backToTopBtn.classList.toggle('visible', window.scrollY > 400);
  }

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ============================================================
     3. TESTIMONIALS SLIDER
     ============================================================ */
  const track    = document.getElementById('testimonialTrack');
  const slides   = document.querySelectorAll('.testimonial-slide');
  const prevBtn  = document.getElementById('testiPrev');
  const nextBtn  = document.getElementById('testiNext');
  const dotsContainer = document.getElementById('testiDots');

  let currentSlide = 0;
  let autoSlideTimer = null;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });

  function goToSlide(index) {
    currentSlide = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    document.querySelectorAll('.testi-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  function nextSlide() { goToSlide(currentSlide + 1); }
  function prevSlide() { goToSlide(currentSlide - 1); }

  nextBtn.addEventListener('click', () => { nextSlide(); resetAutoSlide(); });
  prevBtn.addEventListener('click', () => { prevSlide(); resetAutoSlide(); });

  function startAutoSlide() {
    autoSlideTimer = setInterval(nextSlide, 5000);
  }
  function resetAutoSlide() {
    clearInterval(autoSlideTimer);
    startAutoSlide();
  }
  startAutoSlide();

  // Pause on hover
  const sliderEl = document.getElementById('testimonialSlider');
  sliderEl.addEventListener('mouseenter', () => clearInterval(autoSlideTimer));
  sliderEl.addEventListener('mouseleave', startAutoSlide);

  /* ============================================================
     4. APPOINTMENT FORM VALIDATION
     ============================================================ */
  const apptForm    = document.getElementById('apptForm');
  const formSuccess = document.getElementById('formSuccess');

  const requiredFields = [
    { id: 'fname',  errId: 'err-fname',  label: 'Full name is required.' },
    { id: 'fphone', errId: 'err-fphone', label: 'Phone number is required.' },
    { id: 'femail', errId: 'err-femail', label: 'Valid email address is required.', type: 'email' },
    { id: 'fdept',  errId: 'err-fdept',  label: 'Please select a department.' },
    { id: 'fdate',  errId: 'err-fdate',  label: 'Preferred date is required.' },
    { id: 'ftime',  errId: 'err-ftime',  label: 'Preferred time is required.' },
  ];

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  apptForm.addEventListener('submit', function (e) {
    e.preventDefault();
    let isValid = true;

    requiredFields.forEach(field => {
      const el  = document.getElementById(field.id);
      const err = document.getElementById(field.errId);
      const val = el.value.trim();

      let fieldValid = val !== '';
      if (field.type === 'email' && val !== '') fieldValid = validateEmail(val);

      if (!fieldValid) {
        el.classList.add('error');
        err.textContent = field.label;
        isValid = false;
      } else {
        el.classList.remove('error');
        err.textContent = '';
      }
    });

    if (isValid) {
      formSuccess.classList.add('visible');
      apptForm.querySelectorAll('input, select, textarea').forEach(el => el.value = '');
      setTimeout(() => formSuccess.classList.remove('visible'), 6000);
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  // Live validation on change
  requiredFields.forEach(field => {
    const el  = document.getElementById(field.id);
    const err = document.getElementById(field.errId);
    el.addEventListener('input', () => {
      const val = el.value.trim();
      let valid = val !== '';
      if (field.type === 'email' && val !== '') valid = validateEmail(val);
      el.classList.toggle('error', !valid);
      err.textContent = valid ? '' : field.label;
    });
  });

  /* ============================================================
     5. DEPARTMENT MODALS
     ============================================================ */
  const deptData = {
    dermatology: {
      title: 'Dermatology',
      tag: 'Skin, Hair & Nails',
      description: 'Our Dermatology Department provides comprehensive care for a wide range of skin conditions, from common dermatitis and acne to complex autoimmune disorders and skin cancer diagnosis. We combine clinical expertise with advanced technologies including dermoscopy and phototherapy.',
      services: [
        'Medical & cosmetic dermatology consultations',
        'Skin cancer screening and dermoscopy',
        'Acne, eczema & psoriasis management',
        'Laser therapy and phototherapy',
        'Patch testing for allergic contact dermatitis',
        'Minor surgical procedures and biopsies',
      ],
      icon: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none"><ellipse cx="18" cy="18" rx="12" ry="14" stroke="#0891b2" stroke-width="1.8"/><path d="M12 18c2-4 10-4 12 0" stroke="#0891b2" stroke-width="1.8" stroke-linecap="round"/><circle cx="14" cy="14" r="1.5" fill="#0891b2"/><circle cx="22" cy="14" r="1.5" fill="#0891b2"/></svg>`
    },
    dentistry: {
      title: 'Dentistry',
      tag: 'Oral & Dental Health',
      description: 'Our full-service dental clinic offers preventive, restorative, and cosmetic dental care for patients of all ages. Our team of experienced dentists uses digital imaging and modern techniques to ensure comfortable, effective treatment.',
      services: [
        'Routine dental check-ups and cleanings',
        'Fillings, crowns, and root canal therapy',
        'Orthodontics including clear aligners',
        'Dental implants and prosthodontics',
        'Teeth whitening and cosmetic veneers',
        'Oral surgery and wisdom tooth extraction',
      ],
      icon: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none"><path d="M12 6c-4 0-6 3-6 6 0 5 3 12 5 14 1 2 3 2 4 0l1-4 1 4c1 2 3 2 4 0 2-2 5-9 5-14 0-3-2-6-6-6-2 0-3 1-4 2-1-1-2-2-4-2z" stroke="#0891b2" stroke-width="1.8" stroke-linejoin="round"/></svg>`
    },
    pediatrics: {
      title: 'Pediatrics',
      tag: 'Children\'s Health',
      description: 'Our Paediatrics Department provides specialised medical care for infants, children, and adolescents from birth through 18 years. Our child-friendly environment and experienced paediatricians ensure every young patient feels safe and at ease.',
      services: [
        'Newborn health checks and developmental assessment',
        'Routine immunisations and vaccinations',
        'Management of childhood infections and illnesses',
        'Nutritional counselling and growth monitoring',
        'Adolescent health and mental wellbeing',
        'Paediatric allergy and asthma management',
      ],
      icon: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none"><circle cx="18" cy="12" r="6" stroke="#0891b2" stroke-width="1.8"/><path d="M8 30c0-5.52 4.48-10 10-10s10 4.48 10 10" stroke="#0891b2" stroke-width="1.8" stroke-linecap="round"/></svg>`
    },
    cardiology: {
      title: 'Cardiology',
      tag: 'Heart & Cardiovascular',
      description: 'The MedCore Cardiology Department is equipped with state-of-the-art diagnostic and interventional technology. Our cardiologists specialise in the prevention, diagnosis, and treatment of a full spectrum of heart and vascular conditions.',
      services: [
        'ECG and 24-hour Holter monitoring',
        'Echocardiography and stress echo',
        'Cardiac CT and coronary calcium scoring',
        'Interventional procedures and stenting',
        'Heart failure and arrhythmia management',
        'Preventive cardiology and cardiac rehabilitation',
      ],
      icon: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none"><path d="M18 30S6 22 6 13a7 7 0 0112-4.9A7 7 0 0130 13c0 9-12 17-12 17z" stroke="#0891b2" stroke-width="1.8" stroke-linejoin="round"/></svg>`
    },
    orthopedics: {
      title: 'Orthopedics',
      tag: 'Bones, Joints & Muscles',
      description: 'Our Orthopaedics Department delivers comprehensive musculoskeletal care, from sports injuries and fractures to complex joint replacements and spinal surgery. We focus on minimally invasive approaches to ensure faster recovery times.',
      services: [
        'Sports injury assessment and rehabilitation',
        'Joint replacement (hip, knee, shoulder)',
        'Arthroscopic and minimally invasive surgery',
        'Fracture management and trauma care',
        'Spinal conditions and disc disorders',
        'Physiotherapy and post-operative rehabilitation',
      ],
      icon: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none"><path d="M14 8c0-3 4-4 4 0v20c0 3-4 4-4 0" stroke="#0891b2" stroke-width="1.8" stroke-linecap="round"/><path d="M10 16h16" stroke="#0891b2" stroke-width="1.8" stroke-linecap="round"/></svg>`
    },
    radiology: {
      title: 'Radiology',
      tag: 'Imaging & Diagnostics',
      description: 'MedCore\'s Radiology Department provides high-resolution imaging services using the latest equipment. Our radiologists deliver rapid, accurate reports to support diagnosis and treatment planning across all specialties.',
      services: [
        'MRI (1.5T and 3T scanners)',
        'Multi-slice CT scanning',
        'Digital X-ray and fluoroscopy',
        'Ultrasound including vascular and obstetric',
        'Bone density (DEXA) scanning',
        'Interventional radiology procedures',
      ],
      icon: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none"><rect x="6" y="6" width="24" height="24" rx="4" stroke="#0891b2" stroke-width="1.8"/><circle cx="18" cy="18" r="6" stroke="#0891b2" stroke-width="1.8"/><circle cx="18" cy="18" r="2" fill="#0891b2"/></svg>`
    }
  };

  window.openDeptModal = function (key) {
    const data = deptData[key];
    if (!data) return;
    const html = `
      <div class="modal-dept-header">
        <div class="modal-icon">${data.icon}</div>
        <div>
          <span>${data.tag}</span>
          <h3>${data.title}</h3>
        </div>
      </div>
      <div class="modal-body">
        <p>${data.description}</p>
        <h4 style="font-size:.85rem;font-weight:700;color:var(--gray-500);text-transform:uppercase;letter-spacing:.06em;margin-bottom:12px;">Services Include</h4>
        <ul>${data.services.map(s => `<li>${s}</li>`).join('')}</ul>
        <a href="#appointment" class="btn btn-primary" onclick="closeModal('deptModal')" style="width:100%;justify-content:center;border-radius:var(--radius-sm);">Book an Appointment</a>
      </div>
    `;
    document.getElementById('deptModalContent').innerHTML = html;
    openModal('deptModal');
  };

  /* ============================================================
     6. DOCTOR MODALS
     ============================================================ */
  const doctorData = {
    sarah: {
      initials: 'SW', color: '#0891b2', bg: '#e0f2fe',
      name: 'Dr. Sarah Whitmore',
      specialty: 'Cardiologist',
      experience: '15+ Years',
      education: 'Harvard Medical School',
      languages: 'English, French',
      availability: 'Mon, Wed, Fri',
      bio: 'Dr. Whitmore is a distinguished interventional cardiologist and Fellow of the American College of Cardiology. She completed her fellowship at Johns Hopkins Hospital and has authored over 30 peer-reviewed publications in cardiovascular medicine. Her clinical focus includes complex coronary interventions, structural heart disease, and preventive cardiology.',
      expertise: ['Interventional Cardiology', 'Structural Heart Disease', 'Preventive Cardiology', 'Cardiac Imaging'],
    },
    james: {
      initials: 'JR', color: '#7c3aed', bg: '#ede9fe',
      name: 'Dr. James Reyes',
      specialty: 'Orthopedic Surgeon',
      experience: '12+ Years',
      education: 'Stanford Medical School',
      languages: 'English, Spanish',
      availability: 'Tue, Thu, Sat',
      bio: 'Dr. Reyes is a board-certified orthopaedic surgeon specialising in minimally invasive joint replacement and sports medicine. He trained at the Hospital for Special Surgery in New York and has performed over 2,000 joint replacement procedures. He works closely with physiotherapists to deliver holistic rehabilitation programmes.',
      expertise: ['Joint Replacement', 'Sports Medicine', 'Arthroscopic Surgery', 'Spinal Disorders'],
    },
    aisha: {
      initials: 'AK', color: '#059669', bg: '#d1fae5',
      name: 'Dr. Aisha Khan',
      specialty: 'Dermatologist',
      experience: '10+ Years',
      education: 'University of Oxford',
      languages: 'English, Urdu, Arabic',
      availability: 'Mon, Tue, Thu',
      bio: 'Dr. Khan is a medical and cosmetic dermatologist with a sub-specialty in skin oncology. She completed her dermatology residency at the Mayo Clinic and has published research on melanoma early detection. She is passionate about patient education and empowering individuals to protect and care for their skin.',
      expertise: ['Skin Oncology', 'Cosmetic Dermatology', 'Eczema & Psoriasis', 'Laser Treatments'],
    },
    marcus: {
      initials: 'ML', color: '#dc2626', bg: '#fee2e2',
      name: 'Dr. Marcus Levi',
      specialty: 'Pediatrician',
      experience: '18+ Years',
      education: 'University of Michigan',
      languages: 'English, Hebrew',
      availability: 'Mon–Fri',
      bio: 'Dr. Levi is a highly respected paediatrician with over 18 years of experience caring for children from birth through adolescence. His gentle, family-centred approach and deep commitment to child development have made him one of the most trusted doctors at MedCore. He is a member of the American Academy of Pediatrics.',
      expertise: ['Neonatal Care', 'Child Development', 'Paediatric Nutrition', 'Adolescent Health'],
    }
  };

  window.openDoctorModal = function (key) {
    const doc = doctorData[key];
    if (!doc) return;
    const html = `
      <div class="modal-doc-header">
        <div class="modal-doc-avatar" style="background:${doc.bg};color:${doc.color};">${doc.initials}</div>
        <h3>${doc.name}</h3>
        <span class="modal-doc-spec">${doc.specialty}</span>
      </div>
      <div class="modal-detail-grid">
        <div class="mdg-item"><span>Experience</span><strong>${doc.experience}</strong></div>
        <div class="mdg-item"><span>Education</span><strong>${doc.education}</strong></div>
        <div class="mdg-item"><span>Languages</span><strong>${doc.languages}</strong></div>
        <div class="mdg-item"><span>Availability</span><strong>${doc.availability}</strong></div>
      </div>
      <div class="modal-body">
        <p>${doc.bio}</p>
        <h4 style="font-size:.85rem;font-weight:700;color:var(--gray-500);text-transform:uppercase;letter-spacing:.06em;margin-bottom:12px;">Areas of Expertise</h4>
        <ul>${doc.expertise.map(e => `<li>${e}</li>`).join('')}</ul>
        <a href="#appointment" class="btn btn-primary" onclick="closeModal('doctorModal')" style="width:100%;justify-content:center;border-radius:var(--radius-sm);">Book with ${doc.name.split(' ')[1]}</a>
      </div>
    `;
    document.getElementById('doctorModalContent').innerHTML = html;
    openModal('doctorModal');
  };

  /* ============================================================
     7. MODAL HELPERS
     ============================================================ */
  window.openModal = function (id) {
    const overlay = document.getElementById(id);
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeModal = function (id) {
    const overlay = document.getElementById(id);
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  // Close on overlay click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', function (e) {
      if (e.target === this) closeModal(this.id);
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(o => closeModal(o.id));
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  /* ============================================================
     8. SMOOTH SCROLL for anchor links
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 75;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ============================================================
     9. SCROLL REVEAL (lightweight, no lib)
     ============================================================ */
  const revealEls = document.querySelectorAll(
    '.feature-card, .dept-card, .doctor-card, .service-item, .contact-card, .stat-item, .testi-card'
  );

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, i * 60);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
    revealObserver.observe(el);
  });

  /* ============================================================
     10. MIN DATE for appointment date picker
     ============================================================ */
  const dateInput = document.getElementById('fdate');
  if (dateInput) {
    const today = new Date();
    const yyyy  = today.getFullYear();
    const mm    = String(today.getMonth() + 1).padStart(2, '0');
    const dd    = String(today.getDate() + 1).padStart(2, '0');
    dateInput.setAttribute('min', `${yyyy}-${mm}-${dd}`);
  }

  // Initial call
  updateActiveLink();
  toggleBackToTop();

})();