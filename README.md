# PyGptInterface

### PyGptInterface is a wrapper of OpenAI's API python library which allows interaction with the latest GPT models and provides a few useful functionalities.

## Functionalities : 
 - ### Session Cost Tracking
   - Calcualates OpenAI's API usage cost of the activate session based on the latest prices provided by OpenAI for each model by keeping track of the total input and output tokens.
  
 - ### Finish Reason Tracking
   - Stores each one of the session's prompt finish reasons in case a message is returned incomplete or is not returned. The finish reasons are stored containing the information returned (e.g Incomplete message due to Content Filtering, A function was called, Complete output, ...)
 - ### Easy Session Refresh
   - Easily start a new session by deleting all inputs, outputs and related information such as the total session price, inputs, outputs, etc... And store each session's information for later use.
 - ### System Message
   - Specify it at the beginning of the session.

## Implemented Models :
  - ### gpt-4o
  - ### gpt-4o-mini
  - ### gpt-4-turbo
  - ### gpt-3.5-turbo


## OpenAI API Key: 

### The user's OpenAI API Key is read locally from a `.env` file using the `dotenv` python library. In the .env file, the key should be specified by assigning it to a variable called `OPENAI_API_KEY`.
### There is also the option to manually specify the key as an argument to the `GptModel` class.

## Roadmap:
### Implement a GUI for ease of use.
 