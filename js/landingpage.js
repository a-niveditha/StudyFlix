function scrollCards(direction) {
            const container = document.getElementById('continueScroll');
            const scrollAmount = 335; // card width + gap
            
            if (direction === 'left') {
                container.scrollBy({
                    left: -scrollAmount,
                    behavior: 'smooth'
                });
            } else {
                container.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            }
        }

        // Optional: Add keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') {
                scrollCards('left');
            } else if (e.key === 'ArrowRight') {
                scrollCards('right');
            }
        });