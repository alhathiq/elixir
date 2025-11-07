// --- DYNAMIC CONTENT & LANGUAGE SWITCHER (FINAL VERSION) ---

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. All translatable timeline data is now here, in one place.
    const eventTimelines = {
        'Opening-day': {
            en: [
                { time: '10:00 AM', desc: 'Guest Arrival & Welcome Message' },
                { time: '10:20 AM', desc: 'Interactive Zones & Activities' },
                { time: '10:20 AM', desc: 'Serving Gifts' },
                { time: '12:00 PM', desc: 'Closing' }
            ],
            ar: [
                { time: '10:00 صباحًا', desc: 'وصول الضيوف والكلمة الافتتاحية' },
                { time: '10:20 صباحًا', desc: 'نشاطات تفاعلية' },
                { time: '10:20 صباحًا', desc: 'توزيع الهدايا' },
                { time: '12:00 مساءً', desc: 'اختتام الحفل' }
            ]
        }
        // ,
        // 'tech-conference': {
        //     en: [
        //         { time: '9:00 AM', desc: 'Registration & Morning Coffee' },
        //         { time: '10:00 AM', desc: 'Keynote: The Future of Pharmacy Tech' },
        //         { time: '1:00 PM', desc: 'Networking Lunch' }
        //     ],
        //     ar: [
        //         { time: '٩:٠٠ صباحًا', desc: 'التسجيل وقهوة الصباح' },
        //         { time: '١٠:٠٠ صباحًا', desc: 'الكلمة الرئيسية: مستقبل تكنولوجيا الصيدلة' },
        //         { time: '١:٠٠ مساءً', desc: 'غداء وتعارف' }
        //     ]
        // }
    };

    // 2. This new function dynamically builds the timelines
    const updateTimelines = (lang) => {
        document.querySelectorAll('.event[data-event-id]').forEach(eventElement => {
            const eventId = eventElement.dataset.eventId;
            const timelineContainer = eventElement.querySelector('.event-timeline');
            
            // Clear any old timeline items
            timelineContainer.innerHTML = ''; 

            const timelineData = eventTimelines[eventId]?.[lang];

            if (timelineData) {
                timelineData.forEach(item => {
                    const timelineItemHTML = `
                        <div class="timeline-item">
                            <div class="timeline-time">${item.time}</div>
                            <div class="timeline-desc">${item.desc}</div>
                        </div>
                    `;
                    timelineContainer.innerHTML += timelineItemHTML;
                });
            }
        });
    };
    
    // --- The original logic from here on ---
    const urlParams = new URLSearchParams(window.location.search);
    const memberName = urlParams.get('name');
    let currentLang = urlParams.get('lang') || 'en'; // Default to English

    const memberNameElement = document.getElementById('member-name');
    if (memberName) {
        memberNameElement.textContent = memberName;
    } else {
        memberNameElement.textContent = 'Valued Member';
    }

    const switchLanguage = (lang) => {
        currentLang = lang; // Update the current language
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

        // Original logic for data attributes (still needed for everything else)
        document.querySelectorAll('[data-en]').forEach(element => {
            element.textContent = element.getAttribute(`data-${lang}`);
        });

        // 3. Call our new function to rebuild the timelines with the correct language
        updateTimelines(lang);

        document.getElementById('lang-en').classList.toggle('active', lang === 'en');
        document.getElementById('lang-ar').classList.toggle('active', lang === 'ar');
    };

    document.getElementById('lang-en').addEventListener('click', () => switchLanguage('en'));
    document.getElementById('lang-ar').addEventListener('click', () => switchLanguage('ar'));

    // Set initial language and populate timelines on first page load
    switchLanguage(currentLang);
});

// --- BUBBLING ELIXIR CURSOR EFFECT ---

// Wait for the main content script to be loaded and ready
document.addEventListener('DOMContentLoaded', () => {

    const canvas = document.getElementById('elixir-canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas to full screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Array to hold all our bubble particles
    let particlesArray = [];

    // Use your club's vibrant color palette
    const colors = ['#238A17', '#FA7921', '#FE9920', '#FFFFFF'];

    // Track mouse position
    const mouse = {
        x: undefined,
        y: undefined,
    };

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
        
        // Create a burst of 2 particles on mouse move for a lively effect
        for (let i = 0; i < 2; i++) {
            particlesArray.push(new Particle());
        }
    });

    // Particle class
    class Particle {
        constructor() {
            this.x = mouse.x;
            this.y = mouse.y;
            this.size = Math.random() * 8 + 2; // Bubbles of various sizes (2px to 10px)
            this.speedX = Math.random() * 3 - 1.5; // Random horizontal drift
            this.speedY = Math.random() * 3 + 1;   // Bubbles always float up
            this.color = colors[Math.floor(Math.random() * colors.length)]; // Pick a random color
        }
        
        // Update particle's position and size over time
        update() {
            this.x += this.speedX;
            this.y -= this.speedY; // Move upwards
            if (this.size > 0.2) {
                this.size -= 0.1; // Shrink over time
            }
        }
        
        // Draw the particle on the canvas
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Function to manage all particles
    function handleParticles() {
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
            
            // If particle is too small, remove it from the array to save memory
            if (particlesArray[i].size <= 0.3) {
                particlesArray.splice(i, 1);
                i--;
            }
        }
    }
    
    // The main animation loop
    function animate() {
        // Clear a faint trail, which creates a beautiful "ghosting" effect
        ctx.fillStyle = 'rgba(12, 71, 103, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        handleParticles();
        
        // Create a smooth animation loop
        requestAnimationFrame(animate);
    }
    
    // Start the animation!
    animate();

    // Responsive: resize canvas if window size changes
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

}); // End of new effect script

