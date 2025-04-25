const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');
const app = express();
require('dotenv').config();

// Konfiguracja
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Konfiguracja mailera
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Routing
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Pani Fizjoterapeutka',
        socialLinks: {
            instagram: 'https://www.instagram.com/panifizjoterapeutka5',
            tiktok: 'https://www.tiktok.com/@panifizjoterapeutka05',
            youtube: 'https://www.youtube.com/@panifizjoterapeutka5'
        }
    });
});

app.get('/kontakt', (req, res) => {
    res.render('contact', {
        title: 'Kontakt - Pani Fizjoterapeutka',
        socialLinks: {
            instagram: 'https://www.instagram.com/panifizjoterapeutka5',
            tiktok: 'https://www.tiktok.com/@panifizjoterapeutka05',
            youtube: 'https://www.youtube.com/@panifizjoterapeutka5'
        }
    });
});

// Obsługa formularza kontaktowego
app.post('/send-message', [
    body('name').trim().notEmpty().withMessage('Imię jest wymagane'),
    body('email').isEmail().withMessage('Podaj poprawny adres email'),
    body('subject').trim().notEmpty().withMessage('Temat jest wymagany'),
    body('message').trim().notEmpty().withMessage('Wiadomość jest wymagana')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, subject, message } = req.body;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: `Nowa wiadomość ze strony: ${subject}`,
        text: `
            Imię: ${name}
            Email: ${email}
            Wiadomość: ${message}
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Wiadomość została wysłana!' });
    } catch (error) {
        console.error('Błąd przy wysyłaniu wiadomości:', error);
        res.status(500).json({ success: false, message: 'Wystąpił błąd przy wysyłaniu wiadomości' });
    }
});

// Obsługa błędów
app.use((req, res, next) => {
    res.status(404).render('404', {
        title: '404 - Strona nie znaleziona',
        socialLinks: {
            instagram: 'https://www.instagram.com/panifizjoterapeutka5',
            tiktok: 'https://www.tiktok.com/@panifizjoterapeutka05',
            youtube: 'https://www.youtube.com/@panifizjoterapeutka5'
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT}`);
}); 