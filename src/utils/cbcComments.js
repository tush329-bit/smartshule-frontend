// src/utils/cbcComments.js

export const generateCbcComment = (subject, performanceLevel) => {
  const comments = {
    EE: {
      Mathematics: "Demonstrates exceptional problem-solving skills and a deep understanding of mathematical concepts. Consistently applies logic to complex scenarios.",
      English: "Exhibits outstanding communication skills, with rich vocabulary and excellent comprehension. A highly confident and articulate learner.",
      Kiswahili: "Huonyesha uelewa wa hali ya juu sana wa lugha ya Kiswahili. Huwasiliana kwa ufasaha na kutumia msamiati mzuri sana.",
      Science: "Shows remarkable curiosity and scientific inquiry skills. Consistently formulates excellent hypotheses and conducts thorough investigations.",
      default: "Exceeds all expectations in this learning area. Shows exceptional mastery, creativity, and consistent application of skills."
    },
    ME: {
      Mathematics: "Has a solid grasp of mathematical concepts and applies them accurately to solve standard problems. A steady and reliable learner.",
      English: "Communicates clearly and effectively. Demonstrates good comprehension and consistently meets the expected learning outcomes.",
      Kiswahili: "Huonyesha uelewa mzuri wa Kiswahili. Huwasiliana kwa ufasaha na kufikia viwango vinavyotarajiwa katika masomo yote.",
      Science: "Demonstrates a good understanding of scientific principles and participates actively in practical activities.",
      default: "Meets all expected learning outcomes. Demonstrates a solid understanding and consistent application of the required skills."
    },
    AE: {
      Mathematics: "Is making steady progress. With a bit more practice in foundational concepts, will soon meet the expected standards.",
      English: "Shows potential in communication. Would benefit from additional reading and vocabulary-building exercises to boost confidence.",
      Kiswahili: "Anaonyesha maendeleo mazuri. Inashauriwa kuzoea zaidi kusoma na kuandika ili kuimarisha uelewa wa lugha.",
      Science: "Shows interest in scientific concepts but needs more hands-on practice to fully grasp the practical applications.",
      default: "Approaching the expected standards. With targeted support and consistent practice, will soon meet the learning expectations."
    },
    BE: {
      Mathematics: "Requires significant foundational support. Benefiting from one-on-one guidance to build basic numeracy skills.",
      English: "Needs intensive support in basic literacy skills. Recommended to engage in daily reading and phonics practice.",
      Kiswahili: "Inahitaji msaada wa karibu zaidi ili kujenga msingi imara wa lugha. Inashauriwa kushiriki katika mazoezi ya kila siku ya kusoma.",
      Science: "Requires foundational support to engage with scientific concepts. Benefits from simplified, hands-on learning activities.",
      default: "Requires targeted intervention and foundational support. A personalized learning plan is recommended to build core competencies."
    }
  };

  const levelComments = comments[performanceLevel] || comments.ME;
  return levelComments[subject] || levelComments.default;
};