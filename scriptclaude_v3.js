 /* ===== BURGER MENU ===== */
        function toggleMenu() {
            document.getElementById('burgerMenu').classList.toggle('open');
        }
        document.addEventListener('click', function(e) {
            const menu = document.getElementById('burgerMenu');
            const btn = document.querySelector('.burger-menu-button');
            if (menu && btn && !menu.contains(e.target) && !btn.contains(e.target)) {
                menu.classList.remove('open');
            }
        });

        /* ===== DARK MODE ===== */
        const darkBtn = document.getElementById('darkToggle');
        let isDark = localStorage.getItem('darkMode') === 'true';
        function applyDark(dark) {
            document.body.classList.toggle('dark-mode', dark);
            darkBtn.textContent = dark ? '☀️' : '🌙';
        }
        applyDark(isDark);
        function toggleDark() {
            isDark = !isDark;
            localStorage.setItem('darkMode', isDark);
            applyDark(isDark);
        }

        /* ===== LANGUAGE TOGGLE ===== */
        let currentLang = localStorage.getItem('lang') || 'fr';
        const langBtn = document.getElementById('langToggle');
        function applyLang(lang) {
            document.querySelectorAll('[data-fr][data-en]').forEach(el => {
                const text = el.getAttribute('data-' + lang);
                if (text) { el[text.includes('<') ? 'innerHTML' : 'textContent'] = text; }
            });
            document.documentElement.lang = lang;
            langBtn.textContent = lang === 'fr' ? 'EN' : 'FR';
            document.title = lang === 'fr' ? 'Product.Tad — Style & Mode au Bénin' : 'Product.Tad — Style & Fashion in Benin';
            const nlInput = document.getElementById('nlEmail');
            if (nlInput) nlInput.placeholder = lang === 'fr' ? 'ton@email.com' : 'your@email.com';
            const ratingComment = document.getElementById('ratingComment');
            if (ratingComment) ratingComment.placeholder = lang === 'fr' ? 'Ton commentaire (optionnel)...' : 'Your comment (optional)...';
        }
        applyLang(currentLang);
        function toggleLang() {
            currentLang = currentLang === 'fr' ? 'en' : 'fr';
            localStorage.setItem('lang', currentLang);
            applyLang(currentLang);
        }

        /* ===== SCROLL PROGRESS BAR ===== */
        const progressBar = document.getElementById('scroll-progress');
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            progressBar.style.width = (scrollTop / docHeight * 100) + '%';
            document.getElementById('backToTop').classList.toggle('visible', scrollTop > 400);
        }, { passive: true });

        /* ===== SCROLL REVEAL ===== */
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
        document.querySelectorAll('.reveal, .reveal-left, .reveal-scale').forEach(el => revealObserver.observe(el));

        /* ===== ANIMATED COUNTERS ===== */
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.getAttribute('data-count'));
                    const suffix = el.getAttribute('data-suffix') || '';
                    let start = 0;
                    const duration = 1600;
                    const step = Math.ceil(target / (duration / 16));
                    const timer = setInterval(() => {
                        start = Math.min(start + step, target);
                        el.textContent = start + suffix;
                        if (start >= target) clearInterval(timer);
                    }, 16);
                    counterObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });
        document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

        /* ===== PROMO POPUP ===== */
        function openPopup() { document.getElementById('promoPopup').classList.add('show'); }
        function closePopup() { document.getElementById('promoPopup').classList.remove('show'); }
        function copyCode(el) {
            navigator.clipboard.writeText('PTAD10').catch(() => {});
            el.textContent = currentLang === 'fr' ? '✓ Copié !' : '✓ Copied!';
            el.classList.add('copied');
            setTimeout(() => { el.textContent = 'PTAD10'; el.classList.remove('copied'); }, 2000);
        }
        // Show popup after 3s if not seen this session
        if (!sessionStorage.getItem('popupSeen')) {
            setTimeout(() => {
                openPopup();
                sessionStorage.setItem('popupSeen', '1');
            }, 3000);
        }

        /* ===== SEARCH ===== */
        const products = [
            { name: 'T-shirt Noir Premium', nameEn: 'Premium Black T-shirt', emoji: '👕', price: '10 000 FCFA' },
            { name: 'Chemise Blanche Classique', nameEn: 'Classic White Shirt', emoji: '👔', price: '15 000 FCFA' },
            { name: 'Veste Légère Tendance', nameEn: 'Trendy Light Jacket', emoji: '🧥', price: '28 000 FCFA' },
            { name: 'Jean Slim Moderne', nameEn: 'Modern Slim Jeans', emoji: '👖', price: '18 500 FCFA' },
            { name: 'Robe Élégante', nameEn: 'Elegant Dress', emoji: '👗', price: '22 000 FCFA' },
            { name: 'Casquette Streetwear', nameEn: 'Streetwear Cap', emoji: '🧢', price: '6 500 FCFA' },
            { name: 'Sneakers Blanches', nameEn: 'White Sneakers', emoji: '👟', price: '35 000 FCFA' },
            { name: 'Ensemble Wax', nameEn: 'Wax Set', emoji: '🥻', price: '28 000 FCFA' },
        ];
        function openSearch() {
            document.getElementById('searchOverlay').classList.add('show');
            setTimeout(() => document.getElementById('searchInput').focus(), 100);
        }
        function closeSearchOverlay() {
            document.getElementById('searchOverlay').classList.remove('show');
            document.getElementById('searchInput').value = '';
            document.getElementById('searchResults').innerHTML = '';
        }
        function closeSearch(e) {
            if (e.target === document.getElementById('searchOverlay')) closeSearchOverlay();
        }
        function runSearch(q) {
            const results = document.getElementById('searchResults');
            if (!q.trim()) { results.innerHTML = ''; return; }
            const filtered = products.filter(p => {
                const name = currentLang === 'fr' ? p.name : p.nameEn;
                return name.toLowerCase().includes(q.toLowerCase());
            });
            if (!filtered.length) {
                results.innerHTML = `<div class="search-empty">${currentLang === 'fr' ? 'Aucun résultat trouvé.' : 'No results found.'}</div>`;
                return;
            }
            results.innerHTML = filtered.map(p => `
                <div class="search-result-item" onclick="closeSearchOverlay()">
                    <span class="search-result-emoji">${p.emoji}</span>
                    <div>
                        <div class="search-result-name">${currentLang === 'fr' ? p.name : p.nameEn}</div>
                        <div class="search-result-price">${p.price}</div>
                    </div>
                </div>`).join('');
        }
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') closeSearchOverlay();
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
        });

        /* ===== PRODUCT FILTERS ===== */
        function filterProducts(btn) {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const cat = btn.getAttribute('data-filter');
            document.querySelectorAll('.product-card').forEach(card => {
                const c = card.getAttribute('data-category');
                card.classList.toggle('hidden', cat !== 'all' && c !== cat);
            });
        }

        /* ===== CAROUSEL ===== */
        let carouselIndex = 0;
        const track = document.getElementById('carouselTrack');
        const dotsContainer = document.getElementById('carouselDots');

        function getCarouselVisible() {
            return window.innerWidth <= 600 ? 1 : window.innerWidth <= 900 ? 2 : 4;
        }

        function updateCarousel() {
            const visible = getCarouselVisible();
            const cards = track.children;
            const totalSlides = Math.ceil(cards.length / visible);
            carouselIndex = Math.min(carouselIndex, totalSlides - 1);
            const cardWidth = track.parentElement.offsetWidth / visible;
            const gap = 22;
            track.style.transform = `translateX(-${carouselIndex * visible * (cardWidth + gap - gap / visible)}px)`;
            dotsContainer.innerHTML = '';
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('button');
                dot.className = 'carousel-dot' + (i === carouselIndex ? ' active' : '');
                dot.onclick = () => { carouselIndex = i; updateCarousel(); };
                dotsContainer.appendChild(dot);
            }
        }

        document.getElementById('carouselNext').onclick = () => {
            const vis = getCarouselVisible();
            const total = Math.ceil(track.children.length / vis);
            carouselIndex = (carouselIndex + 1) % total;
            updateCarousel();
        };
        document.getElementById('carouselPrev').onclick = () => {
            const vis = getCarouselVisible();
            const total = Math.ceil(track.children.length / vis);
            carouselIndex = (carouselIndex - 1 + total) % total;
            updateCarousel();
        };
        window.addEventListener('resize', updateCarousel);
        updateCarousel();

        /* ===== NEWSLETTER ===== */
        function submitNewsletter() {
            const email = document.getElementById('nlEmail').value.trim();
            if (!email || !email.includes('@')) {
                document.getElementById('nlEmail').style.borderColor = 'var(--orange)';
                setTimeout(() => document.getElementById('nlEmail').style.borderColor = '', 2000);
                return;
            }
            document.querySelector('.newsletter-form').style.display = 'none';
            document.getElementById('nlSuccess').classList.add('show');
        }

        /* ===== STAR RATING ===== */
        let selectedStar = 0;
        document.querySelectorAll('#starRow span').forEach(star => {
            star.addEventListener('mouseenter', () => {
                const val = parseInt(star.getAttribute('data-star'));
                document.querySelectorAll('#starRow span').forEach((s, i) => {
                    s.style.color = i < val ? 'var(--orange)' : '#ddd';
                });
            });
            star.addEventListener('mouseleave', () => {
                document.querySelectorAll('#starRow span').forEach((s, i) => {
                    s.classList.toggle('active', i < selectedStar);
                    if (i >= selectedStar) s.style.color = '';
                });
            });
            star.addEventListener('click', () => {
                selectedStar = parseInt(star.getAttribute('data-star'));
                document.querySelectorAll('#starRow span').forEach((s, i) => {
                    s.classList.toggle('active', i < selectedStar);
                    s.style.color = '';
                });
            });
        });
        function submitRating() {
            if (!selectedStar) {
                document.getElementById('ratingFeedback').style.color = 'var(--orange)';
                document.getElementById('ratingFeedback').textContent = currentLang === 'fr' ? 'Veuillez sélectionner une note !' : 'Please select a rating!';
                return;
            }
            document.getElementById('ratingFeedback').style.color = '#22C55E';
            document.getElementById('ratingFeedback').textContent = currentLang === 'fr'
                ? `Merci pour tes ${selectedStar} étoile${selectedStar > 1 ? 's' : ''} ! 🙏`
                : `Thank you for your ${selectedStar} star${selectedStar > 1 ? 's' : ''}! 🙏`;
            document.getElementById('ratingComment').value = '';
            selectedStar = 0;
            document.querySelectorAll('#starRow span').forEach(s => { s.classList.remove('active'); s.style.color = ''; });
        }

        /* ===== TYPEWRITER WELCOME BANNER ===== */
        const phrasesFr = [
            '✦ Bienvenue chez Product.Tad — La Mode au Bénin',
            '✦ Des vêtements modernes, livrés rapidement à Cotonou',
            '✦ Qualité, Style & Exclusivité — Product.Tad',
        ];
        const phrasesEn = [
            '✦ Welcome to Product.Tad — Fashion in Benin',
            '✦ Modern clothes, fast delivery in Cotonou',
            '✦ Quality, Style & Exclusivity — Product.Tad',
        ];
        const typeEl = document.getElementById('typewriterText');
        let phraseIndex = 0, charIndex = 0, isDeleting = false, typeDelay = 60;
        function getPhrases() { return currentLang === 'fr' ? phrasesFr : phrasesEn; }
        function typeWriter() {
            const current = getPhrases()[phraseIndex];
            if (!isDeleting) {
                typeEl.textContent = current.substring(0, ++charIndex);
                if (charIndex === current.length) { isDeleting = true; typeDelay = 2200; }
                else typeDelay = 55;
            } else {
                typeEl.textContent = current.substring(0, --charIndex);
                if (charIndex === 0) { isDeleting = false; phraseIndex = (phraseIndex + 1) % getPhrases().length; typeDelay = 350; }
                else typeDelay = 28;
            }
            setTimeout(typeWriter, typeDelay);
        }
        typeWriter();