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
const auth = firebase.auth();
const db = firebase.firestore();

let userId;
let clicks = 0;
let currentSaldo = 0;
let currentPontuacao = 0;

function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
          const user = userCredential.user;
          userId = user.uid;
          document.getElementById('login-container').style.display = 'none';
          document.getElementById('main-content').style.display = 'flex';

          // Obter dados do Firestore
          db.collection("users").doc(userId).get().then((doc) => {
              if (doc.exists) {
                  currentSaldo = doc.data().saldo;
                  currentPontuacao = doc.data().pontuacaoRestante;
                  document.getElementById('saldo').textContent = currentSaldo.toFixed(4);
                  document.getElementById('pontuacao').textContent = currentPontuacao;
                  updateSaqueButton();
              } else {
                  console.log("Nenhum documento encontrado!");
              }
          }).catch((error) => {
              console.log("Erro ao obter documento:", error);
          });

      })
      .catch((error) => {
          document.getElementById('error-message').textContent = error.message;
      });
}

function updateSaqueButton() {
  const saqueButton = document.getElementById('saque-button');
  saqueButton.disabled = currentSaldo < 5; // Desabilita o botão se saldo for menor que 5
}

function openSaqueModal() {
  document.getElementById('saque-modal').style.display = 'block';
}

function closeSaqueModal() {
  document.getElementById('saque-modal').style.display = 'none';
}

function sacar() {
  const nome = document.getElementById('nome').value;
  const valor = document.getElementById('valor').value;
  const chavePix = document.getElementById('chavePix').value;

  if (!nome || !valor || !chavePix) {
      alert('Por favor, preencha todos os campos.');
      return;
  }

  // Zerar saldo e restaurar pontuação
  currentSaldo = 0;
  currentPontuacao = 1000000;

  // Atualizar no Firestore
  db.collection("users").doc(userId).update({
      saldo: currentSaldo,
      pontuacaoRestante: currentPontuacao
  }).then(() => {
      document.getElementById('saldo').textContent = currentSaldo.toFixed(4);
      document.getElementById('pontuacao').textContent = currentPontuacao;
      closeSaqueModal();
      showConfirmation(nome, valor, chavePix);
      updateSaqueButton(); // Atualiza o estado do botão
  }).catch((error) => {
      console.log("Erro ao atualizar:", error);
  });
}

function showConfirmation(nome, valor, chavePix) {
  const confirmationMessage = `Nome: ${nome}\nValor do Saque: ${valor}\nChave Pix: ${chavePix}\nUID: ${userId}\nEmail: balooncash.suporte@gmail.com\nAssunto: Saque`;
  document.getElementById('confirmation-message').textContent = confirmationMessage;
  document.getElementById('confirm-modal').style.display = 'block';
}

function closeConfirmModal() {
  document.getElementById('confirm-modal').style.display = 'none';
}

function copyMessage() {
  const message = document.getElementById('confirmation-message').textContent;

  navigator.clipboard.writeText(message).then(() => {
      alert('Mensagem copiada para a área de transferência!');
  }).catch((error) => {
      console.error('Erro ao copiar a mensagem:', error);
  });
}

function inflateBalloon() {
  const balloon = document.getElementById('balloon');
  const boomMessage = document.getElementById('boom-message');
  clicks++;

  // Aumentar o tamanho do balão a cada clique
  balloon.style.width = (100 + clicks * 20) + 'px';
  balloon.style.height = (150 + clicks * 30) + 'px';

  // Se clicar 10 vezes, o balão estoura
  if (clicks >= 10) {
      balloon.classList.add('burst');
      balloon.style.width = '50px';
      balloon.style.height = '50px';

      // Mostrar a mensagem BOOM!!! com efeito
      boomMessage.classList.add('show-boom');

      // Após 3 segundos, ocultar a mensagem e atualizar saldo/pontuação
      setTimeout(() => {
          boomMessage.classList.remove('show-boom');
          clicks = 0;
          balloon.classList.remove('burst');
          balloon.style.width = '100px';
          balloon.style.height = '150px';

          // Atualizar saldo e pontuação no Firestore
          currentSaldo += 0.0001;
          currentPontuacao -= 10;

          db.collection("users").doc(userId).update({
              saldo: currentSaldo,
              pontuacaoRestante: currentPontuacao
          }).then(() => {
              document.getElementById('saldo').textContent = currentSaldo.toFixed(4);
              document.getElementById('pontuacao').textContent = currentPontuacao;
              updateSaqueButton(); // Atualiza o estado do botão
          }).catch((error) => {
              console.log("Erro ao atualizar:", error);
          });
      }, 3000);
  }
}
