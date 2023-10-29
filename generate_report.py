from langchain.memory.chat_message_histories import SQLChatMessageHistory
from langchain.memory import ConversationBufferMemory
from langchain.memory.chat_memory import ChatMessageHistory
from langchain.memory.chat_message_histories import RedisChatMessageHistory
from langchain.llms import OpenAI
from langchain.chains import ConversationChain, LLMChain
from langchain.utilities import GoogleSearchAPIWrapper
from langchain.prompts import PromptTemplate
from langchain.memory import ConversationBufferWindowMemory

def generate_report(human_input, user_id):
    chat_message_history = SQLChatMessageHistory(
        session_id=user_id,
        connection_string='sqlite:///sqlite.db'
    )

    memory = ConversationBufferMemory(
        memory_key="chat_history", chat_memory=chat_message_history
    )

    template = """
    Chat history between the elderly user and the AI Healthcare Assistant:
    {chat_history}
    Now, based on the text of the most recent chat below, describe any imminent or potential health issues the elderly user mentioned. Please be SURE to note that the below chat is also in the chat history above as the last entry so do not consider it twice. If the elder reports a problem that has been mentioned in past chats and there is pertinent information from those past chats, then say so. If there are no problems with their health, say that there are no problems with their health. Be accurate and specific! 
    Chat: {human_input}
    Healthcare Assistant:"""

    prompt = PromptTemplate(input_variables=["human_input"], template=template)


    chatgpt_chain = LLMChain(
        llm=OpenAI(temperature=0, openai_api_key=""),
        prompt=prompt,
        verbose=True,
        memory=memory, 
    )

    # print(chat_message_history.messages)

    output = chatgpt_chain.predict(human_input=human_input)
    # print(output)
    return output

# Example run: 
recent_chat = "What is my name again?"
session_id = '0000'
result = generate_report(recent_chat, session_id)
print(result)