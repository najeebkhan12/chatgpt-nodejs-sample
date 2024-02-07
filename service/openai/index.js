import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: ''
});

export default class OpenAIService {
   
    static suggestUniversitiesPrompt(params, callback) {
        openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: 'system', 
                    content:`You are a US based high school student advisor and 
                        you will advice students what potential universities they can get into based on their academic grade. 
                        Also include name of universities`
                },
                {role: "user", content: `My Grade is ${params.grade}`}],
            temperature: 0.5,
            max_tokens: 256,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0
        }).then((res => {
            callback(null,res)
        })).catch((err) => {
            callback(err)
        });
    }
}