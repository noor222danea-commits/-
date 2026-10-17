import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import JSZip from "jszip";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Gemini AI Client lazy init
  let aiClient: GoogleGenAI | null = null;
  function getAI(): GoogleGenAI | null {
    if (!aiClient && process.env.GEMINI_API_KEY) {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return aiClient;
  }

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      appName: "المعلم الصغير",
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString(),
    });
  });

  // Full Project ZIP Exporter Endpoint
  app.get("/api/export-project-zip", async (req, res) => {
    try {
      const zip = new JSZip();
      const rootDir = process.cwd();

      const ignoredDirs = new Set(["node_modules", "dist", ".git", ".cache", ".upm", ".temp"]);
      const ignoredFiles = new Set([".env", "bun.lock", "package-lock.json"]);

      function addDirectoryToZip(currentDir: string, zipFolder: JSZip) {
        const entries = fs.readdirSync(currentDir, { withFileTypes: true });

        for (const entry of entries) {
          const fullPath = path.join(currentDir, entry.name);
          const relativePath = path.relative(rootDir, fullPath);

          if (entry.isDirectory()) {
            if (!ignoredDirs.has(entry.name) && !entry.name.startsWith(".")) {
              const subFolder = zipFolder.folder(entry.name);
              if (subFolder) {
                addDirectoryToZip(fullPath, subFolder);
              }
            }
          } else if (entry.isFile()) {
            if (!ignoredFiles.has(entry.name) && !entry.name.endsWith(".log")) {
              try {
                const fileBuffer = fs.readFileSync(fullPath);
                zipFolder.file(entry.name, fileBuffer);
              } catch (readErr) {
                console.warn(`Could not read file ${relativePath}:`, readErr);
              }
            }
          }
        }
      }

      addDirectoryToZip(rootDir, zip);

      // Ensure a helpful README is always present at root
      const readmeContent = `# منصة المعلم الصغير (Junior Teacher Platform) 🎓
منصة تعليمية متكاملة لتدريس الأقران، تسجيل الحصص، إنشاء تقارير PDF وإرسالها للأستاذ المشرف عبر واتساب وتليجرام، مع لوحة المعلم المشرف والمساعد الذكي وتصميم زجاجي عصري فاخر (Frosted Glass).

## 🚀 طريقة التشغيل والبدء (Quick Start):

### 1. تثبيت الحزم والمكتبات:
\`\`\`bash
npm install
\`\`\`

### 2. تشغيل التطبيق في وضع التطوير (Development):
\`\`\`bash
npm run dev
\`\`\`
سيفتح التطبيق مباشرة على: [http://localhost:3000](http://localhost:3000)

### 3. بناء التطبيق للإنتاج (Production Build):
\`\`\`bash
npm run build
npm start
\`\`\`

## 💎 الميزات والوظائف المضمنة:
- 📝 **تسجيل وتوثيق حصص تدريس الأقران**: بالاسم، المرحلة، المادة، اليوم، التاريخ، تفاصيل الشرح، ومستوى الاستيعاب.
- 📄 **توليد تقارير PDF رسمية**: قابلة للطباعة والتنزيل ومطابقة لمعايير التوثيق المدرسي.
- 📲 **المشاركة الفورية**: إرسال التقارير بضغطة زر إلى الأستاذ المشرف عبر WhatsApp و Telegram.
- 👨‍🏫 **لوحة الأستاذ المشرف**: اعتماد الحصص، التقييم بالنجوم، ومنح أوسمة التميز وكتابة التوجيهات التربوية.
- 📜 **إصدار شهادات التقدير والأوسمة**: توليد شهادات شكر وتقدير رسمية للمعلم الصغير والطلاب.
- 🤖 **المساعد التربوي الذكي (Gemini)**: تحضير خطط الدروس، بنك الأسئلة، وتحسين صياغة التقارير التربوية.
- 🎨 **واجهة زجاجية عصرية (Frosted Glass)**: تفاعلية بالكامل مع دعم كامل للغة العربية والاتجاه من اليمين لليسار (RTL).
`;

      zip.file("README.md", readmeContent);

      const zipBuffer = await zip.generateAsync({
        type: "nodebuffer",
        compression: "DEFLATE",
        compressionOptions: { level: 9 },
      });

      res.setHeader("Content-Type", "application/zip");
      res.setHeader("Content-Disposition", 'attachment; filename="almoallim_alsaghir_full_project.zip"');
      res.setHeader("Content-Length", zipBuffer.length);
      return res.send(zipBuffer);
    } catch (err: any) {
      console.error("Failed to export project zip:", err);
      return res.status(500).json({ error: "Failed to create project zip", details: err.message });
    }
  });

  // AI Assistant endpoint
  app.post("/api/gemini/assist", async (req, res) => {
    try {
      const { action, prompt, studentName, subject, topic, gradeLevel, currentDraft } = req.body;

      const ai = getAI();
      if (!ai) {
        // Return structured smart educational fallback response if key is not yet set
        return res.json({
          success: true,
          isFallback: true,
          content: generateLocalEducationalHelp(action, { studentName, subject, topic, gradeLevel, currentDraft }),
        });
      }

      let systemInstruction = "أنت مساعد تربوي ذكي متخصص في برنامج 'المعلم الصغير' (Junior Teacher / Peer Tutoring). مهمتك مساعدة الطلاب المتميزين والأقران في تحضير الدروس، وصياغة تقارير تدريسية راقية بأسلوب تربوي سليم وواضح يرسل للمعلم المشرف، بالإضافة لإنشاء اختبارات قصيرة وتوصيات مميزة. لغة الرد هي اللغة العربية الفصحى التربوية والجميلة والمحفزة.";
      
      let promptText = prompt || "";

      if (action === "polish_report") {
        promptText = `الرجاء إعادة صياغة وتحسين تقرير التدريس التالي المقدم من المعلم الصغير إلى الأستاذ المشرف:
- اسم الطالب المتدرب: ${studentName || "الطالب"}
- المرحلة: ${gradeLevel || "المرحلة الدراسية"}
- المادة: ${subject || "المادة"}
- موضوع الدرس: ${topic || "موضوع الحصة"}
- مسودة تقرير المعلم الصغير: "${currentDraft || prompt}"

المطلوب: كتابة تقرير تدريسي شامل ومنظم يحتوي على:
1. ملخص ما تم شرحه ونقاط القوة التي أظهرها الطالب.
2. التحديات أو المفاهيم التي تم التركيز على توضيحها.
3. مقياس تقييمي لمدى الاستيعاب.
4. الواجب المقترح وتوصية للأستاذ المشرف لدعم الطالب في الصف.`;
      } else if (action === "generate_quiz") {
        promptText = `قم بإنشاء اختبار قصير وتفاعلي للمعلم الصغير ليختبر به زميله في مادة (${subject || "العامة"}) حول موضوع (${topic || "الدرس"}) للمرحلة (${gradeLevel || "المدرسية"}).
ضع 4 أسئلة متنوعة (اختيار من متعدد وصح أو خطأ) مع الإجابات الصحيحة وشرح مبسط يفيد المعلم الصغير في تصحيحها لزميله.`;
      } else if (action === "lesson_plan") {
        promptText = `ضع خطة تدريسية مبسطة وجذابة للمعلم الصغير ليقوم بتدريس زميله موضوع (${topic || "الدرس"}) في مادة (${subject || "المادة"}) للمرحلة (${gradeLevel || "المدرسية"}).
الخطة تشمل: التهيئة والتشويق (3 دقائق)، الشرح المبسط بالأمثلة (15 دقيقة)، التدريب التفاعلي والتطبيق (10 دقائق)، والتقييم الختامي (5 دقائق).`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: promptText,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const responseText = response.text || "تم إنشاء الاستجابة بنجاح.";
      return res.json({
        success: true,
        isFallback: false,
        content: responseText,
      });
    } catch (err: any) {
      console.error("Gemini API Error:", err);
      // Graceful fallback response
      const fallback = generateLocalEducationalHelp(req.body.action, req.body);
      return res.json({
        success: true,
        isFallback: true,
        content: fallback,
        errorNote: err.message,
      });
    }
  });

  // Local helper for realistic fallback
  function generateLocalEducationalHelp(action: string, data: any): string {
    const { studentName, subject, topic, currentDraft } = data || {};
    if (action === "polish_report") {
      return `📋 **تقرير حصة تدريس الأقران (المعلم الصغير)**

🔹 **موضوع الحصة:** ${topic || "مراجعة الدرس وتطبيقاته"} (${subject || "المادة"})
🔹 **الطالب المستفيد:** ${studentName || "زميل الصف"}

✅ **مجريات الجلسة والجهد المبذول:**
${currentDraft || "تم خلال هذه الحصة استعراض المفاهيم الأساسية، وحل التدريبات التطبيقية خطوة بخطوة مع توضيح النقاط الدقيقة."}

🎯 **مستوى التفاعل والاستيعاب:**
أظهر الطالب رغبة عالية في التعلم واستجاب بسرعة للتمارين النموذجية، مع تحقق تقدم ملحوظ في الفهم.

📝 **توصيات المعلم الصغير للأستاذ المشرف:**
- تعزيز الطالب خلال الحصة القادمة لتشجيعه على المشاركة المستمرة.
- تم إعطاؤه تمرينين منزليين لتثبيت الفهم وسنتابع نتائجهما في الجلسة المقبلة.`;
    }
    
    if (action === "generate_quiz") {
      return `✨ **اختبار قياس الفهم السريع - ${topic || subject || "الدرس"}**

1️⃣ **سؤال 1 (اختيار من متعدد):**
ما هو المفهوم الجوهري في درس اليوم؟
- أ) المبدأ الأساسي وتطبيقاته (الإجابة الصحيحة ✅)
- ب) أمثلة غير مباشرة
- ج) ملاحظات هامشية

2️⃣ **سؤال 2 (صح أو خطأ):**
هل يساعد الفهم المتدرج على حل المسائل المعقدة؟
- الإجابة: صحيح (صح ✅)

3️⃣ **سؤال 3 (تطبيق عملي):**
اذكر مثالاً حياً من واقع الحياة يرتبط بموضوع الدرس؟
- توجيه للمعلم الصغير: استمع لشرح زميلك وشجعه على التعبير بأسلوبه الخاص.`;
    }

    return `💡 **إرشادات المعلم الصغير لشرح (${topic || subject || "الدرس"}):**
1. ابدأ الحصة بسؤال تحفيزي شيق يربط الدرس بالحياة اليومية.
2. استخدم الأمثلة البسيطة قبل الانتقال للتمارين الصعبة.
3. امنح زميلك وقتاً كافياً للتفكير ولا تعطه الإجابة مباشرة.
4. وثق الملاحظات في تقريرك لإرساله للأستاذ المشرف.`;
  }

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 خادم المعلم الصغير يعمل على http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
