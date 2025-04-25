document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            
            try {
                const response = await fetch('/send-message', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: formData.get('name'),
                        email: formData.get('email'),
                        subject: formData.get('subject'),
                        message: formData.get('message')
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    alert('Wiadomość została wysłana!');
                    contactForm.reset();
                } else {
                    alert('Wystąpił błąd przy wysyłaniu wiadomości: ' + data.message);
                }
            } catch (error) {
                alert('Wystąpił błąd przy wysyłaniu wiadomości');
                console.error('Error:', error);
            } finally {
                submitBtn.disabled = false;
            }
        });
    }
    
    // Smooth scrolling dla linków nawigacyjnych
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}); 