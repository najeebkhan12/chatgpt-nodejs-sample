import OpenAIService from './service/openai/index.js'

const grade = "B-";

OpenAIService.suggestUniversitiesPrompt({grade}, (err, result) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log(result.choices[0].message.content);
});