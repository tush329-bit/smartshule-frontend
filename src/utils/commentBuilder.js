// src/utils/commentBuilder.js

export const generateSmartComment = (student, classMean) => {
  const { admission_number, mean, bestSubject, weakestSubject } = student;

  // Edge case: No marks recorded
  if (!mean) {
    return `${admission_number} was absent or has no marks recorded for this assessment. Please follow up to ensure all learning areas are evaluated.`;
  }

  // 1. Overall Trajectory (Based on mean score)
  let trajectory = "";
  if (mean >= 80) trajectory = "an excellent and highly commendable";
  else if (mean >= 70) trajectory = "a strong and upward";
  else if (mean >= 50) trajectory = "a steady and promising";
  else trajectory = "a developing";

  // 2. Class Comparison
  let comparison = "";
  const diff = mean - classMean;
  if (diff >= 5) comparison = "significantly above";
  else if (diff >= 0) comparison = "on par with";
  else comparison = "below";

  // 3. Construct the 3-part CBC Comment
  const part1 = `${admission_number} has demonstrated ${trajectory} trajectory this term, achieving a mean score of ${mean}%.`;
  const part2 = `This performance places them ${comparison} the class average of ${classMean}%.`;
  
  let part3 = "";
  if (bestSubject && weakestSubject && bestSubject.name !== weakestSubject.name) {
    part3 = `Notable strength has been observed in ${bestSubject.name}, while focused, supportive revision in ${weakestSubject.name} is highly recommended to further elevate their overall academic standing.`;
  } else if (bestSubject) {
    part3 = `Continued dedication and focused revision across all learning areas will help further elevate their overall academic standing.`;
  }

  return `${part1} ${part2} ${part3}`;
};