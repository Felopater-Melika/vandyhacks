from langchain.memory.chat_message_histories import SQLChatMessageHistory
from langchain.memory import ConversationBufferMemory
from langchain.memory.chat_memory import ChatMessageHistory
from langchain.memory.chat_message_histories import RedisChatMessageHistory
from langchain.llms import OpenAI
from langchain.chains import ConversationChain, LLMChain
from langchain.utilities import GoogleSearchAPIWrapper
from langchain.prompts import PromptTemplate
from langchain.memory import ConversationBufferWindowMemory
import asyncio
import os
from dotenv import load_dotenv

async def generate_report(user_id):
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

    prompt = PromptTemplate(input_variables=["chat_history"], template=template)

    openai_key = os.environ['OPENAI_API_KEY']
    chatgpt_chain = LLMChain(
        llm=OpenAI(temperature=0, openai_api_key=openai_key),
        prompt=prompt,
        verbose=True,
        memory=memory, 
    )

    # print(chat_message_history.messages)

    output = await chatgpt_chain.apredict()
    # print(output)
    return output

async def process_response(human_input, user_id):
    chat_message_history = SQLChatMessageHistory(
        session_id=user_id,
        connection_string='sqlite:///sqlite.db'
    )
    print(chat_message_history.messages)

    memory = ConversationBufferMemory(
        memory_key="chat_history", chat_memory=chat_message_history
    )

    template = """Healthcare Assistant is designed to be able to assist an elder with various tasks, especially those related to health concerns.
    {chat_history}
    Human: {human_input}
    Healthcare Assistant:"""

    prompt = PromptTemplate(input_variables=["human_input","chat_history"], template=template)


    openai_key = os.environ['OPENAI_API_KEY']
    chatgpt_chain = LLMChain(
        llm=OpenAI(temperature=0, openai_api_key=openai_key),
        prompt=prompt,
        verbose=True,
        memory=memory, # ConversationBufferWindowMemory(k=10)
    )


    output = await chatgpt_chain.apredict(human_input=human_input)
    # print(output)
    return output


if __name__ == "__main__":
    load_dotenv()
    async def main():
        response = await process_response("say your name is Alex", 'einar')
        print(response)
    asyncio.run(main())
