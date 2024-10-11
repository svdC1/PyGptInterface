# PyGptInterface

### PyGptInterface is a wrapper of OpenAI's API python library which allows interaction with the latest GPT models and provides a few useful functionalities.

## Functionalities : 
 - ### Session Cost Tracking
   - Calcualates OpenAI's API usage cost of the active session based on the latest prices provided by OpenAI for each model by keeping track of the total input and output tokens.
  
 - ### Finish Reason Tracking
   - Stores each one of the session's prompt finish reasons in case a message is returned incomplete or is not returned. The finish reasons are stored containing the information returned (e.g Incomplete message due to Content Filtering, A function was called, Complete output, ...)
 - ### Easy Session Refresh
   - Easily start a new session by deleting all inputs, outputs and related information such as the total session price, inputs, outputs, etc... And store each session's information for later use.
 - ### System Message
   - Specify it at the beginning of the session.

## GUI
   ![Alt text](https://imagedelivery.net/YCQ3OFRYiR1R_AeUslNHiw/229bd304-f38b-4df5-d19a-bf80bb8d2500/GitHubBanner)
   
   - Python backend and HTML/CSS/JS Frontend using [Eel](https://github.com/python-eel/Eel) library.

## Implemented Models :
  - ### gpt-4o
  - ### gpt-4o-mini
  - ### gpt-4-turbo
  - ### gpt-3.5-turbo


## OpenAI API Key: 

### The user's OpenAI API Key is read locally from a `.env` file using the `python-dotenv` library. In the .env file, the key should be specified by assigning it to a variable called `OPENAI_API_KEY`. *Make sure the .env file is located in the same directory as 'eel_app.py' (Manual Setup) or PyGptInstaller.exe (Downloading from releases)*

## Windows
### There is a packaged distribution for windows (using [pyinstaller](https://github.com/pyinstaller/pyinstaller)) available in the *releases* section


## Manual Setup

### 1. Clone this repo
```bash 
git clone https://github.com/svdC1/PyGptInterface.git
```

### 2. Install requirements
 - ### Wrapper + GUI (Eel)
 ```bash
 pip install -r requirements.txt
 ```
 - ### Wrapper Only
```bash
pip install -r requirements-wrapper.txt
```

## Run GUI

### After setting up
```bash
python eel_app.py
```


## Roadmap:
 - ### Better FrontEnd
 - ### Standalone Package for Linux
 