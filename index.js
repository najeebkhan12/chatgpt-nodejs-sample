import OpenAIService from './service/openai/index.js'

const grade = "B-";

OpenAIService.suggestUniversitiesPrompt({grade}, (err, result) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log(result.choices[0].message.content);
});

const reschedulePrompt = 'reschedule my tasks from December, 2023 to february 2024';
OpenAIService.personalAssistant({task: reschedulePrompt}, (err, result) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log(result.choices[0].message.content);
});