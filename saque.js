// Verifica se o Firebase já foi inicializado
if (!firebase.apps.length) {
    const firebaseConfig = {
        apiKey: "AIzaSyD70IyME-uH1_zqcIADQVH1U7ejg4ppaxM",
        authDomain: "apppp-82147.firebaseapp.com",
        projectId: "apppp-82147",
        storageBucket: "apppp-82147.appspot.com",
        messagingSenderId: "530626141552",
        appId: "1:530626141552:web:ad379d28d292169a7943b5",
        measurementId: "G-RJCS1804PF"
    };

    firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const auth = firebase.auth();

async function autoLogin() {
    const email = "send@gmail.com";
    const password = "123456";
    try {
        await auth.signInWithEmailAndPassword(email, password);
        console.log("Login bem-sucedido!");
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        alert("Erro ao fazer login: " + error.message);
    }
}

// Função para enviar a mensagem
window.sendMessage = async function(nome, valor, chavePix, uid) {
    // Adiciona um documento à coleção "messages"
    await db.collection('messages').add({
        nome,
        chavePix,
        uid,
        valor,
        timestamp: firebase.firestore.FieldValue.serverTimestamp() // Armazena a data/hora atual
    });

    alert('Mensagem enviada!');
};

// Chame a função de login automático quando o script carregar
autoLogin();