// --- INTERACTIVE LIQUID BLOB EFFECT FOR CARD ---

document.addEventListener('DOMContentLoaded', () => {
    const card = document.querySelector('.card');
    const blob = document.querySelector('.interactive-blob');

    card.addEventListener('mousemove', (e) => {
        // Get the position of the cursor relative to the card's top-left corner
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Move the blob to the cursor's position
        // We subtract half the blob's width/height to center it on the cursor
        blob.style.transform = `translate(${x - 75}px, ${y - 75}px)`;
    });

    card.addEventListener('mouseleave', () => {
        // You can add logic here to make the blob animate out if you wish
        // For now, it will simply stay at its last position until the next hover
    });
});

// --- INTERACTIVE MAP MODAL LOGIC (with Leaflet.js - FREE) ---
document.addEventListener('DOMContentLoaded', () => {

    // No API key needed!

    const mapModalOverlay = document.getElementById('map-modal-overlay');
    const mapModalTitle = document.getElementById('map-modal-title');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const mapLinks = document.querySelectorAll('.map-link');
    let map; // Variable to hold the map instance

    // This is a professional touch: A custom marker icon using SVG
    // that uses your brand's color. No extra image files needed.
    const customMarkerIcon = L.divIcon({
        html: `<svg viewBox="0 0 24 24" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
                   <path d="M12 0C7.589 0 4 3.589 4 8c0 4.411 8 16 8 16s8-11.589 8-16c0-4.411-3.589-8-8-8zm0 12c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" fill="#FA7921"/>
               </svg>`,
        className: '', // remove default styles
        iconSize: [36, 36],
        iconAnchor: [18, 36] // Point of the icon which will correspond to marker's location
    });


    mapLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const lat = parseFloat(link.dataset.lat);
            const lon = parseFloat(link.dataset.lon);
            const title = link.dataset.title;

            mapModalTitle.textContent = title;
            mapModalOverlay.classList.add('visible');

            // Defer map initialization to allow the modal to animate in smoothly
            setTimeout(() => {
                // Initialize the Leaflet map
                map = L.map('map-container').setView([lat, lon], 15); // Adjust zoom level (15) as needed

                // Add the map tiles. We're using a free, beautiful dark theme from CartoDB.
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                    subdomains: 'abcd',
                    maxZoom: 20
                }).addTo(map);
                
                // Add our custom-styled marker to the map
                L.marker([lat, lon], {icon: customMarkerIcon}).addTo(map);

            }, 200); // 200ms delay
        });
    });

    const closeModal = () => {
        mapModalOverlay.classList.remove('visible');
        if (map) {
            // CRITICAL: Properly destroy the Leaflet map instance to free up memory
            map.remove();
            map = null;
        }
    }

    modalCloseBtn.addEventListener('click', closeModal);
    mapModalOverlay.addEventListener('click', (e) => {
        if (e.target === mapModalOverlay) {
            closeModal();
        }
    });
});


// --- INTERACTIVE MAP MODAL LOGIC (FINAL, RESILIENT EMBED METHOD) ---

// document.addEventListener('DOMContentLoaded', () => {

//     const mapModalOverlay = document.getElementById('map-modal-overlay');
//     const mapModalTitle = document.getElementById('map-modal-title');
//     const modalCloseBtn = document.getElementById('modal-close-btn');
//     const mapContainer = document.getElementById('map-container');
//     const mapLinks = document.querySelectorAll('.map-link');

//     mapLinks.forEach(link => {
//         link.addEventListener('click', (e) => {
//             e.preventDefault();

//             const lat = link.dataset.lat;
//             const lon = link.dataset.lon;
//             const title = link.dataset.title;

//             mapModalTitle.textContent = title;
//             mapModalOverlay.classList.add('visible');
//             mapContainer.innerHTML = '<div class="loader"></div>';

//             const mapFrame = document.createElement('iframe');
//             mapFrame.style.width = '100%';
//             mapFrame.style.height = '100%';
//             mapFrame.style.border = '0';
//             mapFrame.loading = 'lazy';
//             mapFrame.src = `https://www.google.com/maps?q=${lat},${lon}&output=embed&z=15`;
            
