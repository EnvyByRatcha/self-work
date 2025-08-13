const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.aiCheckSparePart = async (req, res, next) => {
  try {
    const { payload,solution } = req.body;

    const partsText = payload
      .map(
        (p) => `SparePart ID: ${p.sparePartId}, จำนวน: ${p.units?.length || 0}`
      )
      .join("\n");

    const prompt = `
วิธีแก้ปัญหา = ${solution}

รายการอะไหล่:
${partsText}

ตรวจสอบว่า:
1. ถ้าวิธีการแก้ปัญหาระบุว่ามีการเปลี่ยนอะไหล่ ในรายการอะไหล่มีการใช้อะไหล่หรือไม่
2. ถ้าวิธีการแก้ปัญหาระบุว่ามีการเปลี่ยนอะไหล่ และมีรายการอะไหล่จริงให้ตอบ ok
3. ถ้าวิธีการแก้ปัญหาระบุว่ามีการเปลี่ยนอะไหล่ แต่ไม่มีรายการอะไหล่ให้ตอบเป็นคำเตือนสั้นๆ
4. ถ้า วิธีแก้ปัญหา = ผ่านตลอด ให้ตอบ ok
`;

    const aiRes = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const reply = aiRes.choices[0].message.content.trim();

    if (reply !== "OK") {
      return res.status(400).json({
        success: false,
        message: `AI ตรวจสอบ sparePart ไม่ผ่าน: ${reply}`,
      });
    }

    next();
  } catch (err) {
    console.error("AI SparePart Check Error:", err);
    return res.status(500).json({
      success: false,
      message: "AI ตรวจสอบ sparePart ไม่สำเร็จ",
    });
  }
};
