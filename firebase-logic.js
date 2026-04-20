import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBu5Dnfo9GYTdNKsGg2CoY5XIbpZz_lo4U",
  authDomain: "security-c0e4f.firebaseapp.com",
  projectId: "security-c0e4f",
  storageBucket: "security-c0e4f.firebasestorage.app",
  messagingSenderId: "121730591667",
  appId: "1:121730591667:web:8500eff06727062cdb79c6",
  measurementId: "G-NXVTRE07SG"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

window.accessGranted = false;

// РЕГИСТРАЦИЯ
window.handleSignUp = async () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    try {
        const res = await createUserWithEmailAndPassword(auth, email, pass);
        await setDoc(doc(db, "users", res.user.uid), { hasAccess: false });
        alert("Аккаунт создан! Теперь нужно оплатить доступ.");
    } catch (e) { alert("Ошибка: " + e.message); }
};

// ВХОД
window.handleLogin = async () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    try {
        await signInWithEmailAndPassword(auth, email, pass);
    } catch (e) { alert("Неверный логин или пароль"); }
};

// ВЫХОД
window.handleLogout = () => signOut(auth);

// СЛЕЖКА ЗА СОСТОЯНИЕМ
onAuthStateChanged(auth, async (user) => {
    const authBlock = document.getElementById('auth-block');
    const userInfo = document.getElementById('user-info');
    const content = document.getElementById('content');

    if (user) {
        authBlock.style.display = 'none';
        userInfo.style.display = 'flex';
        document.getElementById('user-email').innerText = user.email;

        const userDoc = await getDoc(doc(db, "users", user.uid));
        const hasAccess = userDoc.exists() ? userDoc.data().hasAccess : false;

        const statusLabel = document.getElementById('access-status');
        if (hasAccess) {
            statusLabel.innerText = "Доступ разрешен ✅";
            statusLabel.className = "text-green-500 font-bold";
            window.accessGranted = true;
            if(window.render) window.render(); 
        } else {
            statusLabel.innerHTML = `Нет подписки ❌ <br> <button onclick="window.location.href='https://t.me/твой_бот'" class="text-[--neon-color] underline">Оплатить в TG</button>`;
            window.accessGranted = false;
            content.innerHTML = '<div class="text-center p-10 opacity-50">Контент заблокирован. Оплатите доступ, чтобы увидеть материалы.</div>';
        }
    } else {
        authBlock.style.display = 'block';
        userInfo.style.display = 'none';
        window.accessGranted = false;
        content.innerHTML = '';
    }
});