//             // Success Case: The map loaded successfully
//             mapFrame.onload = () => {
//                 mapContainer.innerHTML = '';
//                 mapContainer.appendChild(mapFrame);
//             };

//             // *** THE CRITICAL FIX FOR YOUR PROBLEM ***
//             // Failure Case: The browser blocked the map
//             mapFrame.onerror = () => {
//                 mapContainer.innerHTML = `
//                     <div class="map-error">
//                         <p>Map could not be loaded.</p>
//                         <p>This may be due to a browser extension (like an ad-blocker) or tracking protection.</p>
//                         <a href="https://www.google.com/maps?q=${lat},${lon}" target="_blank">View on Google Maps</a>
//                     </div>
//                 `;
//             };

//             // Append the iframe to a hidden div to trigger the load/error event.
//             // This is a more robust way to handle it.
//             const tempDiv = document.createElement('div');
//             tempDiv.style.display = 'none';
//             tempDiv.appendChild(mapFrame);
//             document.body.appendChild(tempDiv);
//         });
//     });

//     const closeModal = () => {
//         mapModalOverlay.classList.remove('visible');
//         mapContainer.innerHTML = '';
//     }

//     modalCloseBtn.addEventListener('click', closeModal);
//     mapModalOverlay.addEventListener('click', (e) => {
//         if (e.target === mapModalOverlay) {
//             closeModal();
//         }
//     });
// });

// --- INTERACTIVE MAP MODAL LOGIC (FINAL VERSION with Loader) ---

document.addEventListener('DOMContentLoaded', () => {

    const mapModalOverlay = document.getElementById('map-modal-overlay');
    const mapModalTitle = document.getElementById('map-modal-title');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const mapLinks = document.querySelectorAll('.map-link');
    const mapFrame = document.getElementById('google-map-frame');
    const mapContainer = document.getElementById('map-container');

    mapLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const lat = link.dataset.lat;
            const lon = link.dataset.lon;
            const title = link.dataset.title;

            // 1. Update title and show the modal
            mapModalTitle.textContent = title;
            mapModalOverlay.classList.add('visible');

            // 2. NEW: Put the container into its "loading" state.
            //    This shows the spinner and hides the old iframe content immediately.
            mapContainer.classList.add('loading');

            // 3. Build the new map URL with the satellite view
            const mapUrl = `https://www.google.com/maps?q=${lat},${lon}&output=embed&z=15&t=h`;
            
            // 4. Set the iframe src, which begins loading the new map in the background
            mapFrame.src = mapUrl;
        });
    });
    
    // NEW: The iframe's 'onload' event will fire when the map is finally ready
    mapFrame.onload = () => {
        // Once the map is loaded, take the container OUT of the "loading" state.
        // This hides the spinner and makes the now-ready iframe visible.
        mapContainer.classList.remove('loading');
    };

    const closeModal = () => {
        mapModalOverlay.classList.remove('visible');
        
        // Reset the iframe src to stop the map from running
        mapFrame.src = 'about:blank';
    }

    modalCloseBtn.addEventListener('click', closeModal);
    mapModalOverlay.addEventListener('click', (e) => {
        if (e.target === mapModalOverlay) {
            closeModal();
        }
    });

});

// --- "ADD TO GOOGLE CALENDAR" LOGIC (FINAL FEATURE) ---

document.addEventListener('DOMContentLoaded', () => {

    // Function to format dates for Google Calendar URL (YYYYMMDDTHHMMSSZ)
    const formatGoogleCalendarDate = (date) => {
        return date.toISOString().replace(/[-:.]/g, '').slice(0, 15) + 'Z';
    };

    document.querySelectorAll('.calendar-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const eventElement = link.closest('.event');
            const eventDetailsElement = link.closest('.event-details');

            // 1. Get all the data for the event
            const title = eventDetailsElement.querySelector('.event-title').textContent;
            const location = eventElement.dataset.location;
            const startTime = new Date(eventElement.dataset.startTime);
            const endTime = new Date(eventElement.dataset.endTime);
            
            // A professional touch: Get the timeline to use as the event description
            let description = '';
            eventDetailsElement.querySelectorAll('.timeline-item').forEach(item => {
                const time = item.querySelector('.timeline-time').textContent;
                const desc = item.querySelector('.timeline-desc').textContent;
                description += `${time} - ${desc}\\n`; // Use \\n for a new line in the calendar
            });

            // 2. Format the data for the URL
            const googleStartDate = formatGoogleCalendarDate(startTime);
            const googleEndDate = formatGoogleCalendarDate(endTime);

            // 3. Build the final URL, ensuring every piece of text is properly encoded
            const calendarUrl = [
                'https://www.google.com/calendar/render?action=TEMPLATE',
                `&text=${encodeURIComponent(title)}`,
                `&dates=${googleStartDate}/${googleEndDate}`,
                `&details=${encodeURIComponent(description)}`,
                `&location=${encodeURIComponent(location)}`
            ].join('');
            
            // 4. Open the link in a new tab
            window.open(calendarUrl, '_blank');
        });
    });

});