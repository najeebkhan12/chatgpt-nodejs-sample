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

    static personalAssistant(params, callback) {
        const prompt = `You're an expert personal assistant responsible for managing individual tasks. 
                        you will generate schedules, edit or update existing tasks based on user input. 
                        you will analyze the user input and indicate to call respective functions. 
                        there are two functions available, if you feel you need to get data you will call the function 
                        'get_tasks'. 
                        The 'get_tasks' function is called with two params 'duedate_start' and 'duedate_end'. 
                        The input to these params should be 'MM-DD-YYYY HH:mm:ss' with respect to user current date in their timezone.
                        The Current Date in user timezone is: ${moment().tz(params.timezone).format('MM-DD-YYYY HH:mm:ss')}
                        If there is need to update the tasks you will call the function 'get_and_update_tasks'.
                        The 'get_and_update_tasks' function is called with two param 'tasks'. 
                        The first param is an object called get_tasks_params can have multiple fields duedate_start, duedate_end, priority, complete. depending on user input
                        you will populate these fields to get tasks.
                        The second param is an object called update_tasks_params can have multiple fields duedate, priority, complete. depending on user input
                        you will populate these fields to update tasks.

                        You will also create a success message in response to user input and send it through 'message' argument available 
                        in both functions.
                        
                        Example user input and responses:
                        user input: 'get my tasks for today',
                        output:
                            function_call: get_tasks,
                            arguments: {duedate_start: ${moment().tz(params.timezone).format('MM-DD-YYYY HH:mm:ss')}, duedate_end: ${moment().tz(params.timezone).format('MM-DD-YYYY HH:mm:ss')}}

                        user input: 'get my tasks for today and reschedule for tomorrow',
                        output: 
                            function_call: get_and_update_tasks,
                            arguments: {
                                get_tasks_params: {
                                    duedate_start: ${moment().tz(params.timezone).format('MM-DD-YYYY HH:mm:ss')}, 
                                    duedate_end: ${moment().tz(params.timezone).format('MM-DD-YYYY HH:mm:ss')}
                                },
                                update_tasks_params: {
                                    duedate: ${moment().tz(params.timezone).add(1, 'day').format('MM-DD-YYYY HH:mm:ss')},
                                }
                    `
        
        openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: 'system', 
                    content: prompt
                },
                {
                    role: 'user',
                    content: params.task
                }
            ],
            functions: [
                {
                    "name": "get_tasks",
                    "description": "Get tasks for range",
                    "parameters": {
                      "type": "object",
                      "properties": {
                        "duedate_start": {
                          "type": "string",
                          "description": "due start"
                        },
                        "duedate_end": {
                          "type": "string",
                          "description": "due end"
                        },
                        "message": {
                          "type": "string",
                          "description": "success message"
                        }
                      }
                    }
                },
                {
                    name: "get_and_update_tasks",
                    parameters: {
                        type: "object",
                        properties: {
                            "get_tasks_params" : {
                                "type": "object",
                                "properties": {
                                    "duedate_start": {
                                        "type": "string",
                                        "description": "due start"
                                    },
                                    "duedate_end": {
                                        "type": "string",
                                        "description": "due end"
                                    }
                                }
                            },
                            "update_tasks_params" : {
                                "type": "object",
                                "properties": {
                                    "duedate": {
                                        "type": "string",
                                        "description": "due date for task/tasks"
                                    }
                                }
                            },
                            "message": {
                              "type": "string",
                              "description": "success message"
                            }
                        }
                    }
                }
            ],
            function_call: 'auto',
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