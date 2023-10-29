from langchain.memory.chat_message_histories import SQLChatMessageHistory
from langchain.memory import ConversationBufferMemory
from langchain.memory.chat_memory import ChatMessageHistory
from langchain.memory.chat_message_histories import RedisChatMessageHistory
from langchain.llms import OpenAI
from langchain.chains import ConversationChain, LLMChain
from langchain.utilities import GoogleSearchAPIWrapper
from langchain.prompts import PromptTemplate
from langchain.memory import ConversationBufferWindowMemory

def process_response(human_input, user_id):
    chat_message_history = SQLChatMessageHistory(
        session_id=user_id,
        connection_string='sqlite:///sqlite.db'
    )

    memory = ConversationBufferMemory(
        memory_key="chat_history", chat_memory=chat_message_history
    )

    template = """Healthcare Assistant is designed to be able to assist an elder with various tasks, especially those related to health concerns.
    {chat_history}
    Human: {human_input}
    Healthcare Assistant:"""

    prompt = PromptTemplate(input_variables=["human_input"], template=template)


    chatgpt_chain = LLMChain(
        llm=OpenAI(temperature=0, openai_api_key=""),
        prompt=prompt,
        verbose=True,
        memory=memory, # ConversationBufferWindowMemory(k=10)
    )

    # print(chat_message_history.messages)

    output = chatgpt_chain.predict(human_input=human_input)
    # print(output)
    return output

# Example run: 
user_input = "What is my name?"
session_id = '0000'
result = process_response(user_input, session_id)
print(result)