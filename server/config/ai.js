import OpenAI from "openai";

const useAI = async (query = null) => {
    if(!query)return
    try {
        const opeinai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: process.env.AI_CODEHELPR_AI_TOKEN
        })

        const response = await opeinai.chat.completions.create({
            model: process.env.AI_MODEL,
            messages: [
                {
                    "role": "user",
                    "content": query
                }
            ]
        })
        return ({result: response.choices[0].message.content , success:true});
    } catch (error) {
        return ({result:error.message , success:false});
    }
}

export default useAI