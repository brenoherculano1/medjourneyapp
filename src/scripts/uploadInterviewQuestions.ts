import './setupEnv';

console.log("API KEY:", process.env.VITE_FIREBASE_API_KEY);

import { db } from "../firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

const questions = [
  "Tell me about yourself.",
  "Why did you become a doctor?",
  "How would your friends describe you?",
  "What are your strengths and weaknesses?",
  "Why are you interested in our program?",
  "What are you looking for in a program?",
  "Why should we choose you?",
  "Can you tell me about this deficiency on your record?",
  "Why are you interested in this specialty?",
  "Tell us about your research experience.",
  "If you could not be a physician, what career would you choose?",
  "What do you see yourself doing in the future?",
  "What leadership roles have you held?",
  "What do you do in your spare time?",
  "What was your favorite course in medical school?",
  "Why did you choose this specialty?",
  "What are your goals?",
  "Are you interested in academic or in clinical medicine?",
  "Do you want to do research?",
  "What was the most interesting case that you have been involved in?",
  "Do you plan to do a fellowship?",
  "What is your most important accomplishment?",
  "What motivates you?",
  "What will be the toughest aspect of this specialty for you?",
  "If you could do medical school over again, what would you change?",
  "What do you think you can contribute to this program?",
  "Do you see any problems managing a professional and a personal life?",
  "Are you prepared for the rigors of residency?",
  "How much did lifestyle considerations fit into your choice of specialty?",
  "Describe the best/worst attending with whom you have ever worked.",
  "What is the greatest sacrifice you have already made to get to where you are?",
  "What problems will our specialty face in the next 5-10 years?",
  "How would you describe yourself?",
  "List three abilities you have that will make you valuable as a resident in this specialty.",
  "Describe a particularly satisfying or meaningful experience during your medical training. Why was it meaningful?",
  "What is one event you are proudest of in your life?",
  "What was the most difficult situation you encountered in medical school?",
  "What clinical experiences have you had in this specialty?",
  "How well do you take criticism?",
  "What questions do you have for me?"
];

async function uploadInterviewQuestions() {
  try {
    const interviewRef = collection(db, "interviews");
    let addedCount = 0;
    let skippedCount = 0;

    for (const text of questions) {
      const q = query(interviewRef, where("text", "==", text));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        await addDoc(interviewRef, { 
          text, 
          type: "residency-interview",
          createdAt: new Date(),
          updatedAt: new Date()
        });
        addedCount++;
      } else {
        skippedCount++;
      }
    }

    console.log(`✅ Upload concluído!`);
    console.log(`📊 Estatísticas:`);
    console.log(`   - ${addedCount} perguntas adicionadas`);
    console.log(`   - ${skippedCount} perguntas já existentes`);
  } catch (error) {
    console.error("❌ Erro ao fazer upload das perguntas:", error);
  }
}

// Executar o upload
uploadInterviewQuestions(); 