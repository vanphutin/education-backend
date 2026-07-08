const fs = require('fs/promises');
const path = require('path');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';

async function callGemini(prompt, systemInstruction) {
  let url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
  const headers = {
    'Content-Type': 'application/json'
  };

  if (GEMINI_API_KEY.startsWith('AIzaSy')) {
    url += `?key=${GEMINI_API_KEY}`;
  } else {
    headers['Authorization'] = `Bearer ${GEMINI_API_KEY}`;
  }
  
  const payload = {
    contents: [
      {
        parts: [
          { text: prompt }
        ]
      }
    ],
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.2
    }
  };

  if (systemInstruction) {
    payload.systemInstruction = {
      parts: [
        { text: systemInstruction }
      ]
    };
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API failed with status ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Invalid response structure from Gemini API');
  }
  return JSON.parse(text);
}

async function callGroq(prompt, systemInstruction) {
  const url = 'https://api.groq.com/openai/v1/chat/completions';
  
  const messages = [];
  if (systemInstruction) {
    messages.push({ role: 'system', content: systemInstruction });
  }
  messages.push({ role: 'user', content: prompt });

  const payload = {
    model: 'llama-3.3-70b-versatile',
    messages: messages,
    response_format: { type: "json_object" },
    temperature: 0.2
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API failed with status ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error('Invalid response structure from Groq API');
  }
  return JSON.parse(text);
}

async function callLLM(prompt, systemInstruction) {
  try {
    console.log('Attempting to call Gemini API...');
    return await callGemini(prompt, systemInstruction);
  } catch (geminiError) {
    console.warn('Gemini API call failed, falling back to Groq API...', geminiError.message);
    try {
      return await callGroq(prompt, systemInstruction);
    } catch (groqError) {
      console.error('Groq API call also failed:', groqError.message);
      throw new Error(`All LLM APIs failed. Gemini: ${geminiError.message}. Groq: ${groqError.message}`);
    }
  }
}

async function reviewWeek(weekNumber, progressDb) {
  const studyDir = path.join(__dirname, '..', 'study', `tuan-${weekNumber}`);
  const mentorPromptPath = path.join(__dirname, '..', 'chuong-trinh-dao-tao', 'huong-dan', 'mentor-prompt.md');

  // 1. Read Mentor Prompt rules
  let mentorPrompt = '';
  try {
    mentorPrompt = await fs.readFile(mentorPromptPath, 'utf8');
  } catch (err) {
    console.warn('Could not read mentor-prompt.md, using fallback rules.', err.message);
    mentorPrompt = 'Bạn là Mentor AI. Chấm điểm từ 1-10 và đưa ra đánh giá bằng tiếng Việt.';
  }

  // 2. Read daily files
  const fileNames = {
    'Monday': 'thu-2.md',
    'Tuesday': 'thu-3.md',
    'Wednesday': 'thu-4.md',
    'Thursday': 'thu-5.md',
    'Friday-Saturday': 'thu-6-7.md'
  };

  const dailyContents = {};
  for (const [dayName, fileName] of Object.entries(fileNames)) {
    const filePath = path.join(studyDir, fileName);
    try {
      dailyContents[dayName] = await fs.readFile(filePath, 'utf8');
    } catch (err) {
      dailyContents[dayName] = '(Không tìm thấy file ghi chép này)';
    }
  }

  // 3. Get progress details for this week
  const weekData = progressDb.weeks.find(w => w.week_number === weekNumber);
  if (!weekData) {
    throw new Error(`Week ${weekNumber} not found in progress database`);
  }

  // 4. Construct LLM Prompt
  const systemInstruction = `${mentorPrompt}\n\n` +
    `YÊU CẦU ĐẶC BIỆT:\n` +
    `1. Phân tích xem các file ngày có phải là template rỗng hay không. Nếu người học chưa sửa hoặc chỉ có nội dung mặc định của template (chứa dấu ba chấm "..."), ngày đó được coi là chưa hoàn thành.\n` +
    `2. Chấm điểm tuần học (1-10) và viết đánh giá chi tiết (khoảng 150-300 từ) bằng tiếng Việt theo định dạng Markdown.\n` +
    `3. Trả về kết quả hoàn toàn bằng định dạng JSON khớp với cấu trúc sau:\n` +
    `{\n` +
    `  "score": number,\n` +
    `  "mentor_feedback": "Nội dung nhận xét Markdown tiếng Việt ở đây",\n` +
    `  "days_status": {\n` +
    `    "Monday": "DONE" hoặc "TODO",\n` +
    `    "Tuesday": "DONE" hoặc "TODO",\n` +
    `    "Wednesday": "DONE" hoặc "TODO",\n` +
    `    "Thursday": "DONE" hoặc "TODO",\n` +
    `    "Friday-Saturday": "DONE" hoặc "TODO"\n` +
    `  },\n` +
    `  "deliverables_status": {\n` +
    `    "deliverable_id_1": "COMPLETED" hoặc "PENDING",\n` +
    `    "deliverable_id_2": "COMPLETED" hoặc "PENDING"\n` +
    `  }\n` +
    `}\n` +
    `Hãy kiểm tra danh sách deliverables ở input dưới đây để trả ra đúng ID của các deliverable trong ngày.`;

  let prompt = `ĐÁNH GIÁ TUẦN ${weekNumber}\n\n`;
  prompt += `=== THÔNG TIN TUẦN HỌC TRONG PROGRESS.JSON ===\n`;
  prompt += `Tên tuần: ${weekData.title}\n`;
  prompt += `Deliverables:\n`;
  weekData.deliverables.forEach(d => {
    prompt += `- ID: ${d.id}, Tên: ${d.name}, Link/Evidence hiện tại: "${d.link || ''}"\n`;
  });
  prompt += `\n=== NỘI DUNG NHẬT KÝ HỌC TẬP HÀNG NGÀY ===\n`;
  for (const [dayName, content] of Object.entries(dailyContents)) {
    prompt += `--- [${dayName}] ---\n${content}\n\n`;
  }

  console.log(`Sending prompt to LLM for Week ${weekNumber} review...`);
  const responseJson = await callLLM(prompt, systemInstruction);
  console.log('LLM review result received:', responseJson);
  return responseJson;
}

module.exports = {
  reviewWeek,
  callLLM
};
