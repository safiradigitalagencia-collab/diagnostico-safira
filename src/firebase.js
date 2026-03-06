// Firebase Firestore — Integração silenciosa para salvar diagnósticos
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDz2ZK7rii85ZhOMuuw1XW_btuNwymr_R7s",
    authDomain: "diagnostico-safira.firebaseapp.com",
    projectId: "diagnostico-safira",
    storageBucket: "diagnostico-safira.firebasestorage.app",
    messagingSenderId: "314033744311",
    appId: "1:314033744311:web:84c889cc0ca86fc419a032",
    measurementId: "G-4K58E9R6RH"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Salva os dados do diagnóstico na coleção "diagnosticos" do Firestore.
 * Em caso de erro, apenas loga no console — nunca interrompe o fluxo do usuário.
 */
export async function salvarDiagnostico({ nome, respostas, score_total, gargalo_identificado, analise, consequencia }) {
    try {
        await addDoc(collection(db, 'diagnosticos'), {
            tipo_diagnostico: 'funil_de_vendas',
            nome,
            respostas,
            score_total,
            gargalo_identificado,
            analise,
            consequencia,
            created_at: serverTimestamp()
        });
        console.log('[Firebase] Diagnóstico salvo com sucesso.');
    } catch (error) {
        console.warn('[Firebase] Erro ao salvar diagnóstico (o resultado continua disponível):', error);
    }
}
