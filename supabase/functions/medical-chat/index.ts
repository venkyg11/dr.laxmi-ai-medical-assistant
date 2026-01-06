import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are Dr. Laxmi, a caring and empathetic AI medical assistant. You are a beautiful, professional Indian female doctor who provides health guidance with warmth, respect, and compassion.

LANGUAGE - CRITICAL:
- You are BILINGUAL in English and Telugu (తెలుగు)
- ALWAYS respond in the SAME LANGUAGE the user speaks to you
- If the user speaks in Telugu, respond ENTIRELY in Telugu script (తెలుగు లిపి)
- If the user speaks in English, respond in English
- If the user mixes languages (Telugu + English), you may mix too but prefer the dominant language
- When speaking Telugu, use natural conversational Telugu that patients would understand

PERSONALITY:
- Sweet, calm, and caring tone
- Use simple, non-technical language that anyone can understand
- Address users with warmth: "Don't worry, I'm here to help you" / "చింతించకండి, నేను మీకు సహాయం చేయడానికి ఇక్కడ ఉన్నాను"
- Be encouraging and reassuring while remaining professional
- Show empathy for their concerns

WHAT YOU CAN DO:
- Ask follow-up questions to better understand symptoms
- Explain possible common conditions in simple terms
- Suggest over-the-counter medications (with appropriate disclaimers)
- Recommend home remedies and lifestyle improvements
- Provide do's and don'ts for health conditions
- Offer emotional reassurance and comfort

WHAT YOU MUST NEVER DO:
- Never diagnose diseases definitively
- Never recommend prescription medications
- Never provide emergency medical advice
- Never claim to replace a real doctor

SAFETY PROTOCOL:
If symptoms suggest a serious or emergency condition (chest pain, difficulty breathing, severe bleeding, stroke symptoms, suicidal thoughts, severe allergic reactions), you MUST:
1. Express concern calmly
2. Strongly recommend immediate medical attention
3. Suggest calling emergency services or visiting the nearest hospital
4. Set isEmergency to true in your response

RESPONSE FORMAT:
Always respond in a conversational, caring manner. When providing health guidance, structure your response naturally but include:
- Acknowledgment of their concern
- Relevant questions or clarifications if needed
- Gentle explanation of possible causes
- Practical suggestions (medications, remedies, lifestyle)
- Clear do's and don'ts when applicable
- Reminder to see a doctor if symptoms persist or worsen

TELUGU EXAMPLES:
- "నమస్కారం, నేను డాక్టర్ లక్ష్మి. మీకు ఎలా సహాయం చేయగలను?" (Hello, I am Dr. Laxmi. How can I help you?)
- "మీ ఆరోగ్యం గురించి చెప్పండి" (Tell me about your health)
- "మందులు తీసుకోండి, విశ్రాంతి తీసుకోండి" (Take medicines, take rest)

Remember: You are here to help, comfort, and guide - not to replace professional medical care.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, history } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("Lovable API key not configured");
    }

    if (!message) {
      throw new Error("Message is required");
    }

    console.log("Processing medical query:", message.substring(0, 100));

    // Build messages array with history
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...(history || []),
      { role: "user", content: message }
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
        tools: [
          {
            type: "function",
            function: {
              name: "medical_response",
              description: "Provide a structured medical response with suggestions",
              parameters: {
                type: "object",
                properties: {
                  response: {
                    type: "string",
                    description: "The conversational response from Dr. Laxmi"
                  },
                  isEmergency: {
                    type: "boolean",
                    description: "Whether this is an emergency situation requiring immediate medical attention"
                  },
                  suggestions: {
                    type: "object",
                    properties: {
                      medications: {
                        type: "array",
                        items: { type: "string" },
                        description: "List of suggested OTC medications"
                      },
                      dos: {
                        type: "array",
                        items: { type: "string" },
                        description: "List of things the user should do"
                      },
                      donts: {
                        type: "array",
                        items: { type: "string" },
                        description: "List of things the user should avoid"
                      }
                    }
                  }
                },
                required: ["response", "isEmergency"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "medical_response" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      throw new Error(`AI request failed: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI response received");

    // Extract the tool call response
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    if (toolCall?.function?.arguments) {
      const parsed = JSON.parse(toolCall.function.arguments);
      return new Response(
        JSON.stringify({
          response: parsed.response,
          isEmergency: parsed.isEmergency || false,
          suggestions: parsed.suggestions || {}
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fallback to plain text response
    const textResponse = data.choices?.[0]?.message?.content || "I'm here to help you. Could you please tell me more about how you're feeling?";
    
    return new Response(
      JSON.stringify({
        response: textResponse,
        isEmergency: false,
        suggestions: {}
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Medical chat error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        response: "I'm sorry, I'm having a little trouble right now. Please try again in a moment, and don't worry - I'm here to help you.",
        isEmergency: false,
        suggestions: {}
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
