import eel
import logging
from openai_api_wrapper import GptModel
from dotenv import dotenv_values
import time


eel.init('web')

logging.basicConfig(level="INFO",
                    style="{",
                    format="{name} - {levelname} - {message}")


@eel.expose
def setup_model(version: str = None, system_msg: str = 'default',
                ApiKey: str | None = None, max_context: int = 100000):

    if version is None:
        logging.info("Default Model Selected - 'gpt-4o-mini'")
        version = 'gpt-4o-mini'
    else:
        logging.info(f"Got Model From Settings: {version}")

    if system_msg == 'default':
        default_sys = 'You are a helpful assistant.'
        logging.info(f"Default System Message Selected - '{default_sys}'")
    else:
        logging.info(f"Got System Message from Settings: {system_msg}")
    logging.info(f"Selected Max Content: {max_context}")

    if ApiKey is None:
        try:
            ApiKey = dotenv_values('.env')['OPENAI_API_KEY']
        except KeyError:
            logging.error("Could not find 'OPENAI_API_KEY' in .env file!")
            return "Error when loading model! Please check console."

        try:
            gpt_model = GptModel(version, system_msg,
                                 False, ApiKey,
                                 max_context)
            return gpt_model.serialize()
        except Exception as e:
            logging.error(f"Error when loading model: {str(e)}")
            return "Error when loading model! Please check console."
    else:
        try:
            gpt_model = GptModel(version, system_msg,
                                 False, ApiKey,
                                 max_context)
            return gpt_model.serialize()
        except Exception as e:
            logging.error(f"Error when loading model: {str(e)}")
            return "Error when loading model! Please check console."


@eel.expose
def process_message(message: str, model_dict: dict):
    logging.info(f"Received prompt: {message}")
    logging.info("Received Model JSON:See browser console to check contents.")
    logging.info("Loading Instance...")
    gpt_model = GptModel.load_from_dict(model_dict)
    logging.info("Processing Request...")
    s = time.time()
    response = gpt_model.request(message)
    f = time.time()
    rt = s - f
    logging.info(f"Finished Processing Request in {rt}s")
    f_reason = gpt_model.text_finishin_reasons[-1]
    logging.info(f"End Reason : {f_reason}")
    return {'response': response['response'],
            'response_time': rt,
            'serialized_model': gpt_model.serialize()}


@eel.expose
def get_info(model_dict: dict):
    logging.info("Received Info Request")
    logging.info("Initializing Model Instance...")
    gpt_model = GptModel.load_from_dict(model_dict)
    info_dict = {'messages': gpt_model.messages,
                 'inputs': gpt_model.inputs,
                 'outputs': gpt_model.outputs,
                 'total_price': gpt_model.total_price,
                 'input_tokens': gpt_model.input_tokens,
                 'output_tokens': gpt_model.output_tokens,
                 'total_tokens': gpt_model.total_tokens,
                 'request_count': gpt_model.request_count,
                 'f_reasons': gpt_model.text_finishin_reasons,
                 'sessions': gpt_model.sessions_info}
    logging.info("Info Returned Sucessfully")
    return {'info': info_dict,
            'serialized_model': gpt_model.serialize()}


@eel.expose
def refresh_session(model_dict: dict):
    logging.info("Received Request to Refresh Session")
    logging.info("Initializing Model Instance...")
    gpt_model = GptModel.load_from_dict(model_dict)
    gpt_model.new_session()
    logging.info("Session Refreshed")
    return {'session_info': gpt_model.sessions_info[-1],
            'serialized_model': gpt_model.serialize()}


@eel.expose
def change_sys_msg(sys_msg: str, model_dict: dict):
    logging.info("Received Request to change system message")
    logging.info("Initializing Model Instance...")
    gpt_model = GptModel.load_from_dict(model_dict)
    gpt_model.sys_msg = {'role': 'system', 'content': sys_msg}
    prev_session = refresh_session(gpt_model)
    logging.info("System Message was changed")
    return {'sys_msg': sys_msg,
            'session_info': prev_session,
            'serialized_model': gpt_model.serialize()}


eel.start('index.html', size=(800, 600))